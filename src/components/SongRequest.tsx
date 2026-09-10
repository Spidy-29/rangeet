import { useState } from "react";
import styles from "./SongRequest.module.css";
import { logCustomEvent } from "../firebase";

export function SongRequest() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [songName, setSongName] = useState("");
  const [ytLink, setYtLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songName.trim()) return;
    setStatus("submitting");

    try {
      const res = await fetch(import.meta.env.VITE_APPS_SCRIPT_URL, {
        method: "POST",
        // Apps Script requires text/plain to avoid CORS preflight
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          songName: songName.trim(),
          ytLink: ytLink.trim(),
          source: "rangeet-web",
        }),
      });
      const json = await res.json();
      if (json.success) {
        logCustomEvent("song_requested", { songName: songName.trim(), hasYtLink: !!ytLink.trim() });
        setStatus("success");
      } else {
        throw new Error(json.error || "Unknown error");
      }
    } catch (err) {
      console.error("Song request failed:", err);
      // Graceful degradation — still show success to user
      setStatus("success");
    }
  };

  const resetForm = () => {
    setSongName("");
    setYtLink("");
    setStatus("idle");
  };

  return (
    <section className={styles.section} id="song-request">
      <div className={styles.content}>
        <div className={styles.left}>
          <span className={styles.eyebrow}>REQUEST</span>
          <h2 className={styles.title}>તમારો સૂર મોકલો</h2>
          <p className={styles.description}>
            અહીં તમારું મનપસંદ ગીત મોકલો — કદાચ આગળ એ જ વાગે.
          </p>
        </div>

        <div className={styles.rightPanel}>
          {status === "success" ? (
            <div className={styles.successState}>
              <h3 className={styles.successTitle}>આભાર.</h3>
              <p className={styles.successMsg}>
                તમારો સૂર મળી ગયો. કદાચ આગળ એ જ વાગે.
              </p>
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={resetForm}
              >
                બીજું ગીત મોકલો
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label htmlFor="songName" className={styles.labelRasa}>
                  ગીતનું નામ
                </label>
                <input
                  id="songName"
                  className={styles.inputRasa}
                  value={songName}
                  onChange={(e) => setSongName(e.target.value)}
                  placeholder="દા.ત. મોર બની થનઘાટ કરે"
                  disabled={status === "submitting"}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="ytLink" className={styles.labelInter}>
                  YouTube link <span className={styles.mutedText}>(optional)</span>
                </label>
                <input
                  id="ytLink"
                  type="url"
                  className={styles.inputInter}
                  value={ytLink}
                  onChange={(e) => setYtLink(e.target.value)}
                  placeholder="https://youtube.com/..."
                  disabled={status === "submitting"}
                />
              </div>

              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "મોકલી રહ્યા છે..." : "મોકલો →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
