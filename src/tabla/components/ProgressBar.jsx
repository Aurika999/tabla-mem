export default function ProgressBar({ current, total }) {
  return (
    <div className="progress">
      <div style={{ width: `${(current / total) * 100}%` }} />
    </div>
  );
}
