import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ofilqtstiztflvarmkxa.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_6_OJbucbFlW0tXqzj11Ttw_XI02F9uq";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SESSION_ID = (() => {
  let id = sessionStorage.getItem("mm_session");
  if (!id) { id = Math.random().toString(36).slice(2); sessionStorage.setItem("mm_session", id); }
  return id;
})();

const GREEN = "#1a5c30";
const DARK = "#0d3a1e";

// ── SOLUTION PROVIDERS BY INDUSTRY ──
const SOLUTION_PROVIDERS = {
  "Finance & Banking": [
    { name: "Uzbek Accounting Pro", role: "Certified Accountant", desc: "Tax compliance, bookkeeping & financial planning for SMEs in Uzbekistan.", contact: "hello@uzaccpro.uz", icon: "💼" },
    { name: "FinAdvisor UZ", role: "Financial Advisor", desc: "Investment strategy, cash flow management and business loans guidance.", contact: "info@finadvisor.uz", icon: "📊" },
  ],
  "Marketing & Agency": [
    { name: "Growth Hive Agency", role: "Marketing Consultant", desc: "Digital marketing, brand strategy and customer acquisition for startups.", contact: "hello@growthhive.uz", icon: "📣" },
    { name: "Brand Studio UZ", role: "Brand Strategist", desc: "Brand identity, positioning and go-to-market strategy.", contact: "studio@branduz.com", icon: "🎨" },
  ],
  "Technology & SaaS": [
    { name: "IT Park Uzbekistan", role: "Tech Accelerator", desc: "Funding, mentorship and infrastructure for tech startups in Uzbekistan.", contact: "info@it-park.uz", icon: "🚀" },
    { name: "DevConsult UZ", role: "Tech Consultant", desc: "Software architecture, product development and CTO-as-a-service.", contact: "hi@devconsult.uz", icon: "💻" },
  ],
  "Fashion & Retail": [
    { name: "Retail Strategy UZ", role: "Retail Consultant", desc: "Supply chain optimisation, inventory management and retail expansion.", contact: "hello@retailstrat.uz", icon: "🏪" },
    { name: "FashionBiz Coach", role: "Fashion Business Coach", desc: "Pricing strategy, supplier relations and export readiness for fashion brands.", contact: "coach@fashionbiz.uz", icon: "👗" },
  ],
  "Food & Restaurant": [
    { name: "HospitalityPro UZ", role: "Restaurant Consultant", desc: "Menu costing, kitchen operations and franchise development.", contact: "info@hospro.uz", icon: "🍽️" },
    { name: "FoodBiz Legal", role: "Food Industry Lawyer", desc: "Licensing, health permits and franchise agreements for F&B businesses.", contact: "legal@foodbiz.uz", icon: "⚖️" },
  ],
  "E-commerce": [
    { name: "Ecom Rocket UZ", role: "E-commerce Consultant", desc: "Marketplace strategy, logistics setup and conversion optimisation.", contact: "hi@ecomrocket.uz", icon: "📦" },
    { name: "Logistics Partner", role: "Fulfilment Expert", desc: "Last-mile delivery, warehousing and cross-border shipping solutions.", contact: "ops@logpartner.uz", icon: "🚚" },
  ],
  "Manufacturing": [
    { name: "ManufactureUZ", role: "Operations Consultant", desc: "Factory setup, quality control and export certification support.", contact: "ops@manufuz.com", icon: "🏭" },
  ],
  "Education": [
    { name: "EduVenture UZ", role: "Education Consultant", desc: "Curriculum development, accreditation and edtech business models.", contact: "hello@eduventure.uz", icon: "🎓" },
  ],
  "Healthcare": [
    { name: "HealthBiz Advisor", role: "Healthcare Consultant", desc: "Clinic setup, medical licensing and healthcare compliance in Uzbekistan.", contact: "consult@healthbiz.uz", icon: "🏥" },
  ],
  "Travel & Tourism": [
    { name: "Tourism Pro UZ", role: "Tourism Consultant", desc: "Tour operator licensing, partnerships and destination marketing.", contact: "info@tourpro.uz", icon: "✈️" },
  ],
  "Real Estate": [
    { name: "PropLegal UZ", role: "Real Estate Lawyer", desc: "Property contracts, due diligence and construction permits.", contact: "legal@proplegal.uz", icon: "🏠" },
  ],
  "Other": [
    { name: "BizAdvisor UZ", role: "General Business Advisor", desc: "Business plan, registration, funding and growth strategy for any sector.", contact: "hello@bizadvisor.uz", icon: "🧭" },
  ],
};

// ── STARTUP COMPETITIONS ──
const STARTUP_COMPETITIONS = [
  { name: "IT Park Demo Day", location: "🇺🇿 Tashkent", prize: "$50,000", deadline: "2026-05-20", url: "https://it-park.uz" },
  { name: "Seedstars Uzbekistan", location: "🇺🇿 Tashkent", prize: "$500,000", deadline: "2026-06-01", url: "https://seedstars.com" },
  { name: "Global Startup Awards", location: "🌍 Global", prize: "€100,000", deadline: "2026-06-15", url: "https://globalstartupawards.com" },
  { name: "TechCrunch Disrupt", location: "🇺🇸 San Francisco", prize: "$100,000", deadline: "2026-07-01", url: "https://techcrunch.com/events/tc-disrupt" },
  { name: "Startup World Cup", location: "🌍 Global", prize: "$1,000,000", deadline: "2026-07-30", url: "https://startupworldcup.io" },
];

// ── CSS KEYFRAMES ──
const STYLES = `
@keyframes moneyFall {
  0%   { transform: translateY(-60px) rotate(0deg);   opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes chatSlide {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes stepIn {
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
}
`;
if (!document.getElementById("mm-styles")) {
  const s = document.createElement("style");
  s.id = "mm-styles";
  s.textContent = STYLES;
  document.head.appendChild(s);
}

