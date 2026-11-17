import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { tr } from '../i18n';

// Reclamă Google AdSense, doar pe site (și în jocul instalat din browser).
// ID-urile vin din .env.local: REACT_APP_ADSENSE_CLIENT=ca-pub-… și REACT_APP_ADSENSE_SLOT=….
// Fără ele nu se afișează nimic. În aplicația de Android (Capacitor) AdSense nu e permis:
// acolo se va folosi AdMob.
const CLIENT = process.env.REACT_APP_ADSENSE_CLIENT;
const SLOT = process.env.REACT_APP_ADSENSE_SLOT;

export const adsEnabled = Boolean(CLIENT && SLOT) && !Capacitor.isNativePlatform();

function loadAdSenseScript() {
  if (document.getElementById('adsense-script')) return;
  window.adsbygoogle = window.adsbygoogle || [];
  // Jocul e pentru copii: doar reclame nepersonalizate.
  window.adsbygoogle.requestNonPersonalizedAds = 1;
  const script = document.createElement('script');
  script.id = 'adsense-script';
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
  document.head.appendChild(script);
}

export default function AdBanner() {
  const insRef = useRef(null);

  useEffect(() => {
    if (!adsEnabled) return;
    loadAdSenseScript();
    const ins = insRef.current;
    // React (în modul de dezvoltare) rulează efectul de două ori; o reclamă se cere o singură dată.
    if (!ins || ins.dataset.requested) return;
    ins.dataset.requested = '1';
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // Un blocant de reclame sau o eroare AdSense nu trebuie să strice jocul.
    }
  }, []);

  if (!adsEnabled) {
    // La `npm start`, fără ID-uri AdSense, arătăm unde va sta reclama. Pe site-ul publicat nu apare.
    if (process.env.NODE_ENV !== 'development' || Capacitor.isNativePlatform()) return null;
    return (
      <aside className="ad-banner ad-placeholder">
        <div className="ad-label">{tr('Reclamă')}</div>
        <div>Aici va apărea reclama AdSense (completează REACT_APP_ADSENSE_CLIENT și REACT_APP_ADSENSE_SLOT în .env.local)</div>
      </aside>
    );
  }

  return (
    <aside className="ad-banner" aria-label={tr('Reclamă')}>
      <div className="ad-label">{tr('Reclamă')}</div>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT}
        data-ad-slot={SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-tag-for-child-directed-treatment="1"
      />
    </aside>
  );
}
