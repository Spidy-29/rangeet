import styles from "./App.module.css";
import { RadioPlayerProvider } from "./RadioPlayer";
import { HeroScene } from "./HeroScene";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SongRequest } from "./components/SongRequest";
import { Footer } from "./components/Footer";
import { FloatingPlayer } from "./components/FloatingPlayer";
import { About } from "./components/About";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <ErrorBoundary>
      <RadioPlayerProvider>
        <div className={styles.appContainer}>
          <HeroScene />
          <About />
          <SongRequest />
          <Footer />
          <FloatingPlayer />
          <Analytics />
        </div>
      </RadioPlayerProvider>
    </ErrorBoundary>
  );
}