const T = {
  en: {
    nav: { browse: "Browse", blog: "Blog", contact: "Contact", validate: "🧪 Validate Idea", share: "+ Share a Mistake", login: "Sign In", logout: "Sign Out" },
    hero: { tag: "🇬🇧 UK & 🇺🇿 Uzbekistan", h1a: "Stop Making", h1b: "Mistakes", h1c: "Others Already Made", sub: "A community where business owners share real failures — so you can learn before it costs you.", cta: "Share Your Story →", browse: "Browse Problems" },
    stats: { problems: "Stories shared", upvotes: "Total upvotes", countries: "Countries", live: "● Live" },
    sidebar: { country: "Country", both: "🌍 Both Countries", uk: "🇬🇧 United Kingdom", uz: "🇺🇿 Uzbekistan", industry: "Industry", all: "All Industries", chart: "By Industry", leaderboard: "🏆 Monthly Top Contributors", leaderboardSub: "Top 5 this month" },
    filters: { search: "Search stories...", newest: "Newest", upvoted: "Most upvoted", discussed: "Most discussed", allImp: "All impact", high: "🔴 High", medium: "🟡 Medium", low: "🟢 Low" },
    card: { comments: "comments" },
    empty: { title: "No stories found", sub: "Try a different filter or be the first to share here." },
    topCases: { title: "💸 Big Loss Cases", sub: "Real business failures that cost $100k+", noData: "No $100k+ cases yet. Be the first to share." },
    form: { title: "Share a Business Mistake", sub: "Your story could save someone else's business.", industry: "Industry *", country: "Country *", ptitle: "What went wrong? (title) *", problem: "What happened? *", lesson: "Lesson learned *", impact: "Impact", name: "Your name", namePh: "Anonymous", cancel: "Cancel", publish: "Publish →", loss: "Loss Amount ($)", lossph: "e.g. 50000", image: "Upload Image (optional)", industries: ["Fashion & Retail","Technology & SaaS","Food & Restaurant","Marketing & Agency","Finance & Banking","E-commerce","Manufacturing","Education","Healthcare","Travel & Tourism","Real Estate","Other"], high: "🔴 High — nearly fatal", medium: "🟡 Medium — major setback", low: "🟢 Low — minor but useful", selectInd: "Select industry", selectCou: "Select country" },
    detail: { lesson: "✅ Lesson Learned", comments: "Comments", noComments: "No comments yet.", commentPh: "Add a comment...", post: "Post", reviews: "⭐ Reviews", noReviews: "No reviews yet.", reviewPh: "Share your thoughts...", submitReview: "Post Review", loginReview: "Sign in to write a review", lossLabel: "💸 Total Loss", providers: "🤝 Get Help With This Problem" },
    blog: { title: "Blog & Stories", sub: "Insights from the UK and Uzbekistan business community.", write: "Write a Post", readMore: "Read more →", noPost: "No blog posts yet.", noPostSub: "Be the first to share a story.", postTitle: "Post Title *", postBody: "Write your story *", postTag: "Tag", publish: "Publish Post", competitions: "🏆 Startup Competitions", sponsoredBy: "Sponsored", daysLeft: "days left", applyNow: "Apply →", itparkAd: "IT Park Uzbekistan — The home of tech innovation. Apply for residency, funding & mentorship.", itparkCta: "Learn More →" },
    contact: { title: "Contact Us", sub: "Questions or partnership ideas?", email: "Email", emailV: "hello@mistakemap.co.uk", resp: "Response time", respV: "Within 24 hours", serving: "Serving", servingV: "UK & Uzbekistan only", formTitle: "Send a message", formSub: "We read every message.", nameL: "Name *", emailL: "Email *", countryL: "Country", msgL: "Message *", send: "Send Message →" },
    auth: { loginTitle: "Welcome Back", regTitle: "Create Account", email: "Email *", password: "Password *", name: "Your Name *", company: "Company / Business", country: "Country", loginBtn: "Sign In", regBtn: "Create Account", switchToReg: "Don't have an account? Register →", switchToLogin: "Already have an account? Sign in →", verifyNote: "Please verify your email after signing up.", verified: "✓ Verified", notVerified: "Email not verified" },
    toast: { published: "✓ Published!", comment: "Comment posted!", contact: "✓ Message sent!", blogPublished: "✓ Blog post published!", fill: "Please fill in all required fields.", loginSuccess: "Welcome back!", regSuccess: "Account created! Check your email.", loggedOut: "Signed out.", reviewPosted: "Review posted!", verifyResent: "Verification email resent." },
    impact: { high: "High", medium: "Medium", low: "Low" },
    chat: { title: "AI Business Advisor", placeholder: "Ask about business mistakes...", send: "Send", thinking: "Thinking...", open: "Ask AI", close: "Close", welcome: "Hi! I'm your AI business advisor. Ask me anything about business mistakes and how to avoid them." },
    failAnim: { title: "Every Day Businesses Fail", sub: "Don't be a statistic. Learn from those who've been there.", stat1: "90% of startups fail", stat2: "38% run out of cash", stat3: "35% no market need", stat4: "$1.4M avg loss", stat5: "20% fail year one", cta: "See Real $100k+ Cases →" },
    validator: {
      title: "🧪 Business Idea Validator",
      sub: "Test your idea against the Uzbekistan market before you invest",
      step1Title: "Tell us your idea",
      ideaLabel: "Business Idea *", ideaPh: "e.g. Online grocery delivery for Tashkent neighbourhoods",
      industryLabel: "Industry *",
      priceLabel: "Price point ($)",  pricePh: "e.g. 15",
      budgetLabel: "Startup budget ($)", budgetPh: "e.g. 5000",
      analyseBtn: "Analyse My Idea →",
      steps: ["Market Research", "Target Segments", "Competitor Analysis", "Affordability", "Final Verdict"],
      analysing: "Analysing...",
      goVerdict: "✅ GO — Strong opportunity",
      cautionVerdict: "⚠️ CAUTION — Proceed carefully",
      nogoVerdict: "❌ NO-GO — High risk",
      scoreLabel: "Opportunity Score",
      restart: "← Validate Another Idea",
    },
  },
  uz: {
    nav: { browse: "Ko'rish", blog: "Blog", contact: "Aloqa", validate: "🧪 Fikrni tekshirish", share: "+ Xatoni ulashing", login: "Kirish", logout: "Chiqish" },
    hero: { tag: "🇬🇧 UK va 🇺🇿 O'zbekiston", h1a: "Boshqalar qilgan", h1b: "Xatolarni", h1c: "Takrorlamang", sub: "Biznes egalari haqiqiy muvaffaqiyatsizliklarini baham ko'radigan jamiyat.", cta: "Hikoyangizni ulashing →", browse: "Muammolarni ko'rish" },
    stats: { problems: "Ulashilgan hikoyalar", upvotes: "Jami ovozlar", countries: "Mamlakatlar", live: "● Jonli" },
    sidebar: { country: "Mamlakat", both: "🌍 Ikkala mamlakat", uk: "🇬🇧 Birlashgan Qirollik", uz: "🇺🇿 O'zbekiston", industry: "Soha", all: "Barcha sohalar", chart: "Soha bo'yicha", leaderboard: "🏆 Oylik Top Hissadorlar", leaderboardSub: "Bu oyda top 5" },
    filters: { search: "Hikoyalarni qidirish...", newest: "Eng yangi", upvoted: "Ko'p ovoz olgan", discussed: "Ko'p muhokama", allImp: "Barcha ta'sir", high: "🔴 Yuqori", medium: "🟡 O'rtacha", low: "🟢 Past" },
    card: { comments: "izoh" },
    empty: { title: "Hikoyalar topilmadi", sub: "Boshqa filtrni sinab ko'ring." },
    topCases: { title: "💸 Katta zarar holatlari", sub: "$100k+ zarar ko'rgan biznes holatlari", noData: "Hali $100k+ holat yo'q." },
    form: { title: "Biznes xatosini ulashing", sub: "Hikoyangiz boshqalarni saqlab qolishi mumkin.", industry: "Soha *", country: "Mamlakat *", ptitle: "Nima noto'g'ri ketdi? *", problem: "Nima bo'ldi? *", lesson: "O'rganilgan dars *", impact: "Ta'sir", name: "Ismingiz", namePh: "Anonim", cancel: "Bekor qilish", publish: "Nashr etish →", loss: "Zarar miqdori ($)", lossph: "masalan: 50000", image: "Rasm yuklash", industries: ["Moda va chakana savdo","Texnologiya va SaaS","Oziq-ovqat va restoran","Marketing va agentlik","Moliya va bank","Elektron tijorat","Ishlab chiqarish","Ta'lim","Sog'liqni saqlash","Sayohat va turizm","Ko'chmas mulk","Boshqa"], high: "🔴 Yuqori — deyarli halokatli", medium: "🟡 O'rtacha — katta to'siq", low: "🟢 Past — kichik lekin foydali", selectInd: "Sohani tanlang", selectCou: "Mamlakatni tanlang" },
    detail: { lesson: "✅ O'rganilgan dars", comments: "Izohlar", noComments: "Hali izoh yo'q.", commentPh: "Izoh qo'shing...", post: "Yuborish", reviews: "⭐ Sharhlar", noReviews: "Hali sharh yo'q.", reviewPh: "Fikringizni ulashing...", submitReview: "Sharh jo'natish", loginReview: "Sharh yozish uchun kiring", lossLabel: "💸 Umumiy zarar", providers: "🤝 Bu muammo bo'yicha yordam" },
    blog: { title: "Blog va Hikoyalar", sub: "UK va O'zbekiston biznes hamjamiyatidan tushunchalar.", write: "Post yozing", readMore: "Ko'proq o'qish →", noPost: "Hali blog postlari yo'q.", noPostSub: "Birinchi bo'lib ulashing.", postTitle: "Post sarlavhasi *", postBody: "Hikoyangizni yozing *", postTag: "Teg", publish: "Postni nashr etish", competitions: "🏆 Startup musobaqalari", sponsoredBy: "Homiy", daysLeft: "kun qoldi", applyNow: "Ariza →", itparkAd: "IT Park O'zbekiston — Texnologik innovatsiyalar markazi. Rezidentlik, moliyalash va mentorlik.", itparkCta: "Ko'proq →" },
    contact: { title: "Biz bilan bog'laning", sub: "Savollar yoki hamkorlik g'oyalari?", email: "Elektron pochta", emailV: "hello@mistakemap.co.uk", resp: "Javob vaqti", respV: "24 soat ichida", serving: "Xizmat", servingV: "Faqat UK va O'zbekiston", formTitle: "Xabar yuboring", formSub: "Har bir xabarni o'qiymiz.", nameL: "Ism *", emailL: "Elektron pochta *", countryL: "Mamlakat", msgL: "Xabar *", send: "Xabar yuborish →" },
    auth: { loginTitle: "Xush kelibsiz", regTitle: "Hisob yaratish", email: "Elektron pochta *", password: "Parol *", name: "Ismingiz *", company: "Kompaniya", country: "Mamlakat", loginBtn: "Kirish", regBtn: "Hisob yaratish", switchToReg: "Hisobingiz yo'qmi? →", switchToLogin: "Hisobingiz bormi? →", verifyNote: "Emailingizni tasdiqlang.", verified: "✓ Tasdiqlangan", notVerified: "Tasdiqlanmagan" },
    toast: { published: "✓ Nashr etildi!", comment: "Izoh qo'shildi!", contact: "✓ Xabar yuborildi!", blogPublished: "✓ Nashr etildi!", fill: "Barcha maydonlarni to'ldiring.", loginSuccess: "Xush kelibsiz!", regSuccess: "Hisob yaratildi!", loggedOut: "Chiqildi.", reviewPosted: "Sharh qo'shildi!", verifyResent: "Email qayta yuborildi." },
    impact: { high: "Yuqori", medium: "O'rtacha", low: "Past" },
    chat: { title: "AI Biznes Maslahatchisi", placeholder: "Biznes xatolari haqida so'rang...", send: "Yuborish", thinking: "O'ylamoqda...", open: "AI", close: "Yopish", welcome: "Salom! Men AI biznes maslahatchingizman." },
    failAnim: { title: "Har kuni bizneslar yopiladi", sub: "Statistika bo'lmang.", stat1: "90% startuplar yopiladi", stat2: "38% pul tugaydi", stat3: "35% bozor yo'q", stat4: "$1.4M o'rtacha zarar", stat5: "20% 1-yilda yopiladi", cta: "Haqiqiy $100k+ holatlar →" },
    validator: {
      title: "🧪 Biznes Fikr Tekshirgich", sub: "O'zbekiston bozorida fikringizni test qiling",
      step1Title: "Fikringizni aytib bering",
      ideaLabel: "Biznes fikr *", ideaPh: "masalan: Toshkent mahallalari uchun online oziq-ovqat yetkazib berish",
      industryLabel: "Soha *", priceLabel: "Narx ($)", pricePh: "masalan: 15",
      budgetLabel: "Boshlang'ich byudjet ($)", budgetPh: "masalan: 5000",
      analyseBtn: "Tahlil qilish →",
      steps: ["Bozor tadqiqoti", "Maqsad segmentlar", "Raqobatchilar", "Sotib olish qobiliyati", "Yakuniy hukm"],
      analysing: "Tahlil qilinmoqda...",
      goVerdict: "✅ BORING — Kuchli imkoniyat",
      cautionVerdict: "⚠️ EHTIYOT — Ehtiyotkorlik bilan",
      nogoVerdict: "❌ BORING EMAS — Yuqori xavf",
      scoreLabel: "Imkoniyat bali",
      restart: "← Boshqa fikrni tekshirish",
    },
  }
};

