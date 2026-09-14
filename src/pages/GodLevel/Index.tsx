import { useEffect, useRef } from 'react';
import './GodLevel.css';
import rawHtml from './GodLevelContentCleaned.html?raw';
import rawJs from './GodLevelCleaned.js?raw';

export default function GodLevelIndex() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Inject the HTML
    if (containerRef.current) {
      containerRef.current.innerHTML = rawHtml;
    }

    // 2. Inject the JS globally so that `onclick="..."` handlers in the HTML work.
    // We append a script tag to the body.
    const script = document.createElement('script');
    script.id = 'god-level-script';
    script.textContent = rawJs;

    // Remove existing script to prevent duplicate listeners if HMR fires
    const existingScript = document.getElementById('god-level-script');
    if (existingScript) {
        existingScript.remove();
        // @ts-ignore
        window._stopCursor = true; // Stop old RAF loop
    }
    
    // @ts-ignore
    window._stopCursor = false;
    document.body.appendChild(script);

    // 3. Add Google Fonts for Cinzel and Cormorant Garamond
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300..600;1,9..40,300..600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Cleanup when component unmounts
    return () => {
      const existingScript = document.getElementById('god-level-script');
      if (existingScript) existingScript.remove();
      // @ts-ignore
      window._stopCursor = true;
    };
  }, []);

  return <div ref={containerRef} />;
}
