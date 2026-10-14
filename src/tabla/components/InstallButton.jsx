import { useEffect, useState } from 'react';

// Aplicația e deja deschisă ca aplicație instalată (de pe ecranul principal)?
function isInstalled() {
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// iPhone / iPad (inclusiv iPad-urile noi, care se prezintă drept Mac cu ecran tactil).
function isIos() {
  const ua = window.navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

// Butonul „📲 Instalează”: pe Android/Chrome deschide fereastra de instalare a browserului,
// iar pe iPhone (unde Safari nu are așa ceva) arată pașii „Partajează → Adaugă pe ecranul principal”.
export default function InstallButton() {
  const [prompt, setPrompt] = useState(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [installed, setInstalled] = useState(isInstalled);

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setPrompt(e);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return null;

  const handleClick = async () => {
    if (prompt) {
      try {
        await prompt.prompt();
        await prompt.userChoice;
        setPrompt(null);
        return;
      } catch {
        // Browserul n-a lăsat fereastra de instalare: arătăm pașii.
      }
    }
    setGuideOpen(true);
  };

  const ios = isIos();
  return (
    <>
      <button onClick={handleClick}><span>📲</span>Instalează</button>
      {guideOpen && (
        <div className="overlay lesson-overlay" onClick={() => setGuideOpen(false)} role="dialog" aria-modal="true" aria-label="Instalează aplicația">
          <div className="modal install-modal" onClick={e => e.stopPropagation()}>
            <button className="lesson-close" onClick={() => setGuideOpen(false)} aria-label="Închide">✕</button>
            <h2>📲 Instalează jocul</h2>
            <p className="install-lead">Pune <b>Tabla Înmulțirii</b> pe ecranul telefonului, ca pe o aplicație adevărată!</p>
            {ios ? (
              <ol className="install-steps">
                <li>Deschide jocul în <b>Safari</b> (browserul cu busolă 🧭).</li>
                <li>Apasă butonul <b>Partajează</b> <span className="install-key">⬆️</span> din bara de jos.</li>
                <li>Derulează și alege <b>„Adaugă pe ecranul principal”</b> <span className="install-key">➕</span>.</li>
                <li>Apasă <b>„Adaugă”</b> în colțul din dreapta-sus.</li>
                <li>Gata! Pe ecran apare iconița cu <b>socotelnița 🧮</b>. Jocul se deschide pe tot ecranul.</li>
              </ol>
            ) : (
              <ol className="install-steps">
                <li>Deschide meniul browserului <span className="install-key">⋮</span> (sus, în dreapta).</li>
                <li>Alege <b>„Instalează aplicația”</b> sau <b>„Adaugă pe ecranul de pornire”</b>.</li>
                <li>Confirmă cu <b>„Instalează”</b>. Pe ecran apare iconița cu <b>socotelnița 🧮</b>.</li>
              </ol>
            )}
            <p className="install-note">Progresul tău rămâne același: te conectezi cu același cont.</p>
            <button className="bigbtn lesson-ok" onClick={() => setGuideOpen(false)}>👍 Am înțeles!</button>
          </div>
        </div>
      )}
    </>
  );
}
