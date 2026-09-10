export type Track = {
  id: string;
  title: string;
  artist: string;
  playlistId: string;
};

export type StationKey = "garba" | "dayro" | "cinema";

export const STATION_KEYS: StationKey[] = ["garba", "dayro", "cinema"];

export const FALLBACK_TRACK: Track = {
  id: "Te-1fu0UdQE",
  title: "ગરબા — Fallback",
  artist: "Various Artists",
  playlistId: "PLGrXETccRxKo",
};

export const STATIONS: Record<StationKey, Track> = {
  garba: {
    id: "Te-1fu0UdQE",
    title: "Garba Hits",
    artist: "Various Artists",
    playlistId: "PLGrXETccRxKo",
  },
  dayro: {
    id: "6C07XRxYzLU",
    title: "Dayro & Santvani",
    artist: "Various Artists",
    playlistId: "PLHiiIUNI1q84",
  },
  cinema: {
    id: "5gIpqS-Qpzw",
    title: "Gujarati Cinema Hits",
    artist: "Various Artists",
    playlistId: "PLOHJQBYmMwHo",
  },
};

export function tickerFromTrack(track: Track | null): string {
  if (!track) return "";
  return track.artist ? `${track.title} · ${track.artist}` : track.title;
}
