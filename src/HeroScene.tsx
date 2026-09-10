import { useEffect, useState } from "react";
import styles from "./HeroScene.module.css";
import { useRadioPlayer } from "./RadioPlayer";
import { STATION_CONFIGS } from "./constants/stations";
import { logCustomEvent } from "./firebase";

export function HeroScene() {
  const { station, mode, goToStation } = useRadioPlayer();
  const [bgImage, setBgImage] = useState(STATION_CONFIGS[station].image);
  const [fade, setFade] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setFade(true);
    const timer = setTimeout(() => {
      setBgImage(STATION_CONFIGS[station].image);
      setFade(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [station]);

  const handleStationClick = (index: number) => {
    goToStation(index);
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const playing = mode === "playing";

  return (
    <div className={styles.heroScene}>
      <div 
        className={`${styles.backgroundLayer} ${fade ? styles.fadeOut : styles.fadeIn}`}
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className={styles.gradientOverlay} />
      
      <div className={styles.header}>
        <div className={styles.logoArea}>
          <div className={styles.logoTitle}>રંગીત</div>
          <div className={styles.logoSub}>
             RANGEET · રંગમાં સન્ન
          </div>
        </div>
        
        {/* Desktop: inline nav */}
        <div className={styles.headerRight}>
          <div className={styles.stationSwitcher}>
            {STATION_CONFIGS.map((s, i) => (
              <button
                key={s.roman}
                className={`${styles.stationBtn} ${station === i ? styles.stationBtnActive : ""}`}
                onClick={() => goToStation(i)}
              >
                {s.label}
              </button>
            ))}
          </div>
          
          <button 
            className={styles.suggestBtn}
            onClick={() => {
              logCustomEvent("hero_suggest_song_click");
              document.getElementById('song-request')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            ગીત સૂચવો
          </button>
        </div>

        {/* Mobile: hamburger button */}
        <button 
          className={styles.hamburgerBtn}
          onClick={() => {
            logCustomEvent("mobile_drawer_open");
            setDrawerOpen(true);
          }}
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Drawer overlay */}
      <div 
        className={`${styles.drawerOverlay} ${drawerOpen ? styles.drawerOverlayOpen : ""}`}
        onClick={() => setDrawerOpen(false)}
      />
      
      {/* Drawer panel */}
      <div className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>મેનુ</span>
          <button 
            className={styles.drawerCloseBtn} 
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.drawerSection}>
          <span className={styles.drawerLabel}>STATIONS</span>
          <div className={styles.drawerStations}>
            {STATION_CONFIGS.map((s, i) => (
              <button
                key={s.roman}
                className={`${styles.drawerStationBtn} ${station === i ? styles.drawerStationBtnActive : ""}`}
                onClick={() => handleStationClick(i)}
              >
                <span className={styles.drawerStationName}>{s.label}</span>
                <span className={styles.drawerStationMeta}>{s.roman} · {s.freq} FM</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.drawerDivider} />

        <button
          className={styles.drawerSuggestBtn}
          onClick={() => {
            logCustomEvent("drawer_suggest_song_click");
            setDrawerOpen(false);
            setTimeout(() => {
              document.getElementById('song-request')?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          ગીત સૂચવો
        </button>
      </div>
      
      <div className={styles.centerVisualizer}>
        <h1 className={styles.hugeTagline}>રંગે રમીએ, ગીતે જીવીએ.</h1>
        {playing && (
           <div className={styles.largeEqualizer}>
             <span className={styles.barAnimLarge} style={{ animationDelay: '0.1s' }} />
             <span className={styles.barAnimLarge} style={{ animationDelay: '0.3s' }} />
             <span className={styles.barAnimLarge} style={{ animationDelay: '0.0s' }} />
             <span className={styles.barAnimLarge} style={{ animationDelay: '0.4s' }} />
             <span className={styles.barAnimLarge} style={{ animationDelay: '0.2s' }} />
           </div>
        )}
      </div>

      <div className={styles.bottomArea}>
        <div className={styles.leftContent}>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span className={styles.scrollLabel}>SCROLL</span>
        <svg className={styles.scrollArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <polyline points="19 12 12 19 5 12"/>
        </svg>
      </div>
    </div>
  );
}
