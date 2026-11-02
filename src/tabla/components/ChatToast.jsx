import { useEffect } from 'react';
import { tr } from '../i18n';

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
        <b>💬 {tr('{name} ți-a scris', { name: incoming.peer.name })}</b>
        <span>{incoming.text}</span>
        <small>{tr('Apasă ca să răspunzi')}</small>
      </button>
      <button className="chat-toast-close" onClick={onDismiss} aria-label={tr('Închide')}>×</button>
    </div>
  );
}
