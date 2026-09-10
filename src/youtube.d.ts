export {};

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLElement | string, options: YT.PlayerOptions) => YT.Player;
    };
    onYouTubeIframeAPIReady?: () => void;
  }

  namespace YT {
    class Player {
      constructor(element: HTMLElement | string, options: PlayerOptions);
      loadVideoById(videoId: string): void;
      playVideo(): void;
      pauseVideo(): void;
      stopVideo(): void;
      setVolume(volume: number): void;
      mute(): void;
      unMute(): void;
      destroy(): void;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      getCurrentTime(): number;
      getDuration(): number;
    }

    interface PlayerOptions {
      width?: number | string;
      height?: number | string;
      videoId?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: { target: Player }) => void;
        onStateChange?: (event: { data: number; target: Player }) => void;
        onError?: (event: { data: number; target: Player }) => void;
      };
    }
  }
}
