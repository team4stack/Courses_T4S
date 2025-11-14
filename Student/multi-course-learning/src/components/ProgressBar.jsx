const ProgressBar = ({ completed, total }) => {
  if (!total || total === 0) {
    return null;
  }
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="progress" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
      <div
        className="progress-bar bg-success"
        style={{ width: `${percentage}%` }}
      >{`${percentage}%`}</div>
    </div>
  );
};

export default ProgressBar;

