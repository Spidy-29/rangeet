import { CSSProperties } from "react";
import styles from "./BackgroundVisuals.module.css";
import { StationParticle } from "../../constants/stations";

interface ParticlesProps {
  off: boolean;
  tuning: boolean;
  particleType: StationParticle;
  accent: string;
  glow: string;
  isLightMode?: boolean;
  sceneType: "radio" | "stage";
}

export function Particles({ off, tuning, particleType, accent, glow, isLightMode, sceneType }: ParticlesProps) {
  if (off) return null;
  
  const particles: { key: number; style: CSSProperties }[] = [];
  const isRadio = sceneType === "radio";
  
  // N is slightly different between Radio and Stage
  const n = particleType === "diya" ? 16 : particleType === "seed" ? (isRadio ? 13 : 12) : 20;
  
  for (let i = 0; i < n; i++) {
    const big = particleType === "diya";
    const size = big ? 5 + (i % 3) * 3 : particleType === "seed" ? (isRadio ? 3 + (i % 2) * 2 : 2 + (i % 3)) : 2 + (i % 3);
    
    // Left and bottom positions differ
    const leftBase = isRadio ? 3 + ((i * 6.1) % 94) : 3 + ((i * 6.3) % 94);
    const bottomBase = isRadio ? 2 + ((i * 13) % 46) : 16 + ((i * 11) % 40);
    
    // Background color differs based on scene and mode
    let background = "rgba(255,240,210,.85)";
    if (big) {
      background = accent;
    } else if (!isRadio && isLightMode) {
      background = "rgba(255,255,255,.75)";
    }
    
    const animationName = isRadio ? "gnr-float" : "gs-float";
    const animationDur = isRadio ? 9 + (i % 7) * 2.4 : 10 + (i % 7) * 2.4;
    const animationDelay = isRadio ? (i * 0.83).toFixed(2) : (i * 0.81).toFixed(2);
    
    particles.push({
      key: i,
      style: {
        left: `${leftBase}%`,
        bottom: `${bottomBase}%`,
        width: size,
        height: size,
        background: background,
        boxShadow: big ? `0 0 ${size * 4}px ${size}px ${glow}` : (isRadio ? `0 0 ${size * 3}px rgba(255,235,190,.5)` : `0 0 ${size * 3}px rgba(255,240,210,.45)`),
        animation: `${animationName} ${animationDur}s linear ${animationDelay}s infinite`,
        opacity: tuning ? 0.5 : 1,
      },
    });
  }

  return (
    <div className={styles.particlesContainer}>
      {particles.map((p) => (
        <span key={p.key} className={styles.particle} style={p.style} />
      ))}
    </div>
  );
}

interface BulbsProps {
  off: boolean;
  gold: string;
  glow: string;
}

export function Bulbs({ off, gold, glow }: BulbsProps) {
  const bulbs = Array.from({ length: 17 }, (_, i) => {
    const sag = Math.sin((i / 16) * Math.PI) * 56;
    return {
      key: i,
      style: {
        marginTop: sag,
        background: off ? "rgba(120,104,80,.5)" : gold,
        boxShadow: off ? "none" : `0 0 16px 5px ${glow}`,
        animation: off ? "none" : `gnr-flicker ${2.2 + (i % 5) * 0.7}s ease-in-out ${(i * 0.19).toFixed(2)}s infinite`,
      } as CSSProperties,
    };
  });

  return (
    <>
      {bulbs.map((b) => (
        <span key={b.key} className={styles.bulb} style={b.style} />
      ))}
    </>
  );
}
