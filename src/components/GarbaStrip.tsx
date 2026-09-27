import { useRef } from "react";
import EventCard from "./EventCard";
import eventsData from "../data/events.json";
import { EventItem } from "../types";
import styles from "./GarbaStrip.module.css";

import { useRadioPlayer } from "../RadioPlayer";
import { track } from "@vercel/analytics";
import { logCustomEvent } from "../firebase";

const featuredIds = [
  "falguni-pathak-2026",
  "parampara-kirtidan-2026",
  "kinjal-dave-2026",
  "genzatri-2026",
  "raang-taali-2026",
  "aadhyashakti-garba-2026",
  "dandiya-dhamal-2026",
  "sachi-navratri-2026"
];

const stripEvents = eventsData.filter((e) => featuredIds.includes(e.id)) as EventItem[];

export function GarbaStrip() {
  const { station } = useRadioPlayer();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (station !== 0) return null;

  const scrollBy = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section id="garba-events" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>આ નવરાત્રીના ગરબા <span className={styles.subtitle}>/ Navratri Garba Events</span></h2>
        <div className={styles.controls}>
          <button onClick={() => scrollBy(-300)} className={styles.arrowBtn} aria-label="Scroll left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button onClick={() => scrollBy(300)} className={styles.arrowBtn} aria-label="Scroll right">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
      
      <div className={styles.scrollWrapper}>
        <div className={styles.scrollContainer} ref={scrollRef}>
          {stripEvents.map((event) => (
            <EventCard key={event.id} event={event} variant="strip" />
          ))}
          <a
            href="/garba"
            className={`${styles.viewMoreCard} pressable`}
            onClick={() => {
              track("view_more_garba_clicked");
              logCustomEvent("view_more_garba_clicked");
            }}
          >
            <span>બધા ગરબા જુઓ</span>
            <span className={styles.viewMoreSub}>View More &rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