// ── HELPER STYLES ──
function sideTitle() { return { fontSize: "0.67rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#7a9a7a", marginBottom: "0.7rem" }; }
function inpSt(extra = {}) { return { background: "#f8faf8", border: "1px solid #dceadc", borderRadius: 7, padding: "0.6rem 0.8rem", fontFamily: "Inter,sans-serif", fontSize: "0.84rem", color: "#1a2e1a", outline: "none", width: "100%", boxSizing: "border-box", ...extra }; }
function selSt() { return { ...inpSt(), cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23aaa' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.7rem center", paddingRight: "2rem" }; }
function xBt() { return { background: "#f0f7f0", border: "1px solid #dceadc", borderRadius: 6, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#aaa", fontSize: "0.85rem", flexShrink: 0, fontFamily: "Inter,sans-serif" }; }
function FilterBtn({ children, active, onClick }) {
  return <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: "0.4rem", width: "100%", padding: "0.43rem 0.6rem", borderRadius: 6, border: `1px solid ${active ? "#b8d8bc" : "transparent"}`, background: active ? "#e8f5eb" : "none", color: active ? GREEN : "#1a2e1a", fontFamily: "Inter,sans-serif", fontSize: "0.82rem", fontWeight: active ? 600 : 400, cursor: "pointer", textAlign: "left" }}>{children}</button>;
}
function Pill({ children }) { return <span style={{ fontSize: "0.69rem", background: "#f0f7f0", padding: "0.1rem 0.4rem", borderRadius: 100, color: "#7a9a7a" }}>{children}</span>; }
function Overlay({ children, onClick }) { return <div onClick={onClick} style={{ position: "fixed", inset: 0, background: "rgba(13,58,30,0.45)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "2rem 1rem", overflowY: "auto" }}>{children}</div>; }
function Spinner() { return <div style={{ textAlign: "center", padding: "3rem", color: "#7a9a7a" }}>Loading...</div>; }
function FG({ label, children }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "0.75rem" }}><label style={{ fontSize: "0.77rem", fontWeight: 600, color: "#5a7a5a" }}>{label}</label>{children}</div>;
}

// ── SOLUTION PROVIDERS COMPONENT ──
function SolutionProviders({ t, industry }) {
  const providers = SOLUTION_PROVIDERS[industry] || SOLUTION_PROVIDERS["Other"];
  return (
    <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid #f0f0f0" }}>
      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1a2e1a", marginBottom: "0.85rem" }}>{t.detail.providers}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {providers.map((p, i) => (
          <div key={i} style={{ background: "linear-gradient(135deg, #f0fdf4, #f8faf8)", border: "1px solid #c8e6cc", borderRadius: 10, padding: "0.85rem 1rem", display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>{p.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                <span style={{ fontWeight: 700, fontSize: "0.84rem", color: DARK }}>{p.name}</span>
                <span style={{ fontSize: "0.67rem", background: "#e8f5eb", color: GREEN, border: "1px solid #b8d8bc", borderRadius: 100, padding: "0.1rem 0.5rem", fontWeight: 600 }}>{p.role}</span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#7a9a7a", lineHeight: 1.5, margin: "0 0 0.4rem" }}>{p.desc}</p>
              <a href={`mailto:${p.contact}`} style={{ fontSize: "0.75rem", color: GREEN, fontWeight: 600, textDecoration: "none" }}>📧 {p.contact}</a>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: "0.7rem", color: "#ccc", marginTop: "0.6rem", textAlign: "center" }}>
        Want to be listed here? <a href="mailto:hello@mistakemap.co.uk" style={{ color: GREEN }}>Contact us</a>
      </p>
    </div>
  );
}

// ── IT PARK AD ──
function ItParkAd({ t }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #0a2e1a, #1a5c30)", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
      <div style={{ position: "absolute", bottom: -15, left: -15, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>{t.blog.sponsoredBy}</div>
        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", marginBottom: "0.4rem" }}>IT Park 🇺🇿</div>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.5, marginBottom: "0.85rem" }}>{t.blog.itparkAd}</p>
        <a href="https://it-park.uz" target="_blank" rel="noreferrer"
          style={{ display: "inline-block", background: "#fff", color: GREEN, fontSize: "0.75rem", fontWeight: 700, padding: "0.4rem 0.9rem", borderRadius: 6, textDecoration: "none" }}>
          {t.blog.itparkCta}
        </a>
      </div>
    </div>
  );
}

// ── STARTUP COMPETITIONS WIDGET ──
function CompetitionsWidget({ t }) {
  const getDaysLeft = deadline => {
    const d = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return d > 0 ? d : 0;
  };
  return (
    <div style={{ background: "#fff", border: "1px solid #dceadc", borderRadius: 12, padding: "1rem" }}>
      <div style={sideTitle()}>{t.blog.competitions}</div>
      {STARTUP_COMPETITIONS.map((c, i) => {
        const days = getDaysLeft(c.deadline);
        const urgent = days <= 14;
        return (
          <div key={i} style={{ paddingBottom: "0.75rem", marginBottom: "0.75rem", borderBottom: i < STARTUP_COMPETITIONS.length - 1 ? "1px solid #f0f5f0" : "none" }}>
            <div style={{ fontWeight: 700, fontSize: "0.8rem", color: DARK, marginBottom: "0.2rem" }}>{c.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
              <span style={{ fontSize: "0.71rem", color: "#aaa" }}>{c.location}</span>
              <span style={{ fontSize: "0.71rem", fontWeight: 700, color: "#22743c" }}>{c.prize}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.68rem", color: urgent ? "#ef4444" : "#aaa", fontWeight: urgent ? 700 : 400 }}>
                {urgent ? "🔥 " : "📅 "}{days} {t.blog.daysLeft}
              </span>
              <a href={c.url} target="_blank" rel="noreferrer"
                style={{ fontSize: "0.68rem", fontWeight: 700, color: GREEN, textDecoration: "none", background: "#e8f5eb", padding: "0.15rem 0.5rem", borderRadius: 4 }}>
                {t.blog.applyNow}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── MONEY PARTICLE ──
function MoneyParticle({ style }) {
  const emojis = ["💸","💰","🤑","💵","💶"];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  return (
    <div style={{ position: "absolute", top: "-60px", fontSize: `${1 + Math.random()}rem`, animation: `moneyFall ${3 + Math.random() * 4}s linear infinite`, animationDelay: `${Math.random() * 5}s`, pointerEvents: "none", userSelect: "none", zIndex: 0, ...style }}>{emoji}</div>
  );
}

// ── STARTUP FAIL SECTION ──
function StartupFailSection({ t, onCtaClick }) {
  const particles = Array.from({ length: 18 }, (_, i) => i);
  const stats = [
    { emoji: "💀", text: t.failAnim.stat1 },
    { emoji: "💸", text: t.failAnim.stat2 },
    { emoji: "🔍", text: t.failAnim.stat3 },
    { emoji: "📉", text: t.failAnim.stat4 },
    { emoji: "📅", text: t.failAnim.stat5 },
  ];
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a1a0a 100%)", padding: "4rem 1.5rem", textAlign: "center" }}>
      {particles.map(i => <MoneyParticle key={i} style={{ left: `${(i / 18) * 100}%` }} />)}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-block", background: "rgba(255,60,60,0.15)", border: "1px solid rgba(255,60,60,0.3)", color: "#ff6060", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", padding: "0.28rem 0.9rem", borderRadius: 100, marginBottom: "1.25rem" }}>⚠ Business Failure Reality Check</div>
        <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: "0.75rem", animation: "fadeUp 0.6s ease both" }}>{t.failAnim.title}</h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", marginBottom: "2.5rem", animation: "fadeUp 0.6s 0.1s ease both" }}>{t.failAnim.sub}</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "1rem 1.25rem", minWidth: 130, animation: `fadeUp 0.6s ${0.1 + i * 0.08}s ease both`, backdropFilter: "blur(6px)" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.35rem" }}>{s.emoji}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)", fontWeight: 600, lineHeight: 1.3 }}>{s.text}</div>
            </div>
          ))}
        </div>
        <button onClick={onCtaClick} style={{ background: "linear-gradient(135deg, #e53e3e, #c53030)", color: "#fff", border: "none", borderRadius: 9, padding: "0.8rem 2rem", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "0 8px 30px rgba(229,62,62,0.35)", animation: "fadeUp 0.6s 0.5s ease both" }}>{t.failAnim.cta}</button>
      </div>
    </div>
  );
}

// ── TOP CASES ──
function TopCasesSection({ t, problems, onOpen, votedIds, onUpvote }) {
  const top = problems.filter(p => p.loss_amount && p.loss_amount >= 100000).sort((a, b) => b.loss_amount - a.loss_amount);
  const fmtMoney = n => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${Math.round(n / 1000)}k`;
  return (
    <div id="top-cases" style={{ background: "#fff9f9", borderTop: "1px solid #ffe0e0", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#7f1d1d", marginBottom: "0.4rem" }}>{t.topCases.title}</h2>
          <p style={{ color: "#b45309", fontSize: "0.86rem" }}>{t.topCases.sub}</p>
        </div>
        {top.length === 0 ? <p style={{ textAlign: "center", color: "#aaa", fontSize: "0.86rem" }}>{t.topCases.noData}</p> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {top.map(p => (
              <div key={p.id} onClick={() => onOpen(p.id)} style={{ background: "#fff", border: "2px solid #fca5a5", borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.15s", boxShadow: "0 2px 12px rgba(220,38,38,0.08)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(220,38,38,0.18)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(220,38,38,0.08)"; }}>
                {p.image_url && <div style={{ height: 140, overflow: "hidden" }}><img src={p.image_url} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>}
                <div style={{ padding: "1rem" }}>
                  <div style={{ display: "inline-block", background: "linear-gradient(135deg, #7f1d1d, #ef4444)", color: "#fff", fontSize: "1.1rem", fontWeight: 800, padding: "0.3rem 0.8rem", borderRadius: 8, marginBottom: "0.65rem", fontFamily: "monospace" }}>{fmtMoney(p.loss_amount)}</div>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1a2e1a", lineHeight: 1.35, marginBottom: "0.4rem" }}>{p.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "#9a9a9a", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.problem}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
                    <span style={{ fontSize: "0.73rem", color: "#bbb" }}>👤 {p.name}</span>
                    <button onClick={e => { e.stopPropagation(); onUpvote(p.id, e); }} style={{ background: votedIds.has(p.id) ? GREEN : "#f0f7f0", color: votedIds.has(p.id) ? "#fff" : GREEN, border: `1px solid ${votedIds.has(p.id) ? GREEN : "#c8dfc8"}`, borderRadius: 5, padding: "0.22rem 0.55rem", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>▲ {p.upvotes}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── LEADERBOARD ──
function Leaderboard({ t }) {
  const [leaders, setLeaders] = useState([]);
  const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
  useEffect(() => {
    supabase.rpc("get_monthly_leaderboard").then(({ data }) => { if (data) setLeaders(data); });
  }, []);
  return (
    <div style={{ background: "#fff", border: "1px solid #dceadc", borderRadius: 12, padding: "1rem" }}>
      <div style={sideTitle()}>{t.sidebar.leaderboard}</div>
      <div style={{ fontSize: "0.7rem", color: "#bbb", marginBottom: "0.85rem" }}>{t.sidebar.leaderboardSub}</div>
      {leaders.length === 0 ? <p style={{ fontSize: "0.78rem", color: "#ccc", textAlign: "center", padding: "0.75rem 0" }}>No data yet</p> : leaders.map((l, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.55rem 0.5rem", borderRadius: 8, background: i === 0 ? "linear-gradient(90deg, rgba(255,215,0,0.1), transparent)" : "transparent", marginBottom: "0.25rem" }}>
          <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{medals[i]}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0d3a1e", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              {l.name}{l.is_verified && <span style={{ fontSize: "0.6rem", background: GREEN, color: "#fff", padding: "0.05rem 0.35rem", borderRadius: 100 }}>✓</span>}
            </div>
            <div style={{ fontSize: "0.69rem", color: "#9a9a9a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.company || l.country || ""}</div>
          </div>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: GREEN, flexShrink: 0 }}>▲ {l.upvotes_received}</div>
        </div>
      ))}
      {leaders[0] && <div style={{ marginTop: "0.6rem", background: "linear-gradient(135deg, #fef3c7, #fde68a)", borderRadius: 8, padding: "0.5rem 0.7rem", fontSize: "0.73rem", color: "#92400e", fontWeight: 600, textAlign: "center" }}>👑 Top Contributor: {leaders[0].name}</div>}
    </div>
  );
}

// ── REVIEWS ──
function ReviewSection({ t, problemId, user }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    supabase.from("reviews").select("*").eq("problem_id", problemId).order("created_at", { ascending: false }).then(({ data }) => { if (data) setReviews(data); });
  }, [problemId]);
  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : null;
  const submit = async () => {
    if (!body.trim()) return;
    setSubmitting(true);
    await supabase.from("reviews").insert({ problem_id: problemId, user_id: user.id, author: user.user_metadata?.name || user.email, rating, body: body.trim() });
    const { data } = await supabase.from("reviews").select("*").eq("problem_id", problemId).order("created_at", { ascending: false });
    if (data) setReviews(data);
    setBody(""); setRating(5); setSubmitting(false);
  };
  return (
    <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <div style={{ fontWeight: 700, fontSize: "0.84rem", color: "#1a2e1a" }}>{t.detail.reviews}</div>
        {avgRating && <span style={{ fontSize: "0.8rem", color: "#7a9a7a" }}>{"⭐".repeat(Math.round(avgRating))} {avgRating}/5</span>}
      </div>
      {reviews.length === 0 && <p style={{ fontSize: "0.78rem", color: "#ccc", marginBottom: "0.75rem" }}>{t.detail.noReviews}</p>}
      <div style={{ maxHeight: 160, overflowY: "auto", marginBottom: "0.75rem" }}>
        {reviews.map((r, i) => (
          <div key={i} style={{ background: "#fafafa", borderRadius: 8, padding: "0.65rem 0.8rem", marginBottom: "0.5rem", border: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "0.77rem", fontWeight: 600, color: "#1a2e1a" }}>{r.author}</span>
              <span style={{ fontSize: "0.8rem" }}>{"⭐".repeat(r.rating)}</span>
            </div>
            <p style={{ fontSize: "0.79rem", color: "#7a9a7a", lineHeight: 1.5, margin: 0 }}>{r.body}</p>
          </div>
        ))}
      </div>
      {user ? (
        <div>
          <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.5rem" }}>
            {[1,2,3,4,5].map(n => <button key={n} onClick={() => setRating(n)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.3rem", filter: n <= rating ? "none" : "grayscale(1) opacity(0.3)", transition: "all 0.1s" }}>⭐</button>)}
          </div>
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder={t.detail.reviewPh} style={{ ...inpSt(), minHeight: 60, resize: "vertical", marginBottom: "0.5rem" }} />
          <button onClick={submit} disabled={submitting} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 6, padding: "0.45rem 1rem", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: "Inter,sans-serif", opacity: submitting ? 0.6 : 1 }}>
            {submitting ? "..." : t.detail.submitReview}
          </button>
        </div>
      ) : <p style={{ fontSize: "0.78rem", color: "#aaa", fontStyle: "italic" }}>{t.detail.loginReview}</p>}
    </div>
  );
}

// ── AI CHAT ──
function AIChatWidget({ t, problems }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: t.chat.welcome }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { if (open) endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    const context = problems.slice(0, 8).map(p => `Case: "${p.title}" (${p.industry}, ${p.country})\nProblem: ${p.problem}\nLesson: ${p.lesson}`).join("\n\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY || "", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 1000, system: `You are a helpful AI business advisor for MistakeMap. Here are real cases:\n\n${context}\n\nBe concise and practical. Respond in the user's language.`, messages: messages.concat({ role: "user", content: userMsg }) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content?.[0]?.text || "Sorry, try again." }]);
    } catch { setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]); }
    setLoading(false);
  };

  return (
    <>
      <button onClick={() => setOpen(o => !o)} style={{ position: "fixed", bottom: "1.5rem", left: "1.5rem", width: 52, height: 52, borderRadius: "50%", background: open ? "#444" : "linear-gradient(135deg, #1a5c30, #22743c)", color: "#fff", border: "none", cursor: "pointer", fontSize: "1.4rem", zIndex: 300, boxShadow: "0 4px 20px rgba(26,92,48,0.35)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>{open ? "✕" : "🤖"}</button>
      {open && (
        <div style={{ position: "fixed", bottom: "5rem", left: "1.5rem", width: "min(360px, calc(100vw - 3rem))", height: 440, background: "#fff", borderRadius: 16, border: "1px solid #dceadc", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 300, animation: "chatSlide 0.25s ease" }}>
          <div style={{ background: "linear-gradient(135deg, #1a5c30, #22743c)", padding: "0.85rem 1rem", flexShrink: 0 }}>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>🤖 {t.chat.title}</div>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.65)", marginTop: "0.15rem" }}>Powered by Claude AI</div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "0.85rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "82%", padding: "0.55rem 0.85rem", borderRadius: m.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px", background: m.role === "user" ? GREEN : "#f0f7f0", color: m.role === "user" ? "#fff" : "#1a2e1a", fontSize: "0.81rem", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{m.content}</div>
              </div>
            ))}
            {loading && <div style={{ display: "flex", justifyContent: "flex-start" }}><div style={{ padding: "0.55rem 0.85rem", borderRadius: "12px 12px 12px 3px", background: "#f0f7f0", fontSize: "0.81rem", color: "#aaa", animation: "pulse 1.2s infinite" }}>{t.chat.thinking}</div></div>}
            <div ref={endRef} />
          </div>
          <div style={{ padding: "0.6rem", borderTop: "1px solid #f0f0f0", display: "flex", gap: "0.4rem" }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()} placeholder={t.chat.placeholder} style={{ ...inpSt({ fontSize: "0.8rem" }), flex: 1 }} />
            <button onClick={send} disabled={loading} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 7, padding: "0.5rem 0.85rem", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", fontFamily: "Inter,sans-serif", opacity: loading ? 0.6 : 1 }}>{t.chat.send}</button>
          </div>
        </div>
      )}
    </>
  );
}

