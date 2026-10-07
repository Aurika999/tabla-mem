import { countryName, isValidCountry } from '../countries';

// Imagine, nu emoji: Windows nu afișează steagurile emoji (arată doar „RO”).
export default function Flag({ code }) {
  if (!isValidCountry(code)) return null;
  const lower = code.toLowerCase();
  const name = countryName(code);
  return (
    <img
      className="flag"
      src={`https://flagcdn.com/24x18/${lower}.png`}
      srcSet={`https://flagcdn.com/48x36/${lower}.png 2x`}
      width="24"
      height="18"
      alt={name}
      title={name}
      loading="lazy"
    />
  );
}
