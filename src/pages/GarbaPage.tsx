import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import eventsData from "../data/events.json";
import { EventItem } from "../types";
import styles from "./GarbaPage.module.css";
import { Footer } from "../components/Footer";
import { track } from "@vercel/analytics";
import { logCustomEvent } from "../firebase";

type CityFilter = "All" | "Ahmedabad" | "Gandhinagar" | "Vadodara";
const cities: CityFilter[] = ["All", "Ahmedabad", "Gandhinagar", "Vadodara"];

export function GarbaPage() {
  const [filter, setFilter] = useState<CityFilter>("All");

  useEffect(() => {
    document.title = "Navratri Garba Events — Rangeet";
    window.scrollTo(0, 0);
    track("page_view", { page: "garba" });
    logCustomEvent("page_view", { page: "garba" });
  }, []);

  const handleFilterChange = (city: CityFilter) => {
    setFilter(city);
    track("garba_filter_changed", { city });
    logCustomEvent("garba_filter_changed", { city });
  };

  const filteredEvents = (eventsData as EventItem[]).filter(
    (e) => filter === "All" || e.city === filter
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="/" className={styles.backLink}>
          &larr; Back to Rangeet
        </a>
        <div className={styles.logoArea}>
          <img src="/rangeet-logo.png" alt="Rangeet" className={styles.logoImage} />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>નવરાત્રીના ગરબા</h1>
          <p className={styles.subtitle}>
            Navratri Garba Events across Gujarat.
          </p>
          <p className={styles.disclosure}>
            Ticket links go to the official event platform — Rangeet doesn't sell or handle tickets.
          </p>
        </div>

        <div className={styles.filterTabs}>
          {cities.map((city) => (
            <button
              key={city}
              className={`${styles.tabBtn} ${filter === city ? styles.activeTab : ""}`}
              onClick={() => handleFilterChange(city)}
            >
              {city}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} variant="grid" />
          ))}
        </div>
        
        {filteredEvents.length === 0 && (
          <div className={styles.emptyState}>
            No events found for {filter}.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
