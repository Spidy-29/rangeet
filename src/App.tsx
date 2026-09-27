import styles from "./App.module.css";
import { RadioPlayerProvider } from "./RadioPlayer";
import { HeroScene } from "./HeroScene";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SongRequest } from "./components/SongRequest";
import { Footer } from "./components/Footer";
import { FloatingPlayer } from "./components/FloatingPlayer";
import { About } from "./components/About";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { GarbaStrip } from "./components/GarbaStrip";

import { useState, useEffect } from "react";
import { GarbaPage } from "./pages/GarbaPage";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onLocationChange);
    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);

  if (path === "/garba") {
    return (
      <ErrorBoundary>
        <GarbaPage />
        <Analytics />
        <SpeedInsights />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <RadioPlayerProvider>
        <div className={styles.appContainer}>
          <HeroScene />
          <GarbaStrip />
          <About />
          <SongRequest />
          <Footer />
          <FloatingPlayer />
        </div>
      </RadioPlayerProvider>
      <Analytics />
      <SpeedInsights />
    </ErrorBoundary>
  );
}
