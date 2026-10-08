// Micșorează poza aleasă la un avatar pătrat mic (JPEG), ca să încapă în
// profilul din Firestore fără Firebase Storage (care cere plan cu plată).
const AVATAR_SIZE = 160;
const JPEG_QUALITY = 0.82;
export const MAX_AVATAR_CHARS = 100000;
const MAX_INPUT_BYTES = 15 * 1024 * 1024;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('invalid-image'));
    };
    img.src = url;
  });
}

export async function fileToAvatar(file) {
  if (!file || !file.type.startsWith('image/')) throw new Error('not-image');
  if (file.size > MAX_INPUT_BYTES) throw new Error('too-big');
  const img = await loadImage(file);

  // Decupăm pătratul din mijloc, ca fața să rămână centrată.
  const side = Math.min(img.naturalWidth, img.naturalHeight);
  const sx = (img.naturalWidth - side) / 2;
  const sy = (img.naturalHeight - side) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  const ctx = canvas.getContext('2d');
  // Fundal alb pentru PNG-uri transparente (JPEG nu are transparență).
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
  ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);

  let quality = JPEG_QUALITY;
  let dataUrl = canvas.toDataURL('image/jpeg', quality);
  while (dataUrl.length > MAX_AVATAR_CHARS && quality > 0.4) {
    quality -= 0.1;
    dataUrl = canvas.toDataURL('image/jpeg', quality);
  }
  if (dataUrl.length > MAX_AVATAR_CHARS) throw new Error('too-big');
  return dataUrl;
}
