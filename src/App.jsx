import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ofilqtstiztflvarmkxa.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_6_OJbucbFlW0tXqzj11Ttw_XI02F9uq";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SESSION_ID = (() => {
  let id = sessionStorage.getItem("mm_session");
  if (!id) { id = Math.random().toString(36).slice(2); sessionStorage.setItem("mm_session", id); }
  return id;
})();

const GREEN = "#1a5c30";
const COLORS = ["#1a5c30", "#22743c", "#012169", "#e67e22", "#9b59b6"];

const T = {
  en: {
    nav: { browse: "Browse", blog: "Blog", contact: "Contact", share: "+ Share a Mistake" },
    hero: { tag: "🇬🇧 UK & 🇺🇿 Uzbekistan", h1a: "Stop Making", h1b: "Mistakes", h1c: "Others Already Made", sub: "A community where business owners share real failures — so you can learn before it costs you.", cta: "Share Your Story →", browse: "Browse Problems" },
    stats: { problems: "Stories shared", upvotes: "Total upvotes", countries: "Countries", live: "● Live" },
    sidebar: { country: "Country", both: "🌍 Both Countries", uk: "🇬🇧 United Kingdom", uz: "🇺🇿 Uzbekistan", industry: "Industry", all: "All Industries", chart: "By Industry" },
    filters: { search: "Search stories...", newest: "Newest", upvoted: "Most upvoted", discussed: "Most discussed", allImp: "All impact", high: "🔴 High", medium: "🟡 Medium", low: "🟢 Low" },
    card: { comments: "comments" },
    empty: { title: "No stories found", sub: "Try a different filter or be the first to share here." },
    form: { title: "Share a Business Mistake", sub: "Your story could save someone else's business.", industry: "Industry *", country: "Country *", ptitle: "What went wrong? (title) *", problem: "What happened? *", lesson: "Lesson learned *", impact: "Impact", name: "Your name", namePh: "Anonymous", cancel: "Cancel", publish: "Publish →", industries: ["Fashion & Retail","Technology & SaaS","Food & Restaurant","Marketing & Agency","Finance & Banking","E-commerce","Manufacturing","Education","Healthcare","Travel & Tourism","Real Estate","Other"], high: "🔴 High — nearly fatal", medium: "🟡 Medium — major setback", low: "🟢 Low — minor but useful", selectInd: "Select industry", selectCou: "Select country" },
    detail: { lesson: "✅ Lesson Learned", comments: "Comments", noComments: "No comments yet.", commentPh: "Add a comment...", post: "Post" },
    blog: { title: "Blog & Stories", sub: "Insights, lessons, and stories from the UK and Uzbekistan business community.", write: "Write a Post", readMore: "Read more →", noPost: "No blog posts yet.", noPostSub: "Be the first to share a story.", postTitle: "Post Title *", postBody: "Write your story *", postTag: "Tag", publish: "Publish Post" },
    contact: { title: "Contact Us", sub: "Questions or partnership ideas? We are based between the UK and Uzbekistan.", email: "Email", emailV: "hello@mistakemap.co.uk", resp: "Response time", respV: "Within 24 hours", serving: "Serving", servingV: "UK & Uzbekistan only", formTitle: "Send a message", formSub: "We read every message and reply personally.", nameL: "Name *", emailL: "Email *", countryL: "Country", msgL: "Message *", send: "Send Message →" },
    toast: { published: "✓ Published! Your mistake could save someone's business.", comment: "Comment posted!", contact: "✓ Message sent! We'll reply within 24 hours.", blogPublished: "✓ Blog post published!", fill: "Please fill in all required fields." },
    impact: { high: "High", medium: "Medium", low: "Low" },
  },
  uz: {
    nav: { browse: "Ko'rish", blog: "Blog", contact: "Aloqa", share: "+ Xatoni ulashing" },
    hero: { tag: "🇬🇧 UK va 🇺🇿 O'zbekiston", h1a: "Boshqalar qilgan", h1b: "Xatolarni", h1c: "Takrorlamang", sub: "Biznes egalari haqiqiy muvaffaqiyatsizliklarini baham ko'radigan jamiyat — o'rganib, yo'l qo'ymang.", cta: "Hikoyangizni ulashing →", browse: "Muammolarni ko'rish" },
    stats: { problems: "Ulashilgan hikoyalar", upvotes: "Jami ovozlar", countries: "Mamlakatlar", live: "● Jonli" },
    sidebar: { country: "Mamlakat", both: "🌍 Ikkala mamlakat", uk: "🇬🇧 Birlashgan Qirollik", uz: "🇺🇿 O'zbekiston", industry: "Soha", all: "Barcha sohalar", chart: "Soha bo'yicha" },
    filters: { search: "Hikoyalarni qidirish...", newest: "Eng yangi", upvoted: "Ko'p ovoz olgan", discussed: "Ko'p muhokama", allImp: "Barcha ta'sir", high: "🔴 Yuqori", medium: "🟡 O'rtacha", low: "🟢 Past" },
    card: { comments: "izoh" },
    empty: { title: "Hikoyalar topilmadi", sub: "Boshqa filtrni sinab ko'ring yoki birinchi bo'lib ulashing." },
    form: { title: "Biznes xatosini ulashing", sub: "Hikoyangiz boshqa birovning biznesini saqlab qolishi mumkin.", industry: "Soha *", country: "Mamlakat *", ptitle: "Nima noto'g'ri ketdi? *", problem: "Nima bo'ldi? *", lesson: "O'rganilgan dars *", impact: "Ta'sir", name: "Ismingiz", namePh: "Anonim", cancel: "Bekor qilish", publish: "Nashr etish →", industries: ["Moda va chakana savdo","Texnologiya va SaaS","Oziq-ovqat va restoran","Marketing va agentlik","Moliya va bank","Elektron tijorat","Ishlab chiqarish","Ta'lim","Sog'liqni saqlash","Sayohat va turizm","Ko'chmas mulk","Boshqa"], high: "🔴 Yuqori — deyarli halokatli", medium: "🟡 O'rtacha — katta to'siq", low: "🟢 Past — kichik lekin foydali", selectInd: "Sohani tanlang", selectCou: "Mamlakatni tanlang" },
    detail: { lesson: "✅ O'rganilgan dars", comments: "Izohlar", noComments: "Hali izoh yo'q.", commentPh: "Izoh qo'shing...", post: "Yuborish" },
    blog: { title: "Blog va Hikoyalar", sub: "UK va O'zbekiston biznes hamjamiyatidan tushunchalar va hikoyalar.", write: "Post yozing", readMore: "Ko'proq o'qish →", noPost: "Hali blog postlari yo'q.", noPostSub: "Birinchi bo'lib hikoya ulashing.", postTitle: "Post sarlavhasi *", postBody: "Hikoyangizni yozing *", postTag: "Teg", publish: "Postni nashr etish" },
    contact: { title: "Biz bilan bog'laning", sub: "Savollar yoki hamkorlik g'oyalari? Biz UK va O'zbekiston o'rtasida joylashganmiz.", email: "Elektron pochta", emailV: "hello@mistakemap.co.uk", resp: "Javob vaqti", respV: "24 soat ichida", serving: "Xizmat ko'rsatish", servingV: "Faqat UK va O'zbekiston", formTitle: "Xabar yuboring", formSub: "Har bir xabarni o'qiymiz va shaxsan javob beramiz.", nameL: "Ism *", emailL: "Elektron pochta *", countryL: "Mamlakat", msgL: "Xabar *", send: "Xabar yuborish →" },
    toast: { published: "✓ Nashr etildi! Xatoyingiz kimnidir biznesini saqlab qolishi mumkin.", comment: "Izoh qo'shildi!", contact: "✓ Xabar yuborildi!", blogPublished: "✓ Blog posti nashr etildi!", fill: "Iltimos, barcha maydonlarni to'ldiring." },
    impact: { high: "Yuqori", medium: "O'rtacha", low: "Past" },
  }
};

