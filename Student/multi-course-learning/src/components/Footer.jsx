const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-1 fw-semibold">MultiCourse Hub</p>
        <p className="mb-0 small text-secondary">
          © {new Date().getFullYear()} MultiCourse Hub. Learn anywhere, anytime.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

