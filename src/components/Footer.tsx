import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Hero Quote Block */}
      <div className={styles.quoteBlock}>
        <blockquote className={styles.quote}>
           જ્યાં ગીત છે,<br />
          ત્યાં ગુજરાત છે.
        </blockquote>
        <cite className={styles.cite}>— કહેવત</cite>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Bottom Grid */}
      <div className={styles.grid}>
        <div className={styles.gridCol}>
          <div className={styles.brandName}>રંગીત</div>
          <div className={styles.brandSub}>RANGEET · ૨૦૨૬</div>
        </div>

        <div className={styles.gridCol}>
          <p className={styles.gridDesc}>
            ગુજરાતી સંગીતનું શાંત રેડિયો. ગરબા, ડાયરો, સિનેમા —
            <br />
            એક જ પાનું.
          </p>
        </div>

        <div className={styles.gridCol}>
          <div className={styles.ctaLabel}>કોઈ ગીત ખૂટે છે?</div>
          <button
            className={styles.ctaBtn}
            onClick={() =>
              document.getElementById("song-request")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            ગીત સૂચવો →
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Legal */}
      <p className={styles.legal}>
        Audio plays through YouTube's embedded player. Nothing is hosted on this site; all rights
        remain with the labels, composers and performers.
      </p>
    </footer>
  );
}
