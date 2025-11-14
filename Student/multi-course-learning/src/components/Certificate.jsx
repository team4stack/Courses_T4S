const Certificate = ({ courseName, studentName }) => {
  return (
    <div className="card border-success shadow-sm my-4">
      <div className="card-body text-center">
        <h5 className="card-title text-success">Course Completed</h5>
        <p className="card-text">
          Congratulations <strong>{studentName}</strong>! You have successfully completed the{' '}
          <strong>{courseName}</strong> course.
        </p>
        <p className="text-secondary small">Downloadable certificates can be enabled after integrating a PDF service.</p>
      </div>
    </div>
  );
};

export default Certificate;

