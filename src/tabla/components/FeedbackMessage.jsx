import { tr } from '../i18n';
export default function FeedbackMessage({ feedback }) {
  return (
    <div className="feedback" style={{ color: feedback.color || undefined }}>
      {tr(feedback.text)}
    </div>
  );
}
