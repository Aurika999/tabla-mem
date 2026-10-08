const COLORS = ['#e84d8d', '#f4a623', '#5fc84a', '#20a8e8', '#9258d8', '#14a3a3', '#e0632c'];

// Culoare stabilă din nume, ca același jucător să aibă mereu aceeași culoare.
function colorFor(name = '') {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.codePointAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

// Acceptăm doar imagini salvate de noi (JPEG ca data URL), nu linkuri externe.
function isSafeAvatar(src) {
  return typeof src === 'string' && src.startsWith('data:image/jpeg;base64,');
}

export default function Avatar({ src, name, size = 32 }) {
  const style = { width: size, height: size, fontSize: Math.round(size * 0.45) };
  if (isSafeAvatar(src)) {
    return <img className="avatar" src={src} alt={name || ''} style={style} />;
  }
  const initial = (name || '?').trim().charAt(0).toUpperCase() || '?';
  return (
    <span className="avatar avatar-initial" style={{ ...style, background: colorFor(name) }} aria-hidden="true">
      {initial}
    </span>
  );
}
