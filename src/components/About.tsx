import { useState } from "react";
import styles from "./About.module.css";

const FAQ_ITEMS = [
  {
    question: "Is Rangeet free to use?",
    answer: "Yes, Rangeet is completely free — no login, no ads, no subscription.",
  },
  {
    question: "What kind of music does Rangeet play?",
    answer: "Rangeet plays non-stop Gujarati Garba, Dayro, and Gujarati cinema songs.",
  },
  {
    question: "Where does the music come from?",
    answer:
      "Music streams through embedded YouTube players. Rangeet does not host any audio; all rights remain with the original artists, labels and composers.",
  },
  {
    question: "Do I need to create an account to listen?",
    answer: "No account or sign-up is needed. Just open the site and press play.",
  },
];

export function About() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className={styles.section} id="about">
      <div className={styles.content}>
        <div className={styles.left}>
          <span className={styles.eyebrow}>વિશે / ABOUT</span>
        </div>
        <div className={styles.right}>
          <p className={styles.headline}>
            રંગીત એ ગુજરાતી સંગીતનું એક શાંત રેડિયો છે. ગરબા, ડાયરો અને
            ગુજરાતી સિનેમાનાં ગીતો — એક પાનું ખોલો, વગાડો, અને કામ કરતા રહો.
          </p>
          {/* <p className={styles.body}>
            Rangeet is a free, non-stop Gujarati radio — garba songs for Navratri
            nights, lok dayro for gatherings, and Gujarati cinema songs from decades
            of film music. No login, no queue building, no algorithm. One page,
            three categories, and music that keeps playing while you work. Audio
            streams through YouTube's embedded player — nothing is hosted here.
          </p> */}
        </div>
      </div>

      {/* Visible FAQ — matches JSON-LD FAQPage exactly */}
      <div className={styles.faqSection}>
        <span className={styles.faqTitle}>FAQ / વારંવાર પૂછાતા પ્રશ્નો</span>
        <div className={styles.faqList}>
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`${styles.faqItem} ${openIndex === i ? styles.faqItemOpen : ""}`}
            >
              <button
                className={styles.faqQuestion}
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span>{item.question}</span>
                <span className={styles.faqIcon} aria-hidden="true">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              <div
                className={styles.faqAnswer}
                role="region"
                hidden={openIndex !== i}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
