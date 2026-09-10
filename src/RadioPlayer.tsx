import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { FALLBACK_TRACK, fisherYatesShuffle, STATION_KEYS, STATIONS, type Track } from "./playlists";
import type { Mode } from "./types";

const YT_UNSTARTED = -1;
const YT_ENDED = 0;
const YT_PLAYING = 1;
const YT_PAUSED = 2;
const YT_BUFFERING = 3;
const SKIP_ERRORS = new Set([2, 5, 100, 101, 150]);

type RadioPlayerValue = {
  station: number;
  mode: Mode;
  currentTrack: Track | null;
  ready: boolean;
  togglePlay: () => void;
  goToStation: (index: number) => void;
  nextStation: () => void;
  prevStation: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  volume: number;
  setVolume: (vol: number) => void;
  currentTime: number;
  duration: number;
  seekTo: (seconds: number) => void;
};

const RadioPlayerContext = createContext<RadioPlayerValue | null>(null);

function loadYouTubeIframeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });
}

function stationName(index: number): string {
  return STATION_KEYS[index] ?? `station-${index}`;
}

export function RadioPlayerProvider({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const queueRef = useRef<Track[]>([]);
  const indexRef = useRef(0);
  const stationRef = useRef(0);
  const wantPlayRef = useRef(false);
  const playerReadyRef = useRef(false);
  const errorsInPassRef = useRef(0);
  const usingFallbackRef = useRef(false);
  const pendingStartRef = useRef(false);

  const [station, setStation] = useState(0);
  const [mode, setMode] = useState<Mode>("idle");
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [ready, setReady] = useState(false);
  const [volume, setVolumeState] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const apiRef = useRef({
    applyVolume: () => {},
    loadTrack: (_track: Track) => {},
    startStation: (_index: number) => {},
    skipEnded: () => {},
    skipError: (_id: string, _code: number) => {},
    mapState: (_data: number) => {},
  });

  apiRef.current.applyVolume = () => {
    const player = playerRef.current;
    if (!player || !playerReadyRef.current) return;
    player.setVolume(volume);
    player.unMute();
  };

  apiRef.current.loadTrack = (track: Track) => {
    setCurrentTrack(track);
    const player = playerRef.current;
    if (!player || !playerReadyRef.current) {
      pendingStartRef.current = true;
      return;
    }
    player.loadVideoById(track.id);
    apiRef.current.applyVolume();
  };

  apiRef.current.startStation = (index: number) => {
    const key = STATION_KEYS[index];
    usingFallbackRef.current = false;
    errorsInPassRef.current = 0;
    const source = STATIONS[key] ?? [];
    const queue = fisherYatesShuffle(source);
    queueRef.current = queue.length ? queue : [FALLBACK_TRACK];
    indexRef.current = 0;
    if (!queue.length) usingFallbackRef.current = true;
    setMode("tuning");
    apiRef.current.loadTrack(queueRef.current[0]);
  };

  apiRef.current.skipEnded = () => {
    if (usingFallbackRef.current) {
      usingFallbackRef.current = false;
      apiRef.current.startStation(stationRef.current);
      return;
    }
    const key = STATION_KEYS[stationRef.current];
    let next = indexRef.current + 1;
    if (next >= queueRef.current.length) {
      const reshuffled = fisherYatesShuffle(STATIONS[key] ?? []);
      queueRef.current = reshuffled.length ? reshuffled : [FALLBACK_TRACK];
      next = 0;
    }
    indexRef.current = next;
    apiRef.current.loadTrack(queueRef.current[next]);
  };

  apiRef.current.skipError = (id: string, code: number) => {
    console.warn(`[gaam-nu-radio] YouTube error ${code} for id=${id} station=${stationName(stationRef.current)}`);
    if (usingFallbackRef.current) {
      console.warn("[gaam-nu-radio] fallback track failed; leaving radio silent");
      wantPlayRef.current = false;
      setMode("idle");
      return;
    }
    const queue = queueRef.current;
    errorsInPassRef.current += 1;
    if (!queue.length || errorsInPassRef.current >= queue.length) {
      usingFallbackRef.current = true;
      apiRef.current.loadTrack(FALLBACK_TRACK);
      return;
    }
    let next = indexRef.current + 1;
    if (next >= queue.length) {
      const key = STATION_KEYS[stationRef.current];
      const reshuffled = fisherYatesShuffle(STATIONS[key] ?? []);
      queueRef.current = reshuffled.length ? reshuffled : [FALLBACK_TRACK];
      next = 0;
    }
    indexRef.current = next;
    apiRef.current.loadTrack(queueRef.current[next]);
  };

  apiRef.current.mapState = (data: number) => {
    if (data === YT_ENDED) {
      if (wantPlayRef.current) apiRef.current.skipEnded();
      return;
    }
    if (data === YT_BUFFERING) {
      if (wantPlayRef.current) setMode("tuning");
      apiRef.current.applyVolume();
      return;
    }
    if (data === YT_PLAYING) {
      errorsInPassRef.current = 0;
      setMode("playing");
      apiRef.current.applyVolume();
      return;
    }
    if (data === YT_PAUSED || data === YT_UNSTARTED) {
      if (!wantPlayRef.current) setMode("idle");
    }
  };

  useEffect(() => {
    let cancelled = false;
    let player: YT.Player | null = null;

    loadYouTubeIframeAPI().then(() => {
      if (cancelled || !hostRef.current || !window.YT?.Player) return;
      hostRef.current.replaceChildren();
      const mount = document.createElement("div");
      hostRef.current.appendChild(mount);
      player = new window.YT.Player(mount, {
        width: 320,
        height: 180,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          fs: 0,
          iv_load_policy: 3,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            playerReadyRef.current = true;
            playerRef.current = event.target;
            event.target.setVolume(volume);
            setReady(true);
            if (pendingStartRef.current && wantPlayRef.current) {
              pendingStartRef.current = false;
              apiRef.current.startStation(stationRef.current);
            }
          },
          onStateChange: (event) => apiRef.current.mapState(event.data),
          onError: (event) => {
            if (!SKIP_ERRORS.has(event.data)) return;
            const track = usingFallbackRef.current ? FALLBACK_TRACK : queueRef.current[indexRef.current];
            apiRef.current.skipError(track?.id ?? "unknown", event.data);
          },
        },
      });
      playerRef.current = player;
    });

    return () => {
      cancelled = true;
      playerReadyRef.current = false;
      try {
        player?.destroy();
      } catch {
        /* player may already be gone on HMR */
      }
      playerRef.current = null;
    };
  }, []);

  const togglePlay = () => {
    if (wantPlayRef.current && (mode === "playing" || mode === "tuning")) {
      wantPlayRef.current = false;
      pendingStartRef.current = false;
      playerRef.current?.pauseVideo();
      setMode("idle");
      return;
    }
    wantPlayRef.current = true;
    if (mode === "idle" && currentTrack && playerReadyRef.current && queueRef.current.length) {
      setMode("tuning");
      playerRef.current?.playVideo();
      apiRef.current.applyVolume();
      return;
    }
    apiRef.current.startStation(stationRef.current);
  };

  const goToStation = (index: number) => {
    if (index === stationRef.current) {
      if (wantPlayRef.current) return;
      return;
    }
    stationRef.current = index;
    setStation(index);
    if (!wantPlayRef.current) {
      queueRef.current = [];
      indexRef.current = 0;
      setCurrentTrack(null);
      return;
    }
    try {
      playerRef.current?.stopVideo();
    } catch {
      /* ignore */
    }
    apiRef.current.startStation(index);
  };

  const nextStation = () => goToStation((stationRef.current + 1) % STATION_KEYS.length);
  const prevStation = () => goToStation((stationRef.current - 1 + STATION_KEYS.length) % STATION_KEYS.length);

  const nextTrack = () => {
    if (!wantPlayRef.current) wantPlayRef.current = true;
    apiRef.current.skipEnded();
  };

  const prevTrack = () => {
    if (usingFallbackRef.current) return;
    if (!wantPlayRef.current) wantPlayRef.current = true;
    let next = indexRef.current - 1;
    if (next < 0) {
      next = Math.max(0, queueRef.current.length - 1);
    }
    indexRef.current = next;
    apiRef.current.loadTrack(queueRef.current[next]);
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (playerRef.current && playerReadyRef.current) {
      playerRef.current.setVolume(vol);
    }
  };

  const seekTo = (seconds: number) => {
    if (playerRef.current && playerReadyRef.current) {
      playerRef.current.seekTo(seconds, true);
      setCurrentTime(seconds);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (mode === "playing") {
      interval = setInterval(() => {
        if (playerRef.current && playerReadyRef.current) {
          try {
            setCurrentTime(playerRef.current.getCurrentTime() || 0);
            setDuration(playerRef.current.getDuration() || 0);
          } catch (e) {
            // Ignore if player is not fully initialized
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode]);

  const value: RadioPlayerValue = {
    station,
    mode,
    currentTrack,
    ready,
    togglePlay,
    goToStation,
    nextStation,
    prevStation,
    nextTrack,
    prevTrack,
    volume,
    setVolume,
    currentTime,
    duration,
    seekTo,
  };

  return (
    <RadioPlayerContext.Provider value={value}>
      <div
        id="yt-radio-player"
        aria-hidden
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          opacity: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div ref={hostRef} />
      </div>
      {children}
    </RadioPlayerContext.Provider>
  );
}

export function useRadioPlayer(): RadioPlayerValue {
  const ctx = useContext(RadioPlayerContext);
  if (!ctx) throw new Error("useRadioPlayer must be used within RadioPlayerProvider");
  return ctx;
}
