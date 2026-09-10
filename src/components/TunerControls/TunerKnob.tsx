import { useState } from "react";
import styles from "./TunerControls.module.css";

interface TunerKnobProps {
  spin: number;
  off: boolean;
  accent: string;
  glow: string;
  onClick: () => void;
  size?: "large" | "small";
}

export function TunerKnob({ spin, off, accent, glow, onClick, size = "large" }: TunerKnobProps) {
  const [hover, setHover] = useState(false);
  
  const isLarge = size === "large";
  
  const knobStyle = {
    width: isLarge ? 106 : 76,
    height: isLarge ? 106 : 76,
    padding: isLarge ? 9 : 7,
    boxShadow: `inset 0 0 0 1px rgba(0,0,0,.35), 0 ${isLarge ? 10 : 8}px ${isLarge ? 20 : 16}px rgba(0,0,0,.4)${hover ? `, 0 0 ${isLarge ? 26 : 24}px 4px ${glow}` : ""}`,
  };

  const needleStyle = {
    width: isLarge ? 4 : 3.5,
    height: isLarge ? 26 : 20,
    marginLeft: isLarge ? -2 : -1.75,
    top: isLarge ? 8 : 6,
    background: off ? "rgba(230,210,180,.5)" : accent,
    boxShadow: off ? "none" : `0 0 12px 2px ${glow}`,
  };

  return (
    <div
      className={`${styles.knobContainer} tune-press`}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        transform: hover ? "scale(1.04)" : "none",
        gap: isLarge ? 9 : 7,
      }}
    >
      <div className={styles.knobOuter} style={knobStyle}>
        <div 
          className={styles.knobInner} 
          style={{ transform: `rotate(${spin}deg)` }}
        >
          <div className={styles.needle} style={needleStyle} />
        </div>
      </div>
      <div className={styles.label}>
        TUNE
      </div>
    </div>
  );
}
