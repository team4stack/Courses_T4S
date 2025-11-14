import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient.js';
import { AuthContext } from './AuthContext.js';

const fetchProfile = async (userId) => {
  if (!userId) return null;
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('[AuthContext] Failed to load profile', error);
    throw error;
  }

  return data;
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('[AuthContext] Error getting session', error);
        }
        if (!isMounted) return;

        setSession(initialSession);
        if (initialSession?.user) {
          const userProfile = await fetchProfile(initialSession.user.id);
          if (isMounted) {
            setProfile(userProfile);
          }
        }
      } catch (err) {
        console.error('[AuthContext] Init failure', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        try {
          const userProfile = await fetchProfile(newSession.user.id);
          setProfile(userProfile);
        } catch (err) {
          console.error('[AuthContext] Auth change profile error', err);
        }
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (!session?.user) return null;
    const updated = await fetchProfile(session.user.id);
    setProfile(updated);
    return updated;
  };

  const signIn = async ({ email, password }) => {
    const {
      data: { session: loggedSession },
      error,
    } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    setSession(loggedSession);
    const userProfile = await fetchProfile(loggedSession.user.id);
    setProfile(userProfile);

    const redirectTo =
      (location.state && location.state.redirectTo) ||
      (userProfile?.role === 'admin' ? '/admin' : '/courses');
    navigate(redirectTo, { replace: true });
  };

  const signUp = async ({ email, password, name }) => {
    const {
      data: { user, session: signUpSession },
      error,
    } = await supabase.auth.signUp({ email, password });

    if (error) {
      throw error;
    }

    if (user) {
      const { error: profileError } = await supabase.from('users').upsert({
        id: user.id,
        name,
        email: user.email,
        role: 'student',
      });

      if (profileError) {
        console.error('[AuthContext] Failed to create profile', profileError);
        throw profileError;
      }

      if (signUpSession) {
        setSession(signUpSession);
      }

      const newProfile = await fetchProfile(user.id);
      setProfile(newProfile);
      navigate('/courses', { replace: true });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setSession(null);
    setProfile(null);
    navigate('/', { replace: true });
  };

  const enrollInCourse = async (courseId) => {
    if (!session?.user) {
      throw new Error('User must be authenticated to enroll.');
    }

    const { error } = await supabase.from('progress').upsert(
      {
        user_id: session.user.id,
        course_id: courseId,
        video_id: null,
        completed: false,
      },
      { onConflict: 'user_id,course_id,video_id' }
    );

    if (error) {
      throw error;
    }
  };

  const updateVideoProgress = async ({ courseId, videoId, completed, score }) => {
    if (!session?.user) {
      throw new Error('User must be authenticated to update progress.');
    }

    const { error } = await supabase.from('progress').upsert(
      {
        user_id: session.user.id,
        course_id: courseId,
        video_id: videoId,
        completed,
        score,
      },
      { onConflict: 'user_id,video_id' }
    );

    if (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        enrollInCourse,
        updateVideoProgress,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


