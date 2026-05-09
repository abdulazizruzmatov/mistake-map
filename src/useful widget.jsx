import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const FORMSPREE_ID = "xvzvqbae";

export default function UsefulWidget() {
  const [count, setCount] = useState(null);
  const [voted, setVoted] = useState(false);
  const [showNoForm, setShowNoForm] = useState(false);
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("mm_useful_voted")) setVoted(true);
    fetchCount();
  }, []);

  async function fetchCount() {
    const { data } = await supabase
      .from("site_stats")
      .select("value")
      .eq("key", "useful_count")
      .single();
    if (data) setCount(data.value);
  }

  async function handleYes() {
    if (voted) return;
    const { data } = await supabase.rpc("increment_useful_count");
    if (data !== null) setCount(data);
    else setCount((c) => (c || 0) + 1);
    localStorage.setItem("mm_useful_voted", "yes");
    setVoted(true);
  }

  function handleNo() {
    setShowNoForm(true);
  }

  async function handleNoSubmit() {
    if (!reason.trim()) return;
    await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "Not Useful Feedback", reason }),
    });
    localStorage.setItem("mm_useful_voted", "no");
    setVoted(true);
    setShowNoForm(false);
    setSubmitted(true);
  }

  return (
    <div style={styles.wrapper}>
      <p style={styles.question}>Was this website useful?</p>

      {!voted && !showNoForm && (
        <div style={styles.buttons}>
          <button onClick={handleYes} style={styles.yes}>👍 Yes</button>
          <button onClick={handleNo} style={styles.no}>👎 No</button>
        </div>
      )}

      {showNoForm && !submitted && (
        <div style={styles.form}>
          <p style={styles.formLabel}>What was the problem?</p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Tell us what didn't work for you..."
            style={styles.textarea}
            rows={3}
          />
          <div style={styles.formButtons}>
            <button onClick={handleNoSubmit} style={styles.yes}>Send</button>
            <button onClick={() => setShowNoForm(false)} style={styles.cancel}>Cancel</button>
          </div>
        </div>
      )}

      {(voted && !showNoForm) || submitted ? (
        <p style={styles.thanks}>
          {submitted ? "Thanks for the feedback! 🙏" : "Thanks for your vote! 🙌"}
        </p>
      ) : null}

      {count !== null && (
        <p style={styles.counter}>
          <span style={styles.countNum}>{count.toLocaleString()}</span> people found this useful
        </p>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    textAlign: "center",
    padding: "32px 24px",
    background: "#0f0f0f",
    borderTop: "1px solid #222",
    marginTop: "48px",
  },
  question: { color: "#fff", fontSize: "18px", fontWeight: "600", marginBottom: "16px" },
  buttons: { display: "flex", gap: "12px", justifyContent: "center", marginBottom: "16px" },
  yes: { background: "#22c55e", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 28px", fontSize: "15px", fontWeight: "600", cursor: "pointer" },
  no: { background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 28px", fontSize: "15px", fontWeight: "600", cursor: "pointer" },
  cancel: { background: "#333", color: "#aaa", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", cursor: "pointer" },
  form: { maxWidth: "360px", margin: "0 auto 16px", textAlign: "left" },
  formLabel: { color: "#ccc", fontSize: "14px", marginBottom: "8px" },
  textarea: { width: "100%", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#fff", padding: "10px", fontSize: "14px", resize: "vertical", marginBottom: "10px", boxSizing: "border-box" },
  formButtons: { display: "flex", gap: "10px" },
  thanks: { color: "#22c55e", fontSize: "15px", marginBottom: "12px" },
  counter: { color: "#666", fontSize: "14px", marginTop: "8px" },
  countNum: { color: "#fff", fontWeight: "700", fontSize: "18px" },
};
