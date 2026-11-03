import { useEffect, useRef, useState } from 'react';
import { tr } from '../i18n';

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

// Un <video> legat de un flux; sunetul celuilalt merge prin <audio>, deci imaginea e mereu fără sunet.
function StreamVideo({ stream, className }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.srcObject = stream || null;
    if (stream) ref.current.play().catch(() => {});
  }, [stream]);
  return <video ref={ref} className={className} autoPlay playsInline muted />;
}

// Imaginea apare cât timp măcar unul dintre jucători are camera pornită (la apelul vocal, doar sunet).
function CallVideo({ call, cameraOn, peerCamera, localStream, remoteStream, remoteTracks }) {
  const [big, setBig] = useState(false);
  const remoteHasVideo = Boolean(peerCamera && remoteTracks && remoteStream?.getVideoTracks().length);
  const localHasVideo = Boolean(localStream?.getVideoTracks().length);
  if (!cameraOn && !peerCamera) return null;
  return (
    <div className={`call-video${big ? ' big' : ''}`}>
      {remoteHasVideo && call.status === 'connected'
        ? <StreamVideo stream={remoteStream} className="call-video-remote" />
        : (
          <div className="call-video-wait">
            <span className="call-video-initial">{(call.peer.name || '?').slice(0, 1).toUpperCase()}</span>
            <span>{call.status === 'connected' ? call.peer.name : tr(STATUS_TEXT[call.status])}</span>
          </div>
        )}
      {localHasVideo && (
        cameraOn
          ? <StreamVideo stream={localStream} className="call-video-local" />
          : <div className="call-video-local off">📷</div>
      )}
      <button
        type="button"
        className="call-video-size"
        onClick={() => setBig(b => !b)}
        title={big ? tr('Micșorează') : tr('Mărește')}
        aria-label={big ? tr('Micșorează') : tr('Mărește')}
      >
        {big ? '🗗' : '⛶'}
      </button>
    </div>
  );
}

const STATUS_TEXT = {
  ringing: 'Se sună…',
  connecting: 'Se conectează…',
};

export default function CallOverlay({
  call, incoming, muted, notice, remoteAudioRef, onAccept, onDecline, onHangUp, onToggleMute,
  cameraOn, peerCamera, localStream, remoteStream, remoteTracks, onToggleCamera,
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
            <div className="reward call-ringing">{incoming.video ? '📹' : '📞'}</div>
            <h2>{incoming.peer.name}</h2>
            <p>{tr(incoming.video ? 'te sună (apel video)…' : 'te sună…')}</p>
            <div className="call-actions">
              <button className="call-btn accept" onClick={onAccept}>{tr(incoming.video ? '📹 Răspunde' : '📞 Răspunde')}</button>
              <button className="call-btn decline" onClick={onDecline}>{tr('✖ Refuză')}</button>
            </div>
          </div>
        </div>
      )}

      {call && (
        <CallVideo call={call} cameraOn={cameraOn} peerCamera={peerCamera} localStream={localStream} remoteStream={remoteStream} remoteTracks={remoteTracks} />
      )}

      {call && (
        <div className="call-bar" role="status">
          <div className="call-bar-info">
            <b>{call.video || cameraOn || peerCamera ? '📹' : '📞'} {call.peer.name}</b>
            <span>{call.status === 'connected' ? `${tr('În apel')} · ${elapsed}` : tr(STATUS_TEXT[call.status])}</span>
          </div>
          <button
            className={`call-btn mute${muted ? ' active' : ''}`}
            onClick={onToggleMute}
            title={muted ? tr('Pornește microfonul') : tr('Oprește microfonul')}
          >
            {muted ? '🔇' : '🎤'}
          </button>
          <button
            className={`call-btn mute${cameraOn ? '' : ' active'}`}
            onClick={onToggleCamera}
            title={cameraOn ? tr('Oprește camera') : tr('Pornește camera')}
            aria-label={cameraOn ? tr('Oprește camera') : tr('Pornește camera')}
          >
            {cameraOn ? '📹' : '🚫'}
          </button>
          <button className="call-btn decline" onClick={onHangUp}>{tr('Închide')}</button>
        </div>
      )}

      {notice && <div className={`call-notice${call ? ' raised' : ''}`} role="status">{tr(notice)}</div>}
    </>
  );
}
