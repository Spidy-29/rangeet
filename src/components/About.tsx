import styles from "./About.module.css";

export function About() {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <div className={styles.left}>
          <span className={styles.eyebrow}>વિશે / ABOUT</span>
        </div>
        <div className={styles.right}>
          <p className={styles.headline}>
            રંગીત એ ગુજરાતી સંગીતનું એક શાંત રેડિયો છે. ગરબા, ડાયરો અને
            ગુજરાતી સિનેમાનાં ગીતો — એક પાનું ખોલો, વગાડો, અને કામ કરતા રહો.
          </p>
          <p className={styles.body}>
            No login, no queue building, no algorithm. One page, three categories, and
            music that keeps playing while you work. Audio streams through YouTube's
            embedded player — nothing is hosted here.
          </p>
        </div>
      </div>
    </section>
  );
}
