import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { useState, useEffect } from "react";
import App from "./App.tsx";
import Preloader from "./components/Preloader.tsx";
import "./index.css";
import "./i18n";

function Root() {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Wait for fonts to load
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      // Fallback for browsers without font loading API
      setTimeout(() => setFontsLoaded(true), 500);
    }
  }, []);

  return (
    <HelmetProvider>
      {!isPreloaderComplete && (
        <Preloader 
          onComplete={() => setIsPreloaderComplete(true)}
          minimumDuration={fontsLoaded ? 2400 : 3000}
        />
      )}
      {isPreloaderComplete && <App />}
    </HelmetProvider>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
