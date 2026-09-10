import { useState } from "react";
import styles from "./TunerControls.module.css";

interface PlayButtonProps {
  off: boolean;
  playing: boolean;
  accent: string;
  accent2: string;
  glow: string;
  onClick: () => void;
  size?: "large" | "small";
}

export function PlayButton({ off, playing, accent, accent2, glow, onClick, size = "large" }: PlayButtonProps) {
  const [hover, setHover] = useState(false);
  const isLarge = size === "large";

  const buttonStyle = {
    width: isLarge ? 116 : 92,
    height: isLarge ? 116 : 92,
    padding: isLarge ? 11 : 9,
    boxShadow: `0 ${isLarge ? 12 : 9}px 0 rgba(60,32,10,.55), 0 ${isLarge ? 20 : 16}px ${isLarge ? 30 : 26}px rgba(0,0,0,.5)${hover ? `, 0 0 ${isLarge ? 32 : 30}px 6px ${glow}` : ""}`,
    transform: hover ? "translateY(-2px)" : "none",
  };

  const innerStyle = {
    background: off 
      ? "radial-gradient(circle at 36% 26%,#3c2a17,#160d05)"
      : `radial-gradient(circle at 36% 26%,${accent},${accent2})`,
    boxShadow: off 
      ? "inset 0 -6px 14px rgba(0,0,0,.6)" 
      : `inset 0 -6px 14px rgba(0,0,0,.4), 0 0 ${isLarge ? 30 : 26}px 4px ${glow}`,
  };

  const playTriangleStyle = {
    marginLeft: isLarge ? 6 : 5,
    borderLeftWidth: isLarge ? 26 : 22,
    borderTopWidth: isLarge ? 16 : 14,
    borderBottomWidth: isLarge ? 16 : 14,
  };

  const pauseLinesStyle = {
    width: isLarge ? 24 : 21,
    height: isLarge ? 30 : 26,
    borderLeftWidth: isLarge ? 8 : 7,
    borderRightWidth: isLarge ? 8 : 7,
  };

  return (
    <div className={styles.playContainer}>
      <div
        className={`${styles.playBtn} pressable`}
        role="button"
        aria-label="Play"
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={buttonStyle}
      >
        <div className={styles.playInner} style={innerStyle}>
          {off ? (
            <div className={styles.playTriangle} style={playTriangleStyle} />
          ) : (
            <div className={styles.pauseLines} style={pauseLinesStyle} />
          )}
        </div>
      </div>
      <div className={styles.playLabel}>
        {off ? "ચાલુ કરો" : playing ? "વાગે છે" : "ટ્યુનિંગ"}
      </div>
    </div>
  );
}