// ── IDEA VALIDATOR PAGE ──
function IdeaValidatorPage({ t }) {
  const vt = t.validator;
  const industries = t.form.industries;
  const [step, setStep] = useState(0); // 0=form, 1-5=analysis steps, 6=results
  const [form, setForm] = useState({ idea: "", industry: "", price: "", budget: "" });
  const [results, setResults] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const setF = (k, v) => setForm(x => ({ ...x, [k]: v }));

  const STEP_PROMPTS = [
    (f) => `Analyse market demand for this business idea in Uzbekistan: "${f.idea}" (${f.industry} sector). Cover: current market size, growth trends, consumer behaviour, and whether there is genuine demand. Be specific to Uzbekistan. Keep it to 4-5 concise bullet points.`,
    (f) => `For the business idea "${f.idea}" in Uzbekistan, identify 3 specific target customer segments. For each segment include: age range, income level, location (which cities/regions of Uzbekistan), and why they need this product/service. Be very specific to Uzbekistan demographics.`,
    (f) => `List the main competitors for "${f.idea}" currently operating in Uzbekistan. Include local and international players. For each competitor mention their name, strengths, and one weakness. If no direct competitors exist, mention indirect ones. Keep it brief - 4 points max.`,
    (f) => `Assess affordability for "${f.idea}" priced at $${f.price || "unknown"} in Uzbekistan. Consider: average salary in Uzbekistan (~$300-500/month), purchasing power, price sensitivity, and whether the target market can afford this. Give a clear affordability verdict.`,
    (f) => `Give a final Go/No-Go verdict for this business idea in Uzbekistan: "${f.idea}" (${f.industry}, price: $${f.price || "unknown"}, budget: $${f.budget || "unknown"}). Output ONLY a JSON object like this: {"score": 72, "verdict": "GO", "reason": "one sentence reason", "risks": ["risk 1", "risk 2", "risk 3"], "nextSteps": ["step 1", "step 2", "step 3"]}. verdict must be GO, CAUTION, or NOGO.`,
  ];

  const callAI = async (prompt) => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY || "", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 600, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "Analysis unavailable.";
  };

  const runAnalysis = async () => {
    if (!form.idea || !form.industry) return;
    setStep(1);
    setResults([]);
    setLoading(true);
    const stepResults = [];
    for (let i = 0; i < 5; i++) {
      setStep(i + 1);
      setCurrentText("");
      try {
        const text = await callAI(STEP_PROMPTS[i](form));
        if (i === 4) {
          // Parse final verdict JSON
          try {
            const clean = text.replace(/```json|```/g, "").trim();
            const parsed = JSON.parse(clean);
            setScore(parsed);
            stepResults.push({ title: vt.steps[i], content: parsed.reason, isVerdict: true });
          } catch {
            stepResults.push({ title: vt.steps[i], content: text });
          }
        } else {
          stepResults.push({ title: vt.steps[i], content: text });
        }
        setResults([...stepResults]);
      } catch {
        stepResults.push({ title: vt.steps[i], content: "Analysis failed. Please check your API key." });
        setResults([...stepResults]);
      }
    }
    setLoading(false);
    setStep(6);
  };

  const verdictColor = v => v === "GO" ? "#16a34a" : v === "CAUTION" ? "#d97706" : "#dc2626";
  const verdictLabel = v => v === "GO" ? vt.goVerdict : v === "CAUTION" ? vt.cautionVerdict : vt.nogoVerdict;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: DARK, marginBottom: "0.5rem" }}>{vt.title}</h1>
        <p style={{ color: "#7a9a7a", fontSize: "0.9rem" }}>{vt.sub}</p>
      </div>

      {/* Progress Steps */}
      {step > 0 && step <= 5 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {vt.steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: i < step ? GREEN : i === step - 1 ? "#22743c" : "#e8f5eb", color: i < step ? "#fff" : i === step - 1 ? "#fff" : "#aaa", fontSize: "0.72rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
                {i < step - 1 ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: "0.72rem", color: i === step - 1 ? DARK : "#aaa", fontWeight: i === step - 1 ? 600 : 400 }}>{s}</span>
              {i < vt.steps.length - 1 && <span style={{ color: "#ddd", fontSize: "0.8rem" }}>›</span>}
            </div>
          ))}
        </div>
      )}

      {/* Step 0: Input Form */}
      {step === 0 && (
        <div style={{ background: "#fff", border: "1px solid #dceadc", borderRadius: 16, padding: "2rem", maxWidth: 560, margin: "0 auto", animation: "fadeUp 0.4s ease" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: DARK, marginBottom: "1.25rem" }}>{vt.step1Title}</h2>
          <FG label={vt.ideaLabel}><textarea value={form.idea} onChange={e => setF("idea", e.target.value)} placeholder={vt.ideaPh} style={{ ...inpSt(), minHeight: 80, resize: "vertical" }} /></FG>
          <FG label={vt.industryLabel}>
            <select value={form.industry} onChange={e => setF("industry", e.target.value)} style={selSt()}>
              <option value="">{t.form.selectInd}</option>
              {industries.map(i => <option key={i}>{i}</option>)}
            </select>
          </FG>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <FG label={vt.priceLabel}><input value={form.price} onChange={e => setF("price", e.target.value)} type="number" style={inpSt()} placeholder={vt.pricePh} /></FG>
            <FG label={vt.budgetLabel}><input value={form.budget} onChange={e => setF("budget", e.target.value)} type="number" style={inpSt()} placeholder={vt.budgetPh} /></FG>
          </div>
          <button onClick={runAnalysis} disabled={!form.idea || !form.industry}
            style={{ width: "100%", background: form.idea && form.industry ? `linear-gradient(135deg, ${GREEN}, #22743c)` : "#e8f5eb", color: form.idea && form.industry ? "#fff" : "#aaa", border: "none", borderRadius: 9, padding: "0.85rem", fontWeight: 700, fontSize: "0.95rem", cursor: form.idea && form.industry ? "pointer" : "not-allowed", fontFamily: "Inter,sans-serif", marginTop: "0.5rem", transition: "all 0.2s" }}>
            {vt.analyseBtn}
          </button>
        </div>
      )}

      {/* Steps 1-5: Loading / Results */}
      {step >= 1 && step <= 5 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {results.map((r, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #dceadc", borderRadius: 12, padding: "1.25rem", animation: "stepIn 0.4s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: GREEN, color: "#fff", fontSize: "0.65rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
                <span style={{ fontWeight: 700, fontSize: "0.88rem", color: DARK }}>{r.title}</span>
              </div>
              <p style={{ fontSize: "0.83rem", color: "#5a7a5a", lineHeight: 1.65, whiteSpace: "pre-wrap", margin: 0 }}>{r.content}</p>
            </div>
          ))}
          {loading && (
            <div style={{ background: "#fff", border: "1px solid #dceadc", borderRadius: 12, padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #e8f5eb, #b8d8bc)", backgroundSize: "200% 200%", animation: "shimmer 1.5s infinite" }} />
                <span style={{ fontSize: "0.88rem", color: "#aaa", animation: "pulse 1.2s infinite" }}>{vt.steps[step - 1]} — {vt.analysing}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 6: Final Results */}
      {step === 6 && score && (
        <div style={{ animation: "fadeUp 0.5s ease" }}>
          {/* Score Card */}
          <div style={{ background: `linear-gradient(135deg, ${verdictColor(score.verdict)}15, ${verdictColor(score.verdict)}05)`, border: `2px solid ${verdictColor(score.verdict)}40`, borderRadius: 16, padding: "2rem", textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: verdictColor(score.verdict), marginBottom: "0.75rem" }}>{vt.scoreLabel}</div>
            <div style={{ fontSize: "4rem", fontWeight: 900, color: verdictColor(score.verdict), lineHeight: 1, marginBottom: "0.5rem" }}>{score.score}</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: verdictColor(score.verdict), marginBottom: "0.75rem" }}>{verdictLabel(score.verdict)}</div>
            <p style={{ fontSize: "0.88rem", color: "#5a7a5a", maxWidth: 400, margin: "0 auto" }}>{score.reason}</p>
          </div>

          {/* Risks + Next Steps */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ background: "#fff9f9", border: "1px solid #fca5a5", borderRadius: 12, padding: "1.25rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#7f1d1d", marginBottom: "0.75rem" }}>⚠️ Key Risks</div>
              {score.risks?.map((r, i) => <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", fontSize: "0.81rem", color: "#5a3a3a" }}><span style={{ color: "#ef4444", flexShrink: 0 }}>•</span>{r}</div>)}
            </div>
            <div style={{ background: "#f0fdf4", border: "1px solid #a8e6bc", borderRadius: 12, padding: "1.25rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#14532d", marginBottom: "0.75rem" }}>✅ Next Steps</div>
              {score.nextSteps?.map((s, i) => <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", fontSize: "0.81rem", color: "#3a5a3a" }}><span style={{ color: GREEN, flexShrink: 0 }}>{i + 1}.</span>{s}</div>)}
            </div>
          </div>

          {/* Analysis steps summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {results.slice(0, 4).map((r, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #dceadc", borderRadius: 12, padding: "1rem" }}>
                <div style={{ fontWeight: 700, fontSize: "0.82rem", color: DARK, marginBottom: "0.5rem" }}>
                  <span style={{ display: "inline-block", background: GREEN, color: "#fff", width: 20, height: 20, borderRadius: "50%", textAlign: "center", lineHeight: "20px", fontSize: "0.65rem", marginRight: "0.5rem" }}>{i + 1}</span>
                  {r.title}
                </div>
                <p style={{ fontSize: "0.8rem", color: "#7a9a7a", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{r.content}</p>
              </div>
            ))}
          </div>

          <button onClick={() => { setStep(0); setResults([]); setScore(null); setForm({ idea: "", industry: "", price: "", budget: "" }); }}
            style={{ background: "#f0f7f0", color: GREEN, border: "1px solid #c8dfc8", borderRadius: 8, padding: "0.65rem 1.5rem", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>
            {vt.restart}
          </button>
        </div>
      )}
    </div>
  );
}

// ── AUTH MODAL ──
function AuthModal({ t, onClose, onSuccess }) {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ email: "", password: "", name: "", company: "", country: "United Kingdom" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setF(x => ({ ...x, [k]: v }));
  const submit = async () => {
    setErr(""); setLoading(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
      if (error) { setErr(error.message); setLoading(false); return; }
      onSuccess("login");
    } else {
      if (!f.name) { setErr("Name is required."); setLoading(false); return; }
      const { data, error } = await supabase.auth.signUp({ email: f.email, password: f.password, options: { data: { name: f.name } } });
      if (error) { setErr(error.message); setLoading(false); return; }
      if (data.user) await supabase.from("profiles").upsert({ id: data.user.id, name: f.name, company: f.company, country: f.country, is_verified: false });
      onSuccess("register");
    }
    setLoading(false);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,58,30,0.45)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 400, border: "1px solid #dceadc", animation: "slideUp 0.2s ease" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: DARK }}>{mode === "login" ? t.auth.loginTitle : t.auth.regTitle}</h2>
          <button onClick={onClose} style={xBt()}>✕</button>
        </div>
        {mode === "register" && (<>
          <FG label={t.auth.name}><input value={f.name} onChange={e => set("name", e.target.value)} style={inpSt()} placeholder="Your full name" /></FG>
          <FG label={t.auth.company}><input value={f.company} onChange={e => set("company", e.target.value)} style={inpSt()} placeholder="Optional" /></FG>
          <FG label={t.auth.country}><select value={f.country} onChange={e => set("country", e.target.value)} style={selSt()}><option>United Kingdom</option><option>Uzbekistan</option></select></FG>
        </>)}
        <FG label={t.auth.email}><input value={f.email} onChange={e => set("email", e.target.value)} type="email" style={inpSt()} placeholder="you@example.com" /></FG>
        <FG label={t.auth.password}><input value={f.password} onChange={e => set("password", e.target.value)} type="password" style={inpSt()} placeholder="••••••••" /></FG>
        {err && <p style={{ fontSize: "0.78rem", color: "#ef4444", marginBottom: "0.75rem" }}>{err}</p>}
        {mode === "register" && <p style={{ fontSize: "0.74rem", color: "#aaa", marginBottom: "0.75rem" }}>{t.auth.verifyNote}</p>}
        <button onClick={submit} disabled={loading} style={{ width: "100%", background: GREEN, color: "#fff", border: "none", borderRadius: 7, padding: "0.7rem", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "Inter,sans-serif", opacity: loading ? 0.7 : 1 }}>
          {loading ? "..." : mode === "login" ? t.auth.loginBtn : t.auth.regBtn}
        </button>
        <button onClick={() => { setMode(m => m === "login" ? "register" : "login"); setErr(""); }} style={{ background: "none", border: "none", color: GREEN, fontSize: "0.79rem", cursor: "pointer", marginTop: "1rem", width: "100%", fontFamily: "Inter,sans-serif" }}>
          {mode === "login" ? t.auth.switchToReg : t.auth.switchToLogin}
        </button>
      </div>
    </div>
  );
}

// ── COMMENT INPUT ──
function CommentInput({ t, onPost }) {
  const [val, setVal] = useState("");
  const post = () => { if (val.trim()) { onPost(val.trim()); setVal(""); } };
  return (
    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
      <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === "Enter" && post()} placeholder={t.detail.commentPh} style={inpSt({ flex: 1, fontSize: "0.82rem" })} />
      <button onClick={post} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 6, padding: "0.5rem 0.85rem", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>{t.detail.post}</button>
    </div>
  );
}

// ── SUBMIT MODAL ──
function SubmitModal({ t, onClose, onSubmit, showToast }) {
  const [f, setF] = useState({ industry: "", country: "", title: "", problem: "", lesson: "", severity: "high", name: "", loss_amount: "", imageFile: null });
  const [preview, setPreview] = useState(null);
  const set = (k, v) => setF(x => ({ ...x, [k]: v }));
  const submit = () => {
    if (!f.industry || !f.country || !f.title || !f.problem || !f.lesson) { showToast(t.toast.fill); return; }
    onSubmit(f);
  };
  const handleImage = e => {
    const file = e.target.files[0]; if (!file) return;
    set("imageFile", file);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,58,30,0.45)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 14, padding: "1.75rem", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", border: "1px solid #dceadc" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
          <div><h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0d3a1e" }}>{t.form.title}</h2><p style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "0.2rem" }}>{t.form.sub}</p></div>
          <button onClick={onClose} style={xBt()}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          <FG label={t.form.industry}><select value={f.industry} onChange={e => set("industry", e.target.value)} style={selSt()}><option value="">{t.form.selectInd}</option>{t.form.industries.map(i => <option key={i}>{i}</option>)}</select></FG>
          <FG label={t.form.country}><select value={f.country} onChange={e => set("country", e.target.value)} style={selSt()}><option value="">{t.form.selectCou}</option><option>United Kingdom</option><option>Uzbekistan</option></select></FG>
        </div>
        <FG label={t.form.ptitle}><input value={f.title} onChange={e => set("title", e.target.value)} style={inpSt()} placeholder="e.g. Hired too fast before getting a second client" /></FG>
        <FG label={t.form.problem}><textarea value={f.problem} onChange={e => set("problem", e.target.value)} style={{ ...inpSt(), minHeight: 80, resize: "vertical" }} /></FG>
        <FG label={t.form.lesson}><textarea value={f.lesson} onChange={e => set("lesson", e.target.value)} style={{ ...inpSt(), minHeight: 70, resize: "vertical" }} /></FG>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          <FG label={t.form.impact}><select value={f.severity} onChange={e => set("severity", e.target.value)} style={selSt()}><option value="high">{t.form.high}</option><option value="medium">{t.form.medium}</option><option value="low">{t.form.low}</option></select></FG>
          <FG label={t.form.loss}><input value={f.loss_amount} onChange={e => set("loss_amount", e.target.value)} type="number" style={inpSt()} placeholder={t.form.lossph} /></FG>
        </div>
        <FG label={t.form.name}><input value={f.name} onChange={e => set("name", e.target.value)} style={inpSt()} placeholder={t.form.namePh} /></FG>
        <FG label={t.form.image}>
          <input type="file" accept="image/*" onChange={handleImage} style={{ fontSize: "0.82rem", color: "#5a7a5a" }} />
          {preview && <img src={preview} alt="preview" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 7, marginTop: "0.4rem", border: "1px solid #dceadc" }} />}
        </FG>
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0d3a1e" }}>{t.blog.write}</h2>
          <button onClick={onClose} style={xBt()}>✕</button>
        </div>
        <FG label={t.blog.postTitle}><input value={f.title} onChange={e => set("title", e.target.value)} style={inpSt()} placeholder="Your post title" /></FG>
        <FG label={t.blog.postBody}><textarea value={f.body} onChange={e => set("body", e.target.value)} style={{ ...inpSt(), minHeight: 140, resize: "vertical" }} /></FG>
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
  const send = () => {
    if (!f.name || !f.email || !f.message) { showToast(t.toast.fill); return; }
    setF({ name: "", email: "", country: "", message: "" });
    showToast(t.toast.contact);
  };
  return (
    <div style={{ background: "#f8faf8", border: "1px solid #dceadc", borderRadius: 12, padding: "1.5rem" }}>
      <h3 style={{ fontWeight: 700, fontSize: "0.97rem", color: "#0d3a1e", marginBottom: "0.25rem" }}>{t.contact.formTitle}</h3>
      <p style={{ fontSize: "0.79rem", color: "#aaa", marginBottom: "1.25rem" }}>{t.contact.formSub}</p>
      <FG label={t.contact.nameL}><input value={f.name} onChange={e => set("name", e.target.value)} style={inpSt()} placeholder="Your name" /></FG>
      <FG label={t.contact.emailL}><input value={f.email} onChange={e => set("email", e.target.value)} type="email" style={inpSt()} placeholder="your@email.com" /></FG>
      <FG label={t.contact.countryL}><select value={f.country} onChange={e => set("country", e.target.value)} style={selSt()}><option value="">Select country</option><option>United Kingdom</option><option>Uzbekistan</option></select></FG>
      <FG label={t.contact.msgL}><textarea value={f.message} onChange={e => set("message", e.target.value)} style={{ ...inpSt(), minHeight: 90, resize: "vertical" }} /></FG>
      <button onClick={send} style={{ width: "100%", background: GREEN, color: "#fff", border: "none", borderRadius: 6, padding: "0.65rem", fontFamily: "Inter,sans-serif", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", marginTop: "0.25rem" }}>{t.contact.send}</button>
    </div>
  );
}

// ── MAIN APP ──
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
  const [showAuth, setShowAuth] = useState(false);
  const [detId, setDetId] = useState(null);
  const [detBlogId, setDetBlogId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const toastTimer = useRef(null);
  const t = T[lang];

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

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
    supabase.channel("rt-problems")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "problems" }, p => setProblems(prev => [p.new, ...prev]))
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "problems" }, p => setProblems(prev => prev.map(x => x.id === p.new.id ? p.new : x)))
      .subscribe();
    supabase.channel("rt-blogs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "blogs" }, p => setBlogs(prev => [p.new, ...prev]))
      .subscribe();
    supabase.channel("rt-comments")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "comments" }, p => {
        const c = p.new;
        setComments(prev => ({ ...prev, [c.problem_id]: [...(prev[c.problem_id] || []), c] }));
      }).subscribe();
  }

  async function upvote(id, e) {
    if (e) e.stopPropagation();
    const alreadyVoted = votedIds.has(id);
    setProblems(prev => prev.map(p => p.id === id ? { ...p, upvotes: p.upvotes + (alreadyVoted ? -1 : 1) } : p));
    setVotedIds(prev => { const n = new Set(prev); alreadyVoted ? n.delete(id) : n.add(id); return n; });
    if (alreadyVoted) {
      await supabase.from("upvotes").delete().match({ problem_id: id, session_id: SESSION_ID });
      await supabase.rpc("decrement_upvotes", { row_id: id });
    } else {
      await supabase.from("upvotes").insert({ problem_id: id, session_id: SESSION_ID });
      await supabase.rpc("increment_upvotes", { row_id: id });
    }
  }

  async function submitProblem(form) {
    let image_url = null;
    if (form.imageFile) {
      const ext = form.imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { data: uploadData } = await supabase.storage.from("problem-images").upload(fileName, form.imageFile, { cacheControl: "3600", upsert: false });
      if (uploadData) {
        const { data: urlData } = supabase.storage.from("problem-images").getPublicUrl(fileName);
        image_url = urlData.publicUrl;
      }
    }
    const { error } = await supabase.from("problems").insert({
      title: form.title, industry: form.industry, country: form.country,
      problem: form.problem, lesson: form.lesson, severity: form.severity,
      name: form.name || user?.user_metadata?.name || "Anonymous",
      upvotes: 0, loss_amount: form.loss_amount ? Number(form.loss_amount) : null,
      image_url, user_id: user?.id || null,
    });
    if (error) { showToastMsg("Error submitting. Please try again."); return; }
    setShowForm(false);
    showToastMsg(t.toast.published);
  }

  async function submitComment(text) {
    if (!detId || !text.trim()) return;
    await supabase.from("comments").insert({ problem_id: detId, author: user?.user_metadata?.name || "Anonymous", body: text.trim() });
    showToastMsg(t.toast.comment);
  }

  async function submitBlog(form) {
    const { error } = await supabase.from("blogs").insert({ title: form.title, body: form.body, tag: form.tag, author: form.author || "Anonymous", country: form.country });
    if (error) { showToastMsg("Error submitting."); return; }
    setShowBlogForm(false);
    showToastMsg(t.toast.blogPublished);
  }

  function showToastMsg(msg) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  const totalUpvotes = problems.reduce((a, p) => a + (p.upvotes || 0), 0);
  const isVerified = user?.email_confirmed_at != null;

  const filtered = problems.filter(p => {
    if (curCountry && p.country !== curCountry) return false;
    if (curIndustry && p.industry !== curIndustry) return false;
    if (sev && p.severity !== sev) return false;
    if (q && !(p.title + p.problem + p.lesson).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }).sort((a, b) => sort === "up" ? b.upvotes - a.upvotes : sort === "com" ? (comments[b.id]?.length || 0) - (comments[a.id]?.length || 0) : new Date(b.created_at) - new Date(a.created_at));

  const indCounts = (() => {
    const src = curCountry ? problems.filter(p => p.country === curCountry) : problems;
    const c = {};
    src.forEach(p => { c[p.industry] = (c[p.industry] || 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  })();

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

      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #dceadc", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, position: "sticky", top: 0, zIndex: 100, flexWrap: "wrap", gap: "0.5rem" }}>
        <div onClick={() => setPage("home")} style={{ fontWeight: 700, fontSize: "1rem", color: GREEN, cursor: "pointer" }}>
          🗺 MistakeMap <span style={{ color: "#aaa", fontWeight: 400, fontSize: "0.8rem" }}>· UK & Uzbekistan</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {[["home", t.nav.browse], ["blog", t.nav.blog], ["validate", t.nav.validate], ["contact", t.nav.contact]].map(([p, label]) => (
            <button key={p} onClick={() => setPage(p)} style={{ background: page === p ? "#e8f5eb" : "transparent", color: page === p ? GREEN : "#7a9a7a", border: "none", padding: "0.4rem 0.7rem", borderRadius: 6, fontFamily: "Inter,sans-serif", fontSize: "0.82rem", fontWeight: 500, cursor: "pointer" }}>{label}</button>
          ))}
          <div style={{ display: "flex", background: "#f0f7f0", borderRadius: 6, overflow: "hidden", border: "1px solid #c8dfc8" }}>
            {["en", "uz"].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ background: lang === l ? GREEN : "transparent", color: lang === l ? "#fff" : "#7a9a7a", border: "none", padding: "0.35rem 0.65rem", fontFamily: "Inter,sans-serif", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>{l === "en" ? "🇬🇧 EN" : "🇺🇿 UZ"}</button>
            ))}
          </div>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.78rem", color: DARK, fontWeight: 600 }}>{user.user_metadata?.name || user.email}</span>
              {isVerified
                ? <span style={{ fontSize: "0.65rem", background: GREEN, color: "#fff", padding: "0.08rem 0.4rem", borderRadius: 100 }}>{t.auth.verified}</span>
                : <span style={{ fontSize: "0.65rem", background: "#fff3cd", color: "#92400e", border: "1px solid #fde68a", padding: "0.08rem 0.4rem", borderRadius: 100 }}>{t.auth.notVerified}</span>
              }
              <button onClick={async () => { await supabase.auth.signOut(); showToastMsg(t.toast.loggedOut); }} style={{ background: "#f8f8f8", color: "#7a9a7a", border: "1px solid #ddd", borderRadius: 6, padding: "0.35rem 0.65rem", fontFamily: "Inter,sans-serif", fontSize: "0.78rem", cursor: "pointer" }}>{t.nav.logout}</button>
            </div>
          ) : (
            <button onClick={() => setShowAuth(true)} style={{ background: "#f0f7f0", color: GREEN, border: "1px solid #c8dfc8", borderRadius: 6, padding: "0.35rem 0.7rem", fontFamily: "Inter,sans-serif", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>{t.nav.login}</button>
          )}
          <button onClick={() => setShowForm(true)} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 6, padding: "0.45rem 0.9rem", fontFamily: "Inter,sans-serif", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}>{t.nav.share}</button>
        </div>
      </nav>

      {/* STATS BAR */}
      <div style={{ background: GREEN, padding: "0.45rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", fontWeight: 600 }}>{t.stats.live}</span>
        {[[problems.length, t.stats.problems], [totalUpvotes, t.stats.upvotes], [2, t.stats.countries]].map(([val, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#fff" }}>{val}</span>
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* HOME PAGE */}
      {page === "home" && <>
        <div style={{ background: "linear-gradient(135deg,#1a5c30,#0d3a1e)", padding: "3rem 1.5rem 2.5rem", textAlign: "center" }}>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "0.77rem", padding: "0.28rem 0.8rem", borderRadius: 100, marginBottom: "1rem" }}>{t.hero.tag}</div>
          <h1 style={{ fontSize: "clamp(1.6rem,4vw,2.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: "0.75rem" }}>
            {t.hero.h1a} <span style={{ color: "#7ffba0" }}>{t.hero.h1b}</span> {t.hero.h1c}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.91rem", maxWidth: 440, margin: "0 auto 1.5rem", lineHeight: 1.65 }}>{t.hero.sub}</p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setShowForm(true)} style={{ background: "#fff", color: GREEN, border: "none", borderRadius: 7, padding: "0.6rem 1.4rem", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>{t.hero.cta}</button>
            <button onClick={() => document.getElementById("problems-section")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.35)", borderRadius: 7, padding: "0.6rem 1.4rem", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>{t.hero.browse}</button>
          </div>
        </div>

        <StartupFailSection t={t} onCtaClick={() => document.getElementById("top-cases")?.scrollIntoView({ behavior: "smooth" })} />
        <TopCasesSection t={t} problems={problems} onOpen={setDetId} votedIds={votedIds} onUpvote={upvote} />

        <div id="problems-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem", display: "grid", gridTemplateColumns: "210px 1fr 220px", gap: "1.25rem" }}>
          {/* LEFT SIDEBAR */}
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
              {indCounts.map(([ind, cnt]) => (
                <FilterBtn key={ind} active={curIndustry === ind} onClick={() => setCurIndustry(ind)}>
                  <span style={{ flex: 1, fontSize: "0.79rem" }}>{ind}</span><Pill>{cnt}</Pill>
                </FilterBtn>
              ))}
            </div>
            <div style={{ background: "#fff", border: "1px solid #dceadc", borderRadius: 10, padding: "1rem" }}>
              <div style={sideTitle()}>{t.sidebar.chart}</div>
              {indCounts.slice(0, 5).map(([ind, cnt]) => (
                <div key={ind} style={{ marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#7a9a7a", marginBottom: "0.15rem" }}><span>{ind.split("&")[0].trim()}</span><span>{cnt}</span></div>
                  <div style={{ height: 5, background: "#e8f5eb", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.round(cnt / (indCounts[0]?.[1] || 1) * 100)}%`, background: GREEN, borderRadius: 10, transition: "width 0.6s" }} />
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* CARDS */}
          <div>
            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, position: "relative", minWidth: 160 }}>
                <span style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: "0.78rem" }}>🔍</span>
                <input value={q} onChange={e => setQ(e.target.value)} placeholder={t.filters.search} style={inpSt({ paddingLeft: "2.1rem" })} />
              </div>
              <select value={sort} onChange={e => setSort(e.target.value)} style={selSt()}>
                <option value="new">{t.filters.newest}</option>
                <option value="up">{t.filters.upvoted}</option>
                <option value="com">{t.filters.discussed}</option>
              </select>
              <select value={sev} onChange={e => setSev(e.target.value)} style={selSt()}>
                <option value="">{t.filters.allImp}</option>
                <option value="high">{t.filters.high}</option>
                <option value="medium">{t.filters.medium}</option>
                <option value="low">{t.filters.low}</option>
              </select>
            </div>
            {loading ? <Spinner /> : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>🔍</div>
                <h3 style={{ color: "#5a7a5a", marginBottom: "0.3rem", fontSize: "0.95rem" }}>{t.empty.title}</h3>
                <p style={{ fontSize: "0.82rem" }}>{t.empty.sub}</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {filtered.map(p => (
                  <div key={p.id} onClick={() => setDetId(p.id)}
                    style={{ background: "#fff", border: "1px solid #dceadc", borderLeft: "3px solid transparent", borderRadius: 10, padding: "1.1rem 1.25rem", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.borderLeftColor = GREEN; e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,92,48,0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#dceadc"; e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
                    <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.55rem" }}>
                      <span style={tagSt("ind")}>{p.industry}</span>
                      <span style={tagSt(ctryTag(p.country))}>{ctryLabel(p.country)}</span>
                      <span style={tagSt(impType(p.severity))}>{impLabel(p.severity)}</span>
                      {p.loss_amount && p.loss_amount >= 100000 && <span style={{ fontSize: "0.67rem", fontWeight: 700, padding: "0.18rem 0.55rem", borderRadius: 100, background: "#fde8e8", color: "#b91c1c", border: "1px solid #f8c8c8" }}>💸 ${(p.loss_amount/1000).toFixed(0)}k</span>}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0d3a1e", marginBottom: "0.3rem", lineHeight: 1.35 }}>{p.title}</div>
                    <div style={{ fontSize: "0.82rem", color: "#7a9a7a", lineHeight: 1.55, marginBottom: "0.7rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.problem}</div>
                    {p.image_url && <img src={p.image_url} alt={p.title} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 6, marginBottom: "0.7rem" }} />}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: "0.8rem", fontSize: "0.73rem", color: "#aaa" }}>
                        <span>👤 {p.name}</span><span>📅 {fmtDate(p.created_at)}</span>
                      </div>
                      <button onClick={e => upvote(p.id, e)} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: votedIds.has(p.id) ? GREEN : "#f0f7f0", color: votedIds.has(p.id) ? "#fff" : GREEN, border: `1px solid ${votedIds.has(p.id) ? GREEN : "#c8dfc8"}`, borderRadius: 5, padding: "0.28rem 0.65rem", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>▲ {p.upvotes}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside><Leaderboard t={t} /></aside>
        </div>
      </>}

      {/* BLOG PAGE — redesigned with sidebar */}
      {page === "blog" && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem", display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.5rem", alignItems: "start" }}>
          {/* LEFT AD SIDEBAR */}
          <aside style={{ position: "sticky", top: 70 }}>
            <ItParkAd t={t} />
            <CompetitionsWidget t={t} />
          </aside>

          {/* BLOG MAIN */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0d3a1e", marginBottom: "0.25rem" }}>{t.blog.title}</h1>
                <p style={{ color: "#7a9a7a", fontSize: "0.86rem" }}>{t.blog.sub}</p>
              </div>
              <button onClick={() => setShowBlogForm(true)} style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 7, padding: "0.55rem 1.1rem", fontWeight: 600, fontSize: "0.84rem", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>{t.blog.write}</button>
            </div>
            {loading ? <Spinner /> : blogs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>📝</div>
                <h3 style={{ color: "#5a7a5a", fontSize: "0.95rem", marginBottom: "0.3rem" }}>{t.blog.noPost}</h3>
                <p style={{ fontSize: "0.82rem" }}>{t.blog.noPostSub}</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {blogs.map(b => (
                  <div key={b.id} onClick={() => setDetBlogId(b.id)}
                    style={{ background: "#fff", border: "1px solid #dceadc", borderRadius: 10, padding: "1.4rem", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,92,48,0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#dceadc"; e.currentTarget.style.boxShadow = "none"; }}>
                    <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.55rem" }}>
                      <span style={tagSt("ind")}>{b.tag}</span>
                      <span style={tagSt(ctryTag(b.country))}>{ctryLabel(b.country)}</span>
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: "0.97rem", color: "#0d3a1e", marginBottom: "0.35rem", lineHeight: 1.3 }}>{b.title}</h3>
                    <p style={{ fontSize: "0.83rem", color: "#7a9a7a", lineHeight: 1.6, marginBottom: "0.8rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{b.body}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.74rem", color: "#aaa" }}>✍️ {b.author} · {fmtDate(b.created_at)}</span>
                      <span style={{ fontSize: "0.77rem", color: GREEN, fontWeight: 600 }}>{t.blog.readMore}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VALIDATE PAGE */}
      {page === "validate" && <IdeaValidatorPage t={t} />}

      {/* CONTACT PAGE */}
      {page === "contact" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0d3a1e", marginBottom: "0.6rem" }}>{t.contact.title}</h2>
            <p style={{ fontSize: "0.86rem", color: "#7a9a7a", lineHeight: 1.65, marginBottom: "1.5rem" }}>{t.contact.sub}</p>
            {[["📧", t.contact.email, t.contact.emailV], ["⏱️", t.contact.resp, t.contact.respV], ["🌍", t.contact.serving, t.contact.servingV]].map(([icon, label, val]) => (
              <div key={label} style={{ display: "flex", gap: "0.65rem", marginBottom: "0.85rem", alignItems: "center" }}>
                <div style={{ width: 34, height: 34, background: "#e8f5eb", border: "1px solid #b8d8bc", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>{icon}</div>
                <div><strong style={{ display: "block", fontSize: "0.79rem", color: "#1a2e1a" }}>{label}</strong><span style={{ fontSize: "0.79rem", color: "#7a9a7a" }}>{val}</span></div>
              </div>
            ))}
          </div>
          <ContactForm t={t} showToast={showToastMsg} />
        </div>
      )}

      {/* PROBLEM DETAIL MODAL */}
      {det && (
        <Overlay onClick={() => setDetId(null)}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "1.75rem", width: "100%", maxWidth: 600, border: "1px solid #dceadc", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                <span style={tagSt("ind")}>{det.industry}</span>
                <span style={tagSt(ctryTag(det.country))}>{ctryLabel(det.country)}</span>
                <span style={tagSt(impType(det.severity))}>{impLabel(det.severity)}</span>
              </div>
              <button onClick={() => setDetId(null)} style={xBt()}>✕</button>
            </div>
            {det.image_url && <img src={det.image_url} alt={det.title} style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 9, marginBottom: "1rem" }} />}
            {det.loss_amount && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#fde8e8", border: "1px solid #fca5a5", borderRadius: 8, padding: "0.4rem 0.85rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#b91c1c" }}>{t.detail.lossLabel}: ${det.loss_amount.toLocaleString()}</span>
              </div>
            )}
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
            {/* COMMENTS */}
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
            {/* REVIEWS */}
            {det.loss_amount && det.loss_amount >= 3000 && <ReviewSection t={t} problemId={det.id} user={user} />}
            {/* SOLUTION PROVIDERS */}
            <SolutionProviders t={t} industry={det.industry} />
          </div>
        </Overlay>
      )}

      {/* BLOG DETAIL MODAL */}
      {detBlog && (
        <Overlay onClick={() => setDetBlogId(null)}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "1.75rem", width: "100%", maxWidth: 620, border: "1px solid #dceadc", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <span style={tagSt("ind")}>{detBlog.tag}</span>
                <span style={tagSt(ctryTag(detBlog.country))}>{ctryLabel(detBlog.country)}</span>
              </div>
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
      {showAuth && <AuthModal t={t} onClose={() => setShowAuth(false)} onSuccess={type => { setShowAuth(false); showToastMsg(type === "login" ? t.toast.loginSuccess : t.toast.regSuccess); }} />}

      <AIChatWidget t={t} problems={problems.sort((a, b) => b.upvotes - a.upvotes)} />

      {toast && <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", background: GREEN, color: "#fff", padding: "0.7rem 1.1rem", borderRadius: 8, fontSize: "0.84rem", fontWeight: 500, zIndex: 999, maxWidth: 300, boxShadow: "0 4px 20px rgba(26,92,48,0.25)", animation: "slideUp 0.25s ease" }}>{toast}</div>}
    </div>
  );
}
