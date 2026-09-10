export type Track = {
  id: string;
  title: string;
  artist: string;
};

export type StationKey = "garba" | "dayro" | "folk" | "cinema";

export const STATION_KEYS: StationKey[] = ["garba", "dayro", "folk", "cinema"];

export const FALLBACK_TRACK: Track = {
  id: "jNQXAC9IVRw",
  title: "Signal Lost — Retuning…",
  artist: "",
};

export const STATIONS: Record<StationKey, Track[]> = {
  garba: [
    { id: "Te-1fu0UdQE", title: "Galgoto Me Zukine Lidho", artist: "Geeta Rabari" },
    { id: "-6oAZwTGD2c", title: "Ranchhod Rangila", artist: "Sabhiben Ahir" },
    { id: "zYCiZidm_jY", title: "Garbe Haal", artist: "Geeta Rabari" },
    { id: "EG4gFxczkH8", title: "Chaniyacholi", artist: "Jigardan Gadhavi" },
    { id: "pGG_Zosn-qo", title: "Gori Tame Manda Lidha Mohi Raj", artist: "Umesh Barot" },
    { id: "DYeKTko5yD8", title: "Zulan Morli Vaagi Re", artist: "Malhar" },
    { id: "Eo7ivYo8sp4", title: "Ghor Andhari Re Rataldi Maa", artist: "Jahnvi & Gaurav" },
    { id: "Jv8KRwF1zQs", title: "Moti Veraana", artist: "Osman Mir" },
    { id: "9n7tWwa77mY", title: "RAMO RE", artist: "Jigardan Gadhavi" },
    { id: "rLsJlT-kV-I", title: "Kesariyo Rang", artist: "Asees K" },
    { id: "CBb0XBH_fT0", title: "Radha Ne Kaan Kare Vaat", artist: "Aditya Gadhvi" },
    { id: "4CMFhc8N6gk", title: "Dwarika No Naath", artist: "Laalo" },
    { id: "B4qSyd48zTs", title: "Mathura Ma Vagi Morli", artist: "Herry Nakum" },
    { id: "iraezTzB938", title: "Naagar Nandji Na Laal", artist: "Aditya Gadhvi" },
    { id: "xJsvTCMg0qA", title: "Mor Bani Thanghat Kare", artist: "Osman Mir" },
    { id: "JYLEyMvj6sE", title: "Rang Bhini Radha", artist: "Aditya Gadhavi" },
    { id: "beBmY38f_M0", title: "Latke Halo", artist: "Aditya Gadhvi" },
    { id: "6c3mAtStIxo", title: "Khalasi", artist: "Coke Studio" },
    { id: "46f6aPSXN7Y", title: "Halaji Tara Hath Vakhanu", artist: "Aditya Gadhvi" },
    { id: "rz1hAo3Hiy4", title: "Dholida", artist: "Neha Kakkar" },
    { id: "5MMqwxJ3VBY", title: "Tetudo 2", artist: "Geeta Rabari" },
    { id: "p6_PJm9A4U4", title: "Ghaghro", artist: "Rutvi Pandya" },
    { id: "Lj_2wb9akZM", title: "Hu Gokul no govadiyo", artist: "Atul Purohit" },
    { id: "CxGJEY-5tnU", title: "Kirtidan Gadhvi All Time Hits", artist: "Kirtidan Gadhvi" },
    { id: "zPUxv7b5uTQ", title: "Bol Mari Ambe", artist: "Yash Soni" },
    { id: "2UM6ksbxTvs", title: "Khamkaro", artist: "Jigardan Gadhavi" },
    { id: "Qrjr9O3oEXE", title: "Jhanjariyu", artist: "Umesh Barot" },
    { id: "sDZA54sTqwQ", title: "Vaagyo Re Dhol", artist: "Bhoomi Trivedi" },
    { id: "aH5wb-weILU", title: "Radha Gori Re", artist: "Atul Purohit" },
    { id: "O11shxGqC78", title: "Ultimate Nonstop Garba", artist: "Aishwarya Majmudar" },
    { id: "TujqDgUDnOM", title: "Vithal Vithal Vithala", artist: "Geeta Rabari" },
    { id: "gTastlkWMFs", title: "Dwarikadhish Ne Khamma", artist: "Sabhiben Ahir" },
    { id: "XN5MYcku-wQ", title: "Killol - Nonstop Trantali", artist: "Kinjal Dave" },
    { id: "4leubUacBAg", title: "Ramva Aave Madi Ramva Aave", artist: "Geeta Rabari" },
    { id: "6x7OAy_N5XA", title: "Non Stop Garba by Falguni Pathak", artist: "Falguni Pathak" },
    { id: "NZPqTZSUNn4", title: "Ha Sarkari", artist: "Jeel Entertainment" }
  ],
  dayro: [
    { id: "6C07XRxYzLU", title: "Dayro Hits", artist: "Various Artists" },
    { id: "HiNHJo7dQic", title: "Dayro & Santvani Live", artist: "Kirtidan Gadhvi, Osman Mir" },
    { id: "O2RzMCUkNEc", title: "Live Dayro 2026", artist: "Kirtidan Gadhvi" },
    { id: "pyQk_QiztGY", title: "Bhavya Lok Dayro - Anjar Live", artist: "Kirtidan Gadhvi" },
  ],
  folk: [
    // TODO: no verified lokgeet IDs sourced yet — placeholder, replace before launch
    { id: "REPLACE_11CHAR", title: "…", artist: "…" },
  ],
  cinema: [
    { id: "5gIpqS-Qpzw", title: "Gujarati Cinema Hits", artist: "Various Artists" },
    { id: "_NjigYHnxuk", title: "Kehvu Ghanu Ghanu Che (4K)", artist: "Chhello Divas" },
    { id: "all3tYT2FJs", title: "Kehvu Ghanu Ghanu Che", artist: "Chhello Divas" },
  ],
};

export function tickerFromTrack(track: Track | null): string {
  if (!track) return "";
  return track.artist ? `${track.title} · ${track.artist}` : track.title;
}

export function fisherYatesShuffle<T>(items: T[]): T[] {
  const next = items.slice();
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}
