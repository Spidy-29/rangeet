import { EventItem } from "../types";
import styles from "./EventCard.module.css";
import { track } from "@vercel/analytics";
import { logCustomEvent } from "../firebase";

type EventCardProps = {
  event: EventItem;
  variant?: "strip" | "grid";
};

export default function EventCard({ event, variant = "grid" }: EventCardProps) {
  const handleClick = () => {
    track("event_card_clicked", { eventId: event.id, title: event.title, variant });
    logCustomEvent("event_card_clicked", { eventId: event.id, title: event.title, variant });
  };

  return (
    <a
      href={event.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.eventCard} ${styles[`variant-${variant}`]}`}
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        {event.image && event.image !== "PASTE_OG_IMAGE_URL" ? (
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className={styles.placeholder} />
        )}
        {event.artistTag && <span className={styles.badge}>{event.artistTag}</span>}
      </div>
      <div className={styles.content}>
        <h3>{event.title}</h3>
        <p className={styles.meta}>{event.venue}</p>
        <p className={styles.meta}>{event.date}</p>
      </div>
    </a>
  );
}
