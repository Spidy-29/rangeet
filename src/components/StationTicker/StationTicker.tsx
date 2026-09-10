
import styles from "./StationTicker.module.css";
import { STATION_CONFIGS } from "../../constants/stations";

interface StationTickerProps {
  station: number;
  off: boolean;
  tuning: boolean;
  playing: boolean;
  nowPlaying: string;
  glow: string;
}

export function StationTicker({ station, off, tuning, playing, nowPlaying, glow }: StationTickerProps) {
  const innerClass = off ? styles.innerOff : styles.innerOn;
  
  const innerStyle = off 
    ? {} 
    : { boxShadow: `inset 0 0 26px ${glow}, 0 0 22px 2px ${glow}` };

  const needleStyle = {
    left: `calc(${6 + station * 29.3}% )`,
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.inner} ${innerClass}`} style={innerStyle}>
        <div className={styles.stations}>
          {STATION_CONFIGS.map((s, i) => (
            <div
              key={s.freq}
              className={`${styles.freq} ${i === station ? styles.freqActive : styles.freqInactive}`}
            >
              {s.freq}
            </div>
          ))}
        </div>
        <div className={styles.dialTrack}>
          <div className={styles.dialMarks} />
          <div className={styles.dialNeedle} style={needleStyle} />
        </div>
        <div className={styles.screen}>
          <div className={`${styles.ticker} ${playing ? styles.tickerPlaying : styles.tickerIdle}`}>
            <span style={{ paddingRight: 64 }}>{nowPlaying}</span>
            <span style={{ paddingRight: 64 }}>{nowPlaying}</span>
          </div>
          <div className={`${styles.shimmer} ${tuning ? styles.shimmerActive : styles.shimmerInactive}`} />
          {tuning && (
            <div className={styles.loadingText}>
              લોડ થાય છે…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
