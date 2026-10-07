import { useEffect, useState } from 'react';

// Sonerie generată din browser (fără fișier audio): două tonuri scurte la fiecare 2 secunde.
function useRingtone(active) {
  useEffect(() => {
    if (!active) return undefined;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return undefined;
    const ctx = new AudioCtx();
    const ring = () => {
      [0, 0.25].forEach(offset => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 660;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + offset + 0.2);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + 0.22);
      });
    };
    ring();
    const id = setInterval(ring, 2000);
    return () => {
      clearInterval(id);
      ctx.close().catch(() => {});
    };
  }, [active]);
}

function useElapsed(since) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!since) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [since]);
  if (!since) return '';
  const seconds = Math.max(0, Math.floor((now - since) / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

const STATUS_TEXT = {
  ringing: 'Se sună…',
  connecting: 'Se conectează…',
};

export default function CallOverlay({
  call, incoming, muted, notice, remoteAudioRef, onAccept, onDecline, onHangUp, onToggleMute,
}) {
  useRingtone(Boolean(incoming));
  const elapsed = useElapsed(call?.status === 'connected' ? call.connectedAt : null);

  return (
    <>
      {/* Mereu montat, ca sunetul celuilalt să aibă unde să meargă. */}
      <audio ref={remoteAudioRef} autoPlay />

      {incoming && !call && (
        <div className="overlay">
          <div className="modal call-modal">
            <div className="reward call-ringing">📞</div>
            <h2>{incoming.peer.name}</h2>
            <p>te sună…</p>
            <div className="call-actions">
              <button className="call-btn accept" onClick={onAccept}>📞 Răspunde</button>
              <button className="call-btn decline" onClick={onDecline}>✖ Refuză</button>
            </div>
          </div>
        </div>
      )}

      {call && (
        <div className="call-bar" role="status">
          <div className="call-bar-info">
            <b>📞 {call.peer.name}</b>
            <span>{call.status === 'connected' ? `În apel · ${elapsed}` : STATUS_TEXT[call.status]}</span>
          </div>
          <button
            className={`call-btn mute${muted ? ' active' : ''}`}
            onClick={onToggleMute}
            title={muted ? 'Pornește microfonul' : 'Oprește microfonul'}
          >
            {muted ? '🔇' : '🎤'}
          </button>
          <button className="call-btn decline" onClick={onHangUp}>Închide</button>
        </div>
      )}

      {notice && !call && <div className="call-notice" role="status">{notice}</div>}
    </>
  );
}
