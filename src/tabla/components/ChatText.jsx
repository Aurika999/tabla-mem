// Textul unui mesaj din chat: linkurile devin clicabile, iar linkurile video se pot vedea direct în chat.
import { useState } from 'react';
import { tr } from '../i18n';

// http(s)://… sau www.…; punctuația de la final („vezi asta: https://x.ro.”) nu face parte din link.
const URL_RE = /((?:https?:\/\/|www\.)[^\s<>"]+[^\s<>".,;:!?)\]}'”])/gi;

export function toHref(link) {
  const href = /^www\./i.test(link) ? `https://${link}` : link;
  try {
    const url = new URL(href);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

// Ce fel de video e linkul: YouTube / Vimeo (în cadru) sau un fișier video (în player).
export function videoOf(href) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.)/, '');
  let id = null;
  if (host === 'youtu.be') id = url.pathname.slice(1).split('/')[0];
  else if (host === 'youtube.com' || host === 'music.youtube.com') {
    if (url.pathname === '/watch') id = url.searchParams.get('v');
    else id = (url.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]+)/) || [])[1];
  }
  if (id && /^[\w-]{6,}$/.test(id)) return { kind: 'frame', src: `https://www.youtube-nocookie.com/embed/${id}` };
  if (host === 'vimeo.com') {
    const vimeo = url.pathname.match(/^\/(\d+)/);
    if (vimeo) return { kind: 'frame', src: `https://player.vimeo.com/video/${vimeo[1]}` };
  }
  if (/\.(mp4|webm|ogv|mov|m4v)$/i.test(url.pathname)) return { kind: 'file', src: url.href };
  return null;
}

function VideoPreview({ video }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" className="chat-video-open" onClick={() => setOpen(true)}>
        {tr('▶️ Vezi video')}
      </button>
    );
  }
  return (
    <div className="chat-video">
      {video.kind === 'frame'
        ? (
          <iframe
            src={video.src}
            title={tr('Video')}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )
        : <video src={video.src} controls autoPlay playsInline preload="metadata" />}
    </div>
  );
}

export default function ChatText({ text }) {
  const parts = String(text || '').split(URL_RE);
  const videos = [];
  const content = parts.map((part, i) => {
    if (i % 2 === 0) return part;
    const href = toHref(part);
    if (!href) return part;
    const video = videoOf(href);
    if (video && !videos.some(v => v.src === video.src)) videos.push(video);
    return (
      <a key={i} className="chat-link" href={href} target="_blank" rel="noopener noreferrer nofollow">
        {part}
      </a>
    );
  });
  return (
    <>
      <span className="chat-text">{content}</span>
      {videos.map(video => <VideoPreview key={video.src} video={video} />)}
    </>
  );
}
