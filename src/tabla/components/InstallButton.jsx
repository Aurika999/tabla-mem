import { useEffect, useState } from 'react';
import { tr } from '../i18n';

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
      <button onClick={handleClick}><span>📲</span>{tr('Instalează')}</button>
      {guideOpen && (
        <div className="overlay lesson-overlay" onClick={() => setGuideOpen(false)} role="dialog" aria-modal="true" aria-label={tr('Instalează aplicația')}>
          <div className="modal install-modal" onClick={e => e.stopPropagation()}>
            <button className="lesson-close" onClick={() => setGuideOpen(false)} aria-label={tr('Închide')}>✕</button>
            <h2>{tr('📲 Instalează jocul')}</h2>
            <p className="install-lead" dangerouslySetInnerHTML={{ __html: tr('Pune <b>Math Owl</b> pe ecranul telefonului, ca pe o aplicație adevărată!') }} />
            {ios ? (
              <ol className="install-steps">
                {[
                  'Deschide jocul în <b>Safari</b> (browserul cu busolă 🧭).',
                  'Apasă butonul <b>Partajează</b> <span class="install-key">⬆️</span> din bara de jos.',
                  'Derulează și alege <b>„Adaugă pe ecranul principal”</b> <span class="install-key">➕</span>.',
                  'Apasă <b>„Adaugă”</b> în colțul din dreapta-sus.',
                  'Gata! Pe ecran apare iconița cu <b>socotelnița 🧮</b>. Jocul se deschide pe tot ecranul.',
                ].map(step => <li key={step} dangerouslySetInnerHTML={{ __html: tr(step) }} />)}
              </ol>
            ) : (
              <ol className="install-steps">
                {[
                  'Deschide meniul browserului <span class="install-key">⋮</span> (sus, în dreapta).',
                  'Alege <b>„Instalează aplicația”</b> sau <b>„Adaugă pe ecranul de pornire”</b>.',
                  'Confirmă cu <b>„Instalează”</b>. Pe ecran apare iconița cu <b>socotelnița 🧮</b>.',
                ].map(step => <li key={step} dangerouslySetInnerHTML={{ __html: tr(step) }} />)}
              </ol>
            )}
            <p className="install-note">{tr('Progresul tău rămâne același: te conectezi cu același cont.')}</p>
            <button className="bigbtn lesson-ok" onClick={() => setGuideOpen(false)}>{tr('👍 Am înțeles!')}</button>
          </div>
        </div>
      )}
    </>
  );
}
