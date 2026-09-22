export default function FeedbackMessage({ feedback }) {
  return (
    <div className="feedback" style={{ color: feedback.color || undefined }}>
      {feedback.text}
    </div>
  );
}
