import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { FALLBACK_TRACK, STATION_KEYS, STATIONS, type Track } from "./playlists";
import type { Mode } from "./types";
import { logCustomEvent } from "./firebase";

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
  const stationRef = useRef(0);
  const wantPlayRef = useRef(false);
  const playerReadyRef = useRef(false);
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
    loadPlaylist: (_track: Track) => {},
    startStation: (_index: number) => {},
    skipError: (_id: string, _code: number) => {},
    mapState: (_data: number) => {},
  });

  apiRef.current.applyVolume = () => {
    const player = playerRef.current;
    if (!player || !playerReadyRef.current) return;
    player.setVolume(volume);
    player.unMute();
  };

  apiRef.current.loadPlaylist = (track: Track) => {
    setCurrentTrack(track);
    const player = playerRef.current;
    if (!player || !playerReadyRef.current) {
      pendingStartRef.current = true;
      return;
    }
    player.loadPlaylist({
      listType: "playlist",
      list: track.playlistId,
      index: 0,
      startSeconds: 0,
    });
    player.setShuffle(true);
    apiRef.current.applyVolume();
  };

  apiRef.current.startStation = (index: number) => {
    const key = STATION_KEYS[index];
    usingFallbackRef.current = false;
    const track = STATIONS[key] ?? FALLBACK_TRACK;
    if (!track) {
      usingFallbackRef.current = true;
      setMode("tuning");
      apiRef.current.loadPlaylist(FALLBACK_TRACK);
      return;
    }
    setMode("tuning");
    apiRef.current.loadPlaylist(track);
  };

  apiRef.current.skipError = (id: string, code: number) => {
    console.warn(`[rangeet] YouTube error ${code} for id=${id} station=${stationName(stationRef.current)}`);
    if (usingFallbackRef.current) {
      console.warn("[rangeet] fallback playlist failed; leaving radio silent");
      wantPlayRef.current = false;
      setMode("idle");
      return;
    }
    // On error, try fallback (garba playlist)
    usingFallbackRef.current = true;
    apiRef.current.loadPlaylist(FALLBACK_TRACK);
  };

  apiRef.current.mapState = (data: number) => {
    if (data === YT_ENDED) {
      // YouTube playlists auto-advance; this fires only if the entire playlist ends
      if (wantPlayRef.current) {
        // Restart the current station playlist
        apiRef.current.startStation(stationRef.current);
      }
      return;
    }
    if (data === YT_BUFFERING) {
      if (wantPlayRef.current) setMode("tuning");
      apiRef.current.applyVolume();
      return;
    }
    if (data === YT_PLAYING) {
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
            const track = currentTrack ?? FALLBACK_TRACK;
            apiRef.current.skipError(track.id, event.data);
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
      logCustomEvent("radio_pause", { station: stationName(stationRef.current) });
      return;
    }
    wantPlayRef.current = true;
    logCustomEvent("radio_play", { station: stationName(stationRef.current) });
    if (mode === "idle" && currentTrack && playerReadyRef.current) {
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
    logCustomEvent("radio_change_station", {
      from_station: stationName(stationRef.current),
      to_station: stationName(index),
    });
    stationRef.current = index;
    setStation(index);
    if (!wantPlayRef.current) {
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

  // YouTube handles next/prev within the playlist natively
  const nextTrack = () => {
    logCustomEvent("radio_next_track", { station: stationName(stationRef.current) });
    if (!wantPlayRef.current) wantPlayRef.current = true;
    playerRef.current?.nextVideo();
  };

  const prevTrack = () => {
    logCustomEvent("radio_prev_track", { station: stationName(stationRef.current) });
    if (!wantPlayRef.current) wantPlayRef.current = true;
    playerRef.current?.previousVideo();
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (playerRef.current && playerReadyRef.current) {
      playerRef.current.setVolume(vol);
    }
  };

  const seekTo = (seconds: number) => {
    logCustomEvent("radio_seek", { station: stationName(stationRef.current), seconds });
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
