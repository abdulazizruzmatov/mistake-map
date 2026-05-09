import { useState, useEffect } from "react";

const FORMSPREE_ID = "xvzvqbae";

export default function UsefulWidget() {
  const [count, setCount] = useState(500);
  const [voted, setVoted] = useState(false);
  const [showNoForm, setShowNoForm] = useState(false);
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("mm_useful_voted")) setVoted(true);
  }, []);

  function handleYes() {
    if (voted) return;
    localStorage.setItem("mm_useful_voted", "yes");
    setCount(c => c + 1);
    setVoted(true);
  }

  async function handleNoSubmit() {
    if (!reason.trim()) return;
    try {
      await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "Not Useful Feedback", reason }),
      });
    } catch {}
    localStorage.setItem("mm_useful_voted", "no");
    setVoted(true);
    setShowNoForm(false);
    setSubmitted(true);
  }

  return (
    <div style={{ textAlign:"center", padding:"32px 24px", background:"#0f0f0f", borderTop:"1px solid #222", marginTop:"48px" }}>
      <p style={{ color:"#fff", fontSize:"18px", fontWeight:"600", marginBottom:"16px" }}>Was this website useful?</p>
      {!voted && !showNoForm && (
        <div style={{ display:"flex", gap:"12px", justifyContent:"center", marginBottom:"16px" }}>
          <button onClick={handleYes} style={{ background:"#22c55e", color:"#fff", border:"none", borderRadius:"8px", padding:"10px 28px", fontSize:"15px", fontWeight:"600", cursor:"pointer" }}>👍 Yes</button>
          <button onClick={() => setShowNoForm(true)} style={{ background:"#ef4444", color:"#fff", border:"none", borderRadius:"8px", padding:"10px 28px", fontSize:"15px", fontWeight:"600", cursor:"pointer" }}>👎 No</button>
        </div>
      )}
      {showNoForm && !submitted && (
        <div style={{ maxWidth:"360px", margin:"0 auto 16px", textAlign:"left" }}>
          <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Tell us what didn't work..." rows={3} style={{ width:"100%", background:"#1a1a1a", border:"1px solid #333", borderRadius:"8px", color:"#fff", padding:"10px", fontSize:"14px", marginBottom:"10px", boxSizing:"border-box" }} />
          <div style={{ display:"flex", gap:"10px" }}>
            <button onClick={handleNoSubmit} style={{ background:"#22c55e", color:"#fff", border:"none", borderRadius:"8px", padding:"10px 20px", cursor:"pointer" }}>Send</button>
            <button onClick={() => setShowNoForm(false)} style={{ background:"#333", color:"#aaa", border:"none", borderRadius:"8px", padding:"10px 20px", cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}
      {(voted || submitted) && <p style={{ color:"#22c55e", fontSize:"15px", marginBottom:"12px" }}>{submitted ? "Thanks for the feedback! 🙏" : "Thanks for your vote! 🙌"}</p>}
      <p style={{ color:"#666", fontSize:"14px", marginTop:"8px" }}><span style={{ color:"#fff", fontWeight:"700", fontSize:"18px" }}>{count.toLocaleString()}</span> people found this useful</p>
    </div>
  );
}
