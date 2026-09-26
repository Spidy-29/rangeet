import { useEffect, useState, useMemo } from "react";
import styles from "./FloatingPlayer.module.css";
import { useRadioPlayer } from "../RadioPlayer";
import { STATION_CONFIGS } from "../constants/stations";

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function FloatingPlayer() {
  const {
    station,
    mode,
    togglePlay,
    nextTrack,
    prevTrack,
    volume,
    setVolume,
    currentTime,
    duration,
    seekTo,
    videoTitle,
    videoAuthor,
  } = useRadioPlayer();

  const [scrolled, setScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        nextTrack();
      } else if (e.code === "ArrowLeft") {
        prevTrack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, nextTrack, prevTrack]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // When scrolling back to top, auto-expand so the player is ready
  useEffect(() => {
    if (!scrolled) {
      setIsExpanded(false); // Reset to base state which is non-minimized when at top
    }
  }, [scrolled]);

  const st = STATION_CONFIGS[station];
  const off = mode === "idle";
  const playing = mode === "playing";
  const tuning = mode === "tuning";

  // Derive display title: prefer real YouTube video title, fallback to station info
  const displayTitle = videoTitle || st.now.split("·")[0].trim();
  const displaySubtitle = videoAuthor || st.roman;

  // Seek bar progress percentage
  const seekPercent = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return Math.min((currentTime / duration) * 100, 100);
  }, [currentTime, duration]);

  const isMinimized = scrolled && !isExpanded;

  return (
    <div className={`${styles.container} ${scrolled ? styles.scrolled : ""} ${isMinimized ? styles.minimized : ""}`}>
      {isMinimized ? (
        <div 
          className={`${styles.playerPanel} ${styles.minimizedPanel}`}
          onClick={() => setIsExpanded(true)}
          role="button"
          tabIndex={0}
          aria-label="Expand player"
        >
          <div className={styles.trackInfo}>
            {/* Equalizer for minimized */}
            <div className={styles.equalizer}>
              <span className={playing ? styles.barAnim : ""} />
              <span className={playing ? styles.barAnim : ""} />
              <span className={playing ? styles.barAnim : ""} />
            </div>
            <div className={styles.titles}>
              <div className={`${styles.title} ${tuning ? styles.dimmedText : ""}`}>{displayTitle}</div>
            </div>
          </div>
          
          <button 
            className={`${styles.playPauseBtnMini} ${tuning ? styles.tuningPulse : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }} 
            aria-label="Play/Pause"
          >
            {off ? (
              <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            )}
          </button>
        </div>
      ) : (
        <div className={styles.playerPanel}>
          <div className={styles.mainControlsRow}>
            <div className={styles.trackInfo}>
              {/* Equalizer animation */}
              <div className={styles.equalizer}>
                <span className={playing ? styles.barAnim : ""} />
                <span className={playing ? styles.barAnim : ""} />
                <span className={playing ? styles.barAnim : ""} />
              </div>
              <div className={styles.titles}>
                {(playing || tuning) && (
                  <div className={styles.nowPlayingLabel}>
                    <span className={styles.nowPlayingDot} />
                    {tuning ? "TUNING..." : "NOW PLAYING"}
                  </div>
                )}
                <div className={`${styles.title} ${styles.titleExpanded} ${tuning ? styles.dimmedText : ""}`}>{displayTitle}</div>
                <div className={`${styles.subtitle} ${tuning ? styles.dimmedText : ""}`}>{displaySubtitle}</div>
                {/* Station badge */}
                <div className={styles.stationBadge} style={{ borderColor: st.accent + '60', color: st.accent }}>
                  {st.label}
                </div>
              </div>
            </div>

            <div className={styles.controls}>
              <button className={styles.iconBtn} onClick={prevTrack} aria-label="Previous Track" title="Previous Track (Left Arrow)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" /></svg>
              </button>
              
              <button className={`${styles.playPauseBtn} ${tuning ? styles.tuningPulse : ""}`} onClick={togglePlay} aria-label="Play/Pause" title="Play/Pause (Space)">
                {off ? (
                  <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                ) : tuning ? (
                  <div className={styles.tuningSpinner} />
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                )}
              </button>
              
              <button className={styles.iconBtn} onClick={nextTrack} aria-label="Next Track" title="Next Track (Right Arrow)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></svg>
              </button>
            </div>

            <div className={styles.volGroup}>
              {scrolled && (
                <button 
                  className={styles.minimizeBtn} 
                  onClick={() => setIsExpanded(false)}
                  aria-label="Minimize player"
                  title="Minimize"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
              )}
              <svg className={styles.volIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className={`${styles.rangeSlider} ${styles.volSlider}`}
                aria-label="Volume control"
              />
            </div>
          </div>

          <div className={styles.seekGroup}>
            <span className={styles.timeLabel}>{formatTime(currentTime)}</span>
            <div className={styles.seekBarWrap}>
              <div className={styles.seekBarFill} style={{ width: `${seekPercent}%` }} />
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seekTo(Number(e.target.value))}
                className={`${styles.rangeSlider} ${styles.seekSlider}`}
                aria-label="Seek time"
              />
            </div>
            <span className={styles.timeLabel}>{formatTime(duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