export default function App() {
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("home");
  const [problems, setProblems] = useState([]);
  const [comments, setComments] = useState({});
  const [votedIds, setVotedIds] = useState(new Set());
  const [blogs, setBlogs] = useState([]);
  const [curCountry, setCurCountry] = useState("");
  const [curIndustry, setCurIndustry] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new");
  const [sev, setSev] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [detId, setDetId] = useState(null);
  const [detBlogId, setDetBlogId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const toastTimer = useRef(null);
  const t = T[lang];

  useEffect(() => { loadAll(); subscribeRealtime(); }, []);

  async function loadAll() {
    setLoading(true);
    const [{ data: probs }, { data: blgs }, { data: ups }] = await Promise.all([
      supabase.from("problems").select("*").order("created_at", { ascending: false }),
      supabase.from("blogs").select("*").order("created_at", { ascending: false }),
      supabase.from("upvotes").select("problem_id").eq("session_id", SESSION_ID),
    ]);
    if (probs) setProblems(probs);
    if (blgs) setBlogs(blgs);
    if (ups) setVotedIds(new Set(ups.map(u => u.problem_id)));
    setLoading(false);
  }

  async function loadComments(problemId) {
    const { data } = await supabase.from("comments").select("*").eq("problem_id", problemId).order("created_at", { ascending: true });
    if (data) setComments(prev => ({ ...prev, [problemId]: data }));
  }

  useEffect(() => { if (detId) loadComments(detId); }, [detId]);

  function subscribeRealtime() {
    supabase.channel("realtime-problems")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "problems" }, payload => { setProblems(prev => [payload.new, ...prev]); })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "problems" }, payload => { setProblems(prev => prev.map(p => p.id === payload.new.id ? payload.new : p)); })
      .subscribe();
    supabase.channel("realtime-blogs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "blogs" }, payload => { setBlogs(prev => [payload.new, ...prev]); })
      .subscribe();
    supabase.channel("realtime-comments")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "comments" }, payload => { const c = payload.new; setComments(prev => ({ ...prev, [c.problem_id]: [...(prev[c.problem_id] || []), c] })); })
      .subscribe();
  }

  async function upvote(id, e) {
    if (e) e.stopPropagation();
    const alreadyVoted = votedIds.has(id);
    setProblems(prev => prev.map(p => p.id === id ? { ...p, upvotes: p.upvotes + (alreadyVoted ? -1 : 1) } : p));
    setVotedIds(prev => { const next = new Set(prev); alreadyVoted ? next.delete(id) : next.add(id); return next; });
    if (alreadyVoted) {
      await supabase.from("upvotes").delete().match({ problem_id: id, session_id: SESSION_ID });
      await supabase.rpc("decrement_upvotes", { problem_id: id });
    } else {
      await supabase.from("upvotes").insert({ problem_id: id, session_id: SESSION_ID });
      await supabase.rpc("increment_upvotes", { problem_id: id });
    }
  }

  async function submitProblem(form) {
    const { error } = await supabase.from("problems").insert({ title: form.title, industry: form.industry, country: form.country, problem: form.problem, lesson: form.lesson, severity: form.severity, name: form.name || "Anonymous", upvotes: 0 });
    if (error) { showToastMsg("Error submitting. Please try again."); return; }
    setShowForm(false); showToastMsg(t.toast.published);
  }

  async function submitComment(text) {
    if (!detId || !text.trim()) return;
    await supabase.from("comments").insert({ problem_id: detId, author: "Anonymous", body: text.trim() });
    showToastMsg(t.toast.comment);
  }

  async function submitBlog(form) {
    const { error } = await supabase.from("blogs").insert({ title: form.title, body: form.body, tag: form.tag, author: form.author || "Anonymous", country: form.country });
    if (error) { showToastMsg("Error submitting. Please try again."); return; }
    setShowBlogForm(false); showToastMsg(t.toast.blogPublished);
  }

  function showToastMsg(msg) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  const totalUpvotes = problems.reduce((a, p) => a + p.upvotes, 0);
  const filtered = problems.filter(p => {
    if (curCountry && p.country !== curCountry) return false;
    if (curIndustry && p.industry !== curIndustry) return false;
    if (sev && p.severity !== sev) return false;
    if (q && !(p.title + p.problem + p.lesson).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }).sort((a, b) => sort === "up" ? b.upvotes - a.upvotes : sort === "com" ? (comments[b.id]?.length || 0) - (comments[a.id]?.length || 0) : new Date(b.created_at) - new Date(a.created_at));

  const indCounts = (() => { const src = curCountry ? problems.filter(p => p.country === curCountry) : problems; const c = {}; src.forEach(p => { c[p.industry] = (c[p.industry] || 0) + 1; }); return Object.entries(c).sort((a, b) => b[1] - a[1]); })();
  const det = problems.find(p => p.id === detId);
  const detComments = detId ? (comments[detId] || []) : [];
  const detBlog = blogs.find(b => b.id === detBlogId);
  const fmtDate = s => new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const tagSt = (type) => ({ fontSize: "0.67rem", fontWeight: 600, padding: "0.18rem 0.55rem", borderRadius: 100, border: "1px solid", ...(type === "ind" ? { background: "#e8f5eb", color: GREEN, borderColor: "#b8d8bc" } : type === "uk" ? { background: "#e8edf8", color: "#012169", borderColor: "#b8c8e8" } : type === "uz" ? { background: "#edf8f0", color: GREEN, borderColor: "#b0ddb8" } : type === "high" ? { background: "#fde8e8", color: "#b91c1c", borderColor: "#f8c8c8" } : type === "medium" ? { background: "#fef3cd", color: "#92400e", borderColor: "#f8e4a0" } : { background: "#e8f5eb", color: "#166534", borderColor: "#c8e8ce" }) });
  const impType = s => s === "high" ? "high" : s === "medium" ? "medium" : "low";
  const impLabel = s => s === "high" ? `🔴 ${t.impact.high}` : s === "medium" ? `🟡 ${t.impact.medium}` : `🟢 ${t.impact.low}`;
  const ctryTag = c => c === "United Kingdom" ? "uk" : "uz";
  const ctryLabel = c => c === "United Kingdom" ? "🇬🇧 UK" : "🇺🇿 Uzbekistan";

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f8faf8", color: "#1a2e1a", minHeight: "100vh" }}>
      <nav style={{ background: "#fff", borderBottom: "1px solid #dceadc", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, position: "sticky", top: 0, zIndex: 100 }}>
        <div onClick={() => setPage("home")} style={{ fontWeight: 700, fontSize: "1rem", color: GREEN, cursor: "pointer" }}>🗺 MistakeMap <span style={{ color: "#aaa", fontWeight: 400, fontSize: "0.8rem" }}>· UK & Uzbekistan</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {[["home", t.nav.browse], ["blog", t.nav.blog], ["contact", t.nav.contact]].map(([p, label]) => (
            <button key={p} onClick={() => setPage(p)} style={{ background: page === p ? "#e8f5eb" : "transparent", color: page === p ? GREEN : "#7a9a7a", border: "none", padding: "0.4rem 0.7rem", borderRadius: 6, fontFamily: "Inter,sans-serif", fontSize: "0.82rem", fontWeight: 500, cursor: "pointer" }}>{label}</button>
          ))}
          <div style={{ display: "flex", background: "#f0f7f0", borderRadius: 6, overflow: "hidden", border: "1px solid #c8dfc8" }}>
            {["en", "uz"].map(l => (<button key={l} onClick={() => setLang(l)} style={{ background: lang === l ? GREEN : "transparent", color: lang === l ? "#fff" : "#7a9a7a", border: "none", padding: "0.35rem 0.65rem", fontFamily: "Inter,sans-serif", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>{l === "en" ? "🇬🇧 EN" : "🇺🇿 UZ"}</button>))}
          </div>
          <button onClick={() => setShowForm(true)} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 6, padding: "0.45rem 0.9rem", fontFamily: "Inter,sans-serif", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}>{t.nav.share}</button>
        </div>
      </nav>
      <div style={{ background: GREEN, padding: "0.45rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", fontWeight: 600 }}>{t.stats.live}</span>
        {[[problems.length, t.stats.problems], [totalUpvotes, t.stats.upvotes], [2, t.stats.countries]].map(([val, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#fff" }}>{val}</span><span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)" }}>{label}</span></div>
        ))}
      </div>
      {page === "home" && <>
        <div style={{ background: "linear-gradient(135deg,#1a5c30,#0d3a1e)", padding: "3rem 1.5rem 2.5rem", textAlign: "center" }}>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "0.77rem", padding: "0.28rem 0.8rem", borderRadius: 100, marginBottom: "1rem" }}>{t.hero.tag}</div>
          <h1 style={{ fontSize: "clamp(1.6rem,4vw,2.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: "0.75rem" }}>{t.hero.h1a} <span style={{ color: "#7ffba0" }}>{t.hero.h1b}</span> {t.hero.h1c}</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.91rem", maxWidth: 440, margin: "0 auto 1.5rem", lineHeight: 1.65 }}>{t.hero.sub}</p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setShowForm(true)} style={{ background: "#fff", color: GREEN, border: "none", borderRadius: 7, padding: "0.6rem 1.4rem", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>{t.hero.cta}</button>
            <button onClick={() => document.getElementById("problems-section")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.35)", borderRadius: 7, padding: "0.6rem 1.4rem", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>{t.hero.browse}</button>
          </div>
        </div>
        <div id="problems-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem", display: "grid", gridTemplateColumns: "210px 1fr", gap: "1.25rem" }}>
          <aside style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: "#fff", border: "1px solid #dceadc", borderRadius: 10, padding: "1rem" }}>
              <div style={sideTitle()}>{t.sidebar.country}</div>
              {[["", t.sidebar.both], ["United Kingdom", t.sidebar.uk], ["Uzbekistan", t.sidebar.uz]].map(([val, label]) => (
                <FilterBtn key={val} active={curCountry === val} onClick={() => { setCurCountry(val); setCurIndustry(""); }}>{label}</FilterBtn>
              ))}
            </div>
            <div style={{ background: "#fff", border: "1px solid #dceadc", borderRadius: 10, padding: "1rem" }}>
              <div style={sideTitle()}>{t.sidebar.industry}</div>
              <FilterBtn active={curIndustry === ""} onClick={() => setCurIndustry("")}><span style={{ flex: 1 }}>{t.sidebar.all}</span><Pill>{filtered.length}</Pill></FilterBtn>
              {indCounts.map(([ind, cnt]) => (<FilterBtn key={ind} active={curIndustry === ind} onClick={() => setCurIndustry(ind)}><span style={{ flex: 1, fontSize: "0.79rem" }}>{ind}</span><Pill>{cnt}</Pill></FilterBtn>))}
            </div>
            <div style={{ background: "#fff", border: "1px solid #dceadc", borderRadius: 10, padding: "1rem" }}>
              <div style={sideTitle()}>{t.sidebar.chart}</div>
              {indCounts.slice(0, 5).map(([ind, cnt]) => (
                <div key={ind} style={{ marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#7a9a7a", marginBottom: "0.15rem" }}><span>{ind.split("&")[0].trim()}</span><span>{cnt}</span></div>
                  <div style={{ height: 5, background: "#e8f5eb", borderRadius: 10, overflow: "hidden" }}><div style={{ height: "100%", width: `${Math.round(cnt / (indCounts[0]?.[1] || 1) * 100)}%`, background: GREEN, borderRadius: 10, transition: "width 0.6s" }} /></div>
                </div>
              ))}
            </div>
          </aside>
          <div>
            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, position: "relative", minWidth: 160 }}>
                <span style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: "0.78rem" }}>🔍</span>
                <input value={q} onChange={e => setQ(e.target.value)} placeholder={t.filters.search} style={inpSt({ paddingLeft: "2.1rem" })} />
              </div>
              <select value={sort} onChange={e => setSort(e.target.value)} style={selSt()}><option value="new">{t.filters.newest}</option><option value="up">{t.filters.upvoted}</option><option value="com">{t.filters.discussed}</option></select>
              <select value={sev} onChange={e => setSev(e.target.value)} style={selSt()}><option value="">{t.filters.allImp}</option><option value="high">{t.filters.high}</option><option value="medium">{t.filters.medium}</option><option value="low">{t.filters.low}</option></select>
            </div>
            {loading ? <Spinner /> : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}><div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>🔍</div><h3 style={{ color: "#5a7a5a", marginBottom: "0.3rem", fontSize: "0.95rem" }}>{t.empty.title}</h3><p style={{ fontSize: "0.82rem" }}>{t.empty.sub}</p></div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {filtered.map(p => (
                  <div key={p.id} onClick={() => setDetId(p.id)} style={{ background: "#fff", border: "1px solid #dceadc", borderLeft: "3px solid transparent", borderRadius: 10, padding: "1.1rem 1.25rem", cursor: "pointer", transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.borderLeftColor = GREEN; e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,92,48,0.08)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#dceadc"; e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
                    <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.55rem" }}><span style={tagSt("ind")}>{p.industry}</span><span style={tagSt(ctryTag(p.country))}>{ctryLabel(p.country)}</span><span style={tagSt(impType(p.severity))}>{impLabel(p.severity)}</span></div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0d3a1e", marginBottom: "0.3rem", lineHeight: 1.35 }}>{p.title}</div>
                    <div style={{ fontSize: "0.82rem", color: "#7a9a7a", lineHeight: 1.55, marginBottom: "0.7rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.problem}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: "0.8rem", fontSize: "0.73rem", color: "#aaa" }}><span>👤 {p.name}</span><span>📅 {fmtDate(p.created_at)}</span></div>
                      <button onClick={e => upvote(p.id, e)} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: votedIds.has(p.id) ? GREEN : "#f0f7f0", color: votedIds.has(p.id) ? "#fff" : GREEN, border: `1px solid ${votedIds.has(p.id) ? GREEN : "#c8dfc8"}`, borderRadius: 5, padding: "0.28rem 0.65rem", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>▲ {p.upvotes}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </>}
      {page === "blog" && (
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
            <div><h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0d3a1e", marginBottom: "0.25rem" }}>{t.blog.title}</h1><p style={{ color: "#7a9a7a", fontSize: "0.86rem" }}>{t.blog.sub}</p></div>
            <button onClick={() => setShowBlogForm(true)} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 7, padding: "0.55rem 1.1rem", fontWeight: 600, fontSize: "0.84rem", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>{t.blog.write}</button>
          </div>
          {loading ? <Spinner /> : blogs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}><div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>📝</div><h3 style={{ color: "#5a7a5a", fontSize: "0.95rem", marginBottom: "0.3rem" }}>{t.blog.noPost}</h3><p style={{ fontSize: "0.82rem" }}>{t.blog.noPostSub}</p></div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {blogs.map(b => (
                <div key={b.id} onClick={() => setDetBlogId(b.id)} style={{ background: "#fff", border: "1px solid #dceadc", borderRadius: 10, padding: "1.4rem", cursor: "pointer", transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,92,48,0.08)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#dceadc"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.55rem" }}><span style={tagSt("ind")}>{b.tag}</span><span style={tagSt(ctryTag(b.country))}>{ctryLabel(b.country)}</span></div>
                  <h3 style={{ fontWeight: 700, fontSize: "0.97rem", color: "#0d3a1e", marginBottom: "0.35rem", lineHeight: 1.3 }}>{b.title}</h3>
                  <p style={{ fontSize: "0.83rem", color: "#7a9a7a", lineHeight: 1.6, marginBottom: "0.8rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{b.body}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "0.74rem", color: "#aaa" }}>✍️ {b.author} · {fmtDate(b.created_at)}</span><span style={{ fontSize: "0.77rem", color: GREEN, fontWeight: 600 }}>{t.blog.readMore}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {page === "contact" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0d3a1e", marginBottom: "0.6rem" }}>{t.contact.title}</h2>
            <p style={{ fontSize: "0.86rem", color: "#7a9a7a", lineHeight: 1.65, marginBottom: "1.5rem" }}>{t.contact.sub}</p>
            {[["📧", t.contact.email, t.contact.emailV], ["⏱️", t.contact.resp, t.contact.respV], ["🌍", t.contact.serving, t.contact.servingV]].map(([icon, label, val]) => (
              <div key={label} style={{ display: "flex", gap: "0.65rem", marginBottom: "0.85rem", alignItems: "center" }}><div style={{ width: 34, height: 34, background: "#e8f5eb", border: "1px solid #b8d8bc", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>{icon}</div><div><strong style={{ display: "block", fontSize: "0.79rem", color: "#1a2e1a" }}>{label}</strong><span style={{ fontSize: "0.79rem", color: "#7a9a7a" }}>{val}</span></div></div>
            ))}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem" }}>{["🇬🇧 United Kingdom", "🇺🇿 Uzbekistan"].map(c => <span key={c} style={{ background: "#f8faf8", border: "1px solid #dceadc", borderRadius: 6, padding: "0.38rem 0.7rem", fontSize: "0.82rem", fontWeight: 500 }}>{c}</span>)}</div>
          </div>
          <ContactForm t={t} showToast={showToastMsg} />
        </div>
      )}
      {det && (
        <Overlay onClick={() => setDetId(null)}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "1.75rem", width: "100%", maxWidth: 600, border: "1px solid #dceadc" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}><span style={tagSt("ind")}>{det.industry}</span><span style={tagSt(ctryTag(det.country))}>{ctryLabel(det.country)}</span><span style={tagSt(impType(det.severity))}>{impLabel(det.severity)}</span></div>
              <button onClick={() => setDetId(null)} style={xBt()}>✕</button>
            </div>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0d3a1e", marginBottom: "0.5rem", lineHeight: 1.3 }}>{det.title}</h2>
            <p style={{ fontSize: "0.85rem", color: "#7a9a7a", lineHeight: 1.65, marginBottom: "1rem" }}>{det.problem}</p>
            <div style={{ background: "#f0fdf4", border: "1px solid #a8e6bc", borderRadius: 9, padding: "0.85rem 1rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.67rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#166534", marginBottom: "0.3rem" }}>{t.detail.lesson}</div>
              <p style={{ fontSize: "0.85rem", color: "#14532d", lineHeight: 1.6 }}>{det.lesson}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #dceadc" }}>
              <span style={{ fontSize: "0.76rem", color: "#aaa" }}>👤 {det.name} · {fmtDate(det.created_at)}</span>
              <button onClick={() => upvote(det.id)} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: votedIds.has(det.id) ? GREEN : "#f0f7f0", color: votedIds.has(det.id) ? "#fff" : GREEN, border: `1px solid ${votedIds.has(det.id) ? GREEN : "#c8dfc8"}`, borderRadius: 5, padding: "0.3rem 0.7rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>▲ {det.upvotes}</button>
            </div>
            <div style={{ fontSize: "0.81rem", fontWeight: 600, color: "#1a2e1a", marginBottom: "0.7rem" }}>💬 {detComments.length} {t.detail.comments}</div>
            <div style={{ maxHeight: 160, overflowY: "auto", marginBottom: "0.5rem" }}>
              {detComments.length === 0 ? <p style={{ fontSize: "0.79rem", color: "#aaa" }}>{t.detail.noComments}</p> :
                detComments.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.55rem", marginBottom: "0.6rem" }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#e8f5eb", color: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, flexShrink: 0 }}>{c.author[0]}</div>
                    <div><div style={{ fontSize: "0.77rem", fontWeight: 600, color: "#1a2e1a" }}>{c.author}</div><div style={{ fontSize: "0.79rem", color: "#7a9a7a", lineHeight: 1.5 }}>{c.body}</div></div>
                  </div>
                ))}
            </div>
            <CommentInput t={t} onPost={submitComment} />
          </div>
        </Overlay>
      )}
      {detBlog && (
        <Overlay onClick={() => setDetBlogId(null)}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "1.75rem", width: "100%", maxWidth: 620, border: "1px solid #dceadc", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.4rem" }}><span style={tagSt("ind")}>{detBlog.tag}</span><span style={tagSt(ctryTag(detBlog.country))}>{ctryLabel(detBlog.country)}</span></div>
              <button onClick={() => setDetBlogId(null)} style={xBt()}>✕</button>
            </div>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0d3a1e", marginBottom: "0.4rem", lineHeight: 1.3 }}>{detBlog.title}</h2>
            <p style={{ fontSize: "0.75rem", color: "#aaa", marginBottom: "1.25rem" }}>✍️ {detBlog.author} · {fmtDate(detBlog.created_at)}</p>
            {detBlog.body.split("\n").filter(Boolean).map((line, i) => <p key={i} style={{ fontSize: "0.9rem", color: "#5a7a5a", lineHeight: 1.75, marginBottom: "0.75rem" }}>{line}</p>)}
          </div>
        </Overlay>
      )}
      {showForm && <SubmitModal t={t} onClose={() => setShowForm(false)} onSubmit={submitProblem} showToast={showToastMsg} />}
      {showBlogForm && <BlogModal t={t} onClose={() => setShowBlogForm(false)} onSubmit={submitBlog} showToast={showToastMsg} />}
      {toast && (<div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", background: GREEN, color: "#fff", padding: "0.7rem 1.1rem", borderRadius: 8, fontSize: "0.84rem", fontWeight: 500, zIndex: 999, maxWidth: 300, boxShadow: "0 4px 20px rgba(26,92,48,0.25)", animation: "slideUp 0.25s ease" }}>{toast}</div>)}
    </div>
  );
}

function sideTitle() { return { fontSize: "0.67rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#7a9a7a", marginBottom: "0.7rem" }; }
function FilterBtn({ children, active, onClick }) { return <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: "0.4rem", width: "100%", padding: "0.43rem 0.6rem", borderRadius: 6, border: `1px solid ${active ? "#b8d8bc" : "transparent"}`, background: active ? "#e8f5eb" : "none", color: active ? GREEN : "#1a2e1a", fontFamily: "Inter,sans-serif", fontSize: "0.82rem", fontWeight: active ? 600 : 400, cursor: "pointer", textAlign: "left" }}>{children}</button>; }
function Pill({ children }) { return <span style={{ fontSize: "0.69rem", background: "#f0f7f0", padding: "0.1rem 0.4rem", borderRadius: 100, color: "#7a9a7a" }}>{children}</span>; }
function Overlay({ children, onClick }) { return <div onClick={onClick} style={{ position: "fixed", inset: 0, background: "rgba(13,58,30,0.45)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "2rem 1rem", overflowY: "auto" }}>{children}</div>; }
function Spinner() { return <div style={{ textAlign: "center", padding: "3rem", color: "#7a9a7a" }}>Loading...</div>; }
function xBt() { return { background: "#f0f7f0", border: "1px solid #dceadc", borderRadius: 6, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#aaa", fontSize: "0.85rem", flexShrink: 0, fontFamily: "Inter,sans-serif" }; }
function inpSt(extra = {}) { return { background: "#f8faf8", border: "1px solid #dceadc", borderRadius: 7, padding: "0.6rem 0.8rem", fontFamily: "Inter,sans-serif", fontSize: "0.84rem", color: "#1a2e1a", outline: "none", width: "100%", ...extra }; }
function selSt() { return { ...inpSt(), cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23aaa' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.7rem center", paddingRight: "2rem" }; }
function FG({ label, children }) { return <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "0.75rem" }}><label style={{ fontSize: "0.77rem", fontWeight: 600, color: "#5a7a5a" }}>{label}</label>{children}</div>; }
function CommentInput({ t, onPost }) {
  const [val, setVal] = useState("");
  const post = () => { if (val.trim()) { onPost(val.trim()); setVal(""); } };
  return (<div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}><input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === "Enter" && post()} placeholder={t.detail.commentPh} style={inpSt({ flex: 1, fontSize: "0.82rem" })} /><button onClick={post} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 6, padding: "0.5rem 0.85rem", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>{t.detail.post}</button></div>);
}
function SubmitModal({ t, onClose, onSubmit, showToast }) {
  const [f, setF] = useState({ industry: "", country: "", title: "", problem: "", lesson: "", severity: "high", name: "" });
  const set = (k, v) => setF(x => ({ ...x, [k]: v }));
  const submit = () => { if (!f.industry || !f.country || !f.title || !f.problem || !f.lesson) { showToast(t.toast.fill); return; } onSubmit(f); };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,58,30,0.45)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 14, padding: "1.75rem", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", border: "1px solid #dceadc" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}><div><h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0d3a1e" }}>{t.form.title}</h2><p style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "0.2rem" }}>{t.form.sub}</p></div><button onClick={onClose} style={xBt()}>✕</button></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          <FG label={t.form.industry}><select value={f.industry} onChange={e => set("industry", e.target.value)} style={selSt()}><option value="">{t.form.selectInd}</option>{t.form.industries.map(i => <option key={i}>{i}</option>)}</select></FG>
          <FG label={t.form.country}><select value={f.country} onChange={e => set("country", e.target.value)} style={selSt()}><option value="">{t.form.selectCou}</option><option>United Kingdom</option><option>Uzbekistan</option></select></FG>
        </div>
        <FG label={t.form.ptitle}><input value={f.title} onChange={e => set("title", e.target.value)} style={inpSt()} placeholder="e.g. Hired too fast before getting a second client" /></FG>
        <FG label={t.form.problem}><textarea value={f.problem} onChange={e => set("problem", e.target.value)} style={{ ...inpSt(), minHeight: 80, resize: "vertical" }} placeholder="Describe what happened..." /></FG>
        <FG label={t.form.lesson}><textarea value={f.lesson} onChange={e => set("lesson", e.target.value)} style={{ ...inpSt(), minHeight: 70, resize: "vertical" }} placeholder="What should others do differently?" /></FG>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          <FG label={t.form.impact}><select value={f.severity} onChange={e => set("severity", e.target.value)} style={selSt()}><option value="high">{t.form.high}</option><option value="medium">{t.form.medium}</option><option value="low">{t.form.low}</option></select></FG>
          <FG label={t.form.name}><input value={f.name} onChange={e => set("name", e.target.value)} style={inpSt()} placeholder={t.form.namePh} /></FG>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button onClick={onClose} style={{ background: "#f0f7f0", color: "#7a9a7a", border: "1px solid #dceadc", borderRadius: 6, padding: "0.5rem 1rem", fontFamily: "Inter,sans-serif", fontSize: "0.83rem", cursor: "pointer" }}>{t.form.cancel}</button>
          <button onClick={submit} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 6, padding: "0.5rem 1.1rem", fontFamily: "Inter,sans-serif", fontWeight: 600, fontSize: "0.83rem", cursor: "pointer" }}>{t.form.publish}</button>
        </div>
      </div>
    </div>
  );
}
function BlogModal({ t, onClose, onSubmit, showToast }) {
  const [f, setF] = useState({ title: "", body: "", tag: "Lesson", author: "", country: "United Kingdom" });
  const set = (k, v) => setF(x => ({ ...x, [k]: v }));
  const submit = () => { if (!f.title || !f.body) { showToast(t.toast.fill); return; } onSubmit(f); };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,58,30,0.45)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 14, padding: "1.75rem", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", border: "1px solid #dceadc" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}><h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0d3a1e" }}>{t.blog.write}</h2><button onClick={onClose} style={xBt()}>✕</button></div>
        <FG label={t.blog.postTitle}><input value={f.title} onChange={e => set("title", e.target.value)} style={inpSt()} placeholder="Your post title" /></FG>
        <FG label={t.blog.postBody}><textarea value={f.body} onChange={e => set("body", e.target.value)} style={{ ...inpSt(), minHeight: 140, resize: "vertical" }} placeholder="Write your story, lesson, or insight..." /></FG>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem" }}>
          <FG label={t.blog.postTag}><select value={f.tag} onChange={e => set("tag", e.target.value)} style={selSt()}><option>Lesson</option><option>Research</option><option>Story</option><option>Advice</option></select></FG>
          <FG label={t.form.country}><select value={f.country} onChange={e => set("country", e.target.value)} style={selSt()}><option>United Kingdom</option><option>Uzbekistan</option></select></FG>
          <FG label={t.form.name}><input value={f.author} onChange={e => set("author", e.target.value)} style={inpSt()} placeholder="Anonymous" /></FG>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button onClick={onClose} style={{ background: "#f0f7f0", color: "#7a9a7a", border: "1px solid #dceadc", borderRadius: 6, padding: "0.5rem 1rem", fontFamily: "Inter,sans-serif", fontSize: "0.83rem", cursor: "pointer" }}>{t.form.cancel}</button>
          <button onClick={submit} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 6, padding: "0.5rem 1.1rem", fontFamily: "Inter,sans-serif", fontWeight: 600, fontSize: "0.83rem", cursor: "pointer" }}>{t.blog.publish}</button>
        </div>
      </div>
    </div>
  );
}
function ContactForm({ t, showToast }) {
  const [f, setF] = useState({ name: "", email: "", country: "", message: "" });
  const set = (k, v) => setF(x => ({ ...x, [k]: v }));
  const send = () => { if (!f.name || !f.email || !f.message) { showToast(t.toast.fill); return; } setF({ name: "", email: "", country: "", message: "" }); showToast(t.toast.contact); };
  return (
    <div style={{ background: "#f8faf8", border: "1px solid #dceadc", borderRadius: 12, padding: "1.5rem" }}>
      <h3 style={{ fontWeight: 700, fontSize: "0.97rem", color: "#0d3a1e", marginBottom: "0.25rem" }}>{t.contact.formTitle}</h3>
      <p style={{ fontSize: "0.79rem", color: "#aaa", marginBottom: "1.25rem" }}>{t.contact.formSub}</p>
      <FG label={t.contact.nameL}><input value={f.name} onChange={e => set("name", e.target.value)} style={inpSt()} placeholder="Your name" /></FG>
      <FG label={t.contact.emailL}><input value={f.email} onChange={e => set("email", e.target.value)} type="email" style={inpSt()} placeholder="your@email.com" /></FG>
      <FG label={t.contact.countryL}><select value={f.country} onChange={e => set("country", e.target.value)} style={selSt()}><option value="">Select country</option><option>United Kingdom</option><option>Uzbekistan</option></select></FG>
      <FG label={t.contact.msgL}><textarea value={f.message} onChange={e => set("message", e.target.value)} style={{ ...inpSt(), minHeight: 90, resize: "vertical" }} placeholder="How can we help?" /></FG>
      <button onClick={send} style={{ width: "100%", background: GREEN, color: "#fff", border: "none", borderRadius: 6, padding: "0.65rem", fontFamily: "Inter,sans-serif", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", marginTop: "0.25rem" }}>{t.contact.send}</button>
    </div>
  );
}
