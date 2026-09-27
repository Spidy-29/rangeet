export type Mode = "idle" | "tuning" | "playing";
export type View = "station" | "radio";

export type EventItem = {
  id: string;
  title: string;
  artistTag: string | null;
  venue: string;
  city: "Ahmedabad" | "Gandhinagar" | "Vadodara";
  date: string;
  image: string;
  link: string;
};
