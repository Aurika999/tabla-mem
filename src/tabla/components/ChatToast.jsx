import { useEffect } from 'react';

const VISIBLE_MS = 7000;

export default function ChatToast({ incoming, onOpen, onDismiss }) {
  useEffect(() => {
    if (!incoming) return undefined;
    const id = setTimeout(onDismiss, VISIBLE_MS);
    return () => clearTimeout(id);
  }, [incoming, onDismiss]);

  if (!incoming) return null;

  return (
    <div className="chat-toast" role="status">
      <button className="chat-toast-body" onClick={() => onOpen(incoming.peer)}>
        <b>💬 {incoming.peer.name} ți-a scris</b>
        <span>{incoming.text}</span>
        <small>Apasă ca să răspunzi</small>
      </button>
      <button className="chat-toast-close" onClick={onDismiss} aria-label="Închide">×</button>
    </div>
  );
}
