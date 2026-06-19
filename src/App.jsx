import { useState, useEffect, useCallback } from "react";

const GEMINI_KEY = "AIzaSyAQ.Ab8RN6JFeQ1nqDFwCNagfy8qS8cprS_ActMt7yXsfWebLBZW4A";

const HOURS = [
  "Unknown", "00:00 子時", "01:00 丑時", "03:00 寅時", "05:00 卯時",
  "07:00 辰時", "09:00 巳時", "11:00 午時", "13:00 未時",
  "15:00 申時", "17:00 酉時", "19:00 戌時", "21:00 亥時",
];

const GOODS = [
  { id: 1, name: "Ceramic Mug", emoji: "☕", price: 24, desc: "Name printed in Hangul & English" },
  { id: 2, name: "Embroidered Tote", emoji: "👜", price: 32, desc: "Hand-stitched name on cotton bag" },
  { id: 3, name: "Keychain", emoji: "🗝️", price: 12, desc: "Acrylic charm with your name" },
  { id: 4, name: "Name Stamp", emoji: "🪬", price: 18, desc: "Traditional ink stamp" },
  { id: 5, name: "Silk Pouch", emoji: "🧧", price: 28, desc: "Embroidered on silk fabric" },
  { id: 6, name: "Wall Art Print", emoji: "🖼️", price: 38, desc: "Calligraphy art print, A4" },
];

const STEPS = [
  { emoji: "🔍", kr: "얼굴 분석 중...", en: "Analyzing your face..." },
  { emoji: "☯️", kr: "사주 계산 중...", en: "Calculating your Saju..." },
  { emoji: "✍️", kr: "이름 짓는 중...", en: "Crafting your name..." },
];

const SPARKLE_POS = [
  { top: "6%",  left: "6%",   size: 18, delay: 0 },
  { top: "9%",  right: "8%",  size: 12, delay: 0.4 },
  { top: "18%", left: "15%",  size: 10, delay: 0.8 },
  { top: "22%", right: "4%",  size: 20, delay: 1.2 },
  { top: "50%", left: "2%",   size: 14, delay: 0.6 },
  { top: "65%", right: "3%",  size: 16, delay: 1.0 },
  { bottom:"12%",left: "8%",  size: 12, delay: 0.3 },
  { bottom:"8%", right:"10%", size: 18, delay: 0.9 },
];

const CSS = `
  @keyframes sparkle {
    0%   { opacity: 0.2; transform: scale(0.7) rotate(0deg); }
    50%  { opacity: 0.9; transform: scale(1.3) rotate(20deg); }
    100% { opacity: 0.2; transform: scale(0.7) rotate(0deg); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.08); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function Sparkles() {
  return (
    <>
      {SPARKLE_POS.map((p, i) => (
        <span key={i} style={{
          position: "absolute",
          color: "rgba(255,255,255,0.75)",
          fontSize: p.size,
          animation: `sparkle ${1.8 + i * 0.25}s ${p.delay}s ease-in-out infinite`,
          pointerEvents: "none",
          userSelect: "none",
          ...p,
        }}>✦</span>
      ))}
    </>
  );
}

export default function App() {
  const [step, setStep]         = useState("home");
  const [photo, setPhoto]       = useState(null);
  const [birth, setBirth]       = useState({ year: "", month: "", day: "", hour: "Unknown" });
  const [result, setResult]     = useState(null);
  const [analyzing, setAnalyzing] = useState(0);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (step !== "analyzing") return;
    const id = setInterval(() => setAnalyzing(a => a + 1), 1200);
    return () => clearInterval(id);
  }, [step]);

  const handlePhoto = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPhoto(ev.target.result); setStep("upload"); };
    reader.readAsDataURL(file);
  }, []);

  const birthValid = birth.year.length === 4 && birth.month && birth.day;

  const analyze = async () => {
    setStep("analyzing");
    setAnalyzing(0);
    setError(null);
    try {
      const base64   = photo.split(",")[1];
      const mimeType = photo.split(";")[0].split(":")[1];

      const prompt = `You are a Korean name master and Saju (사주) expert.
Analyze this person's face and birth info: year=${birth.year}, month=${birth.month}, day=${birth.day}, hour=${birth.hour}.

Return ONLY a valid JSON object — no markdown, no explanation. Use this exact structure:
{
  "korean": "한글 이름 2-3자",
  "hanja": "漢字",
  "romanization": "ROMANIZED NAME IN CAPS",
  "element": "Water",
  "elementKr": "수",
  "elementEmoji": "💧",
  "personality": "2-3문장으로 이 사람의 성격을 한국어로 설명",
  "traits": [
    { "emoji": "🌙", "en": "Intuitive", "kr": "직관적인" },
    { "emoji": "🎨", "en": "Creative",  "kr": "창의적인" },
    { "emoji": "🔥", "en": "Passionate","kr": "열정적인" }
  ],
  "luckyColor":    "Lavender",
  "luckyColorKr":  "라벤더",
  "luckyColorHex": "#c084fc",
  "luckyNumber":   7,
  "saju": {
    "yearPillar":  "甲子",
    "monthPillar": "乙丑",
    "dayPillar":   "丙寅",
    "timePillar":  "丁卯"
  },
  "dominantElement":   "목",
  "dominantElementEn": "Wood",
  "lackingElement":    "금",
  "lackingElementEn":  "Metal"
}`;

      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_KEY },
          body: JSON.stringify({
            contents: [{ parts: [
              { inlineData: { mimeType, data: base64 } },
              { text: prompt },
            ]}],
            generationConfig: { temperature: 0.85, responseMimeType: "application/json" },
          }),
        }
      );

      const data = await res.json();
      if (data.error) throw new Error(data.error.message || "API error");

      const raw  = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const json = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(json);
      setResult(parsed);
      setStep("result");
    } catch (err) {
      console.error(err);
      setError(err.message);
      setStep("upload");
    }
  };

  /* ──────────────── Shared styles ──────────────── */
  const purpleBg = {
    background: "linear-gradient(145deg, #6d28d9 0%, #7c3aed 30%, #a855f7 65%, #8b5cf6 100%)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: "24px 16px",
  };
  const btn = {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    background: "#7c3aed", color: "#fff", border: "none",
    borderRadius: 14, padding: "14px 28px",
    fontSize: 15, fontWeight: 600, cursor: "pointer",
    width: "100%", boxSizing: "border-box",
  };
  const btnGlass = {
    ...btn,
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.32)",
  };
  const btnOut = {
    ...btn,
    background: "transparent",
    color: "#7c3aed",
    border: "2px solid #7c3aed",
    marginTop: 10,
  };
  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    padding: "10px 12px",
    border: "2px solid #e5e7eb",
    borderRadius: 10, fontSize: 15,
    color: "#1a1a1a", outline: "none",
    fontFamily: "inherit",
    background: "#fff",
  };
  const labelStyle = {
    fontSize: 11, color: "#6b7280",
    marginBottom: 6, display: "block",
    fontWeight: 600, textTransform: "uppercase", letterSpacing: 1,
  };

  /* ──────────────── HOME ──────────────── */
  if (step === "home") return (
    <div style={purpleBg}>
      <style>{CSS}</style>
      <Sparkles />
      <div style={{ textAlign: "center", color: "#fff", marginBottom: 36, zIndex: 1, animation: "fadeUp 0.7s ease" }}>
        <div style={{ fontSize: 52, marginBottom: 6 }}>✨</div>
        <h1 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 6px", letterSpacing: 3 }}>K-MY NAME</h1>
        <p style={{ fontSize: 13, opacity: 0.8, letterSpacing: 1 }}>✦ Korean Name & Saju Analysis ✦</p>
        <p style={{ fontSize: 13, opacity: 0.6, marginTop: 6 }}>AI로 나만의 한국 이름을 찾아보세요</p>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: 22, padding: "28px 24px",
        width: "100%", maxWidth: 360,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        zIndex: 1, animation: "fadeUp 0.8s ease",
      }}>
        <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, marginBottom: 22, textAlign: "center" }}>
          사진을 업로드하면 AI가 얼굴과 사주를 분석해<br/>당신만의 한국 이름을 지어드립니다 🔮
        </p>
        <label style={{ ...btn, cursor: "pointer" }}>
          📸 사진 업로드 · Upload Photo
          <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
        </label>
        <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 12, textAlign: "center" }}>
          사진은 저장되거나 공유되지 않습니다 · Photos are not stored
        </p>
      </div>
    </div>
  );

  /* ──────────────── UPLOAD / BIRTH ──────────────── */
  if (step === "upload") return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#fafafa", padding: "28px 16px", boxSizing: "border-box" }}>
      <style>{CSS}</style>
      <div style={{ textAlign: "center", marginBottom: 24, animation: "fadeUp 0.6s ease" }}>
        <div style={{
          display: "inline-block", fontSize: 26, fontWeight: 900,
          background: "linear-gradient(90deg, #7c3aed, #a855f7)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: 2,
        }}>K-MY NAME</div>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>✦ 생년월일을 입력해주세요 ✦</p>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#b91c1c", fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}

      {photo && (
        <div style={{ textAlign: "center", marginBottom: 22, animation: "fadeUp 0.5s ease" }}>
          <img src={photo} alt="uploaded" style={{
            width: 110, height: 110, borderRadius: "50%",
            objectFit: "cover", objectPosition: "top",
            border: "3px solid #7c3aed",
            boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
          }} />
          <div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, cursor: "pointer", color: "#7c3aed", fontSize: 13, fontWeight: 600 }}>
              📸 Change photo
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
            </label>
          </div>
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 18, padding: "22px 18px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", animation: "fadeUp 0.7s ease" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>연도 Year</label>
            <input style={inputStyle} type="number" placeholder="예. 1995" min="1900" max="2024"
              value={birth.year} onChange={e => setBirth(p => ({ ...p, year: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>월 Mo</label>
            <input style={inputStyle} type="number" placeholder="1-12" min="1" max="12"
              value={birth.month} onChange={e => setBirth(p => ({ ...p, month: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>일 Day</label>
            <input style={inputStyle} type="number" placeholder="1-31" min="1" max="31"
              value={birth.day} onChange={e => setBirth(p => ({ ...p, day: e.target.value }))} />
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>태어난 시간 (선택) · Birth hour (optional)</label>
          <select style={inputStyle} value={birth.hour} onChange={e => setBirth(p => ({ ...p, hour: e.target.value }))}>
            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <button style={{ ...btn, opacity: birthValid ? 1 : 0.45 }} disabled={!birthValid} onClick={analyze}>
          🔮 이름 &amp; 사주 분석하기 · Analyze
        </button>
        <button style={btnOut} onClick={() => { setPhoto(null); setStep("home"); }}>
          ← 뒤로 · Back
        </button>
      </div>
    </div>
  );

  /* ──────────────── ANALYZING ──────────────── */
  if (step === "analyzing") {
    const cur = STEPS[Math.floor(analyzing / 3) % STEPS.length];
    const dot = Math.floor(analyzing / 3) % 3;
    return (
      <div style={purpleBg}>
        <style>{CSS}</style>
        <Sparkles />
        <div style={{ textAlign: "center", color: "#fff", zIndex: 1 }}>
          <div style={{ fontSize: 64, marginBottom: 20, animation: "pulse 1.4s ease-in-out infinite", display: "inline-block" }}>
            {cur.emoji}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>{cur.kr}</h2>
          <p style={{ fontSize: 14, opacity: 0.7 }}>{cur.en}</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%",
                background: i === dot ? "#fff" : "rgba(255,255,255,0.3)",
                transition: "background 0.4s",
              }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────── RESULT ──────────────── */
  if (step === "result" && result) return (
    <div style={purpleBg}>
      <style>{CSS}</style>
      <Sparkles />

      {/* Name Card */}
      <div style={{
        background: "rgba(255,255,255,0.13)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1.5px solid rgba(255,255,255,0.28)",
        borderRadius: 28,
        width: "100%", maxWidth: 360,
        overflow: "hidden",
        zIndex: 1,
        animation: "fadeUp 0.7s ease",
        boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
      }}>
        {/* YOUR KOREAN NAME header */}
        <div style={{ textAlign: "center", padding: "13px 0 6px", color: "rgba(255,255,255,0.65)", fontSize: 10, letterSpacing: 4, fontWeight: 700 }}>
          YOUR KOREAN NAME
        </div>

        {/* Photo + Name row */}
        <div style={{ display: "flex", minHeight: 210 }}>
          {/* Photo - left half, fades to right */}
          <div style={{ width: "46%", position: "relative", overflow: "hidden", flexShrink: 0 }}>
            {photo && (
              <img src={photo} alt="you" style={{
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center top",
                display: "block",
                WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.95) 40%, transparent 100%)",
                maskImage:        "linear-gradient(to right, rgba(0,0,0,0.95) 40%, transparent 100%)",
              }} />
            )}
          </div>

          {/* Name - right half */}
          <div style={{ flex: 1, padding: "20px 16px 16px 8px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
            <div style={{ fontSize: 54, fontWeight: 900, color: "#fff", lineHeight: 1, textShadow: "0 2px 12px rgba(0,0,0,0.4)", letterSpacing: -1 }}>
              {result.korean}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", letterSpacing: 4, fontWeight: 700 }}>
              {result.romanization}
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "rgba(168,85,247,0.35)",
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: 20, padding: "4px 11px",
              color: "#fff", fontSize: 11, fontWeight: 600,
              width: "fit-content",
            }}>
              ✦ {result.element} Element
            </div>
          </div>
        </div>

        {/* Personality quote */}
        <div style={{ padding: "14px 20px 10px", textAlign: "center", background: "rgba(0,0,0,0.08)" }}>
          <div style={{ color: "#fbbf24", fontSize: 30, lineHeight: 0.6, marginBottom: 8 }}>"</div>
          <p style={{ color: "#fff", fontSize: 13, lineHeight: 1.75, margin: 0 }}>{result.personality}</p>
          <div style={{ color: "#fbbf24", fontSize: 30, lineHeight: 0.6, marginTop: 8 }}>"</div>
        </div>

        {/* Traits */}
        <div style={{ padding: "14px 16px" }}>
          <div style={{ textAlign: "center", fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: 4, fontWeight: 700, marginBottom: 12 }}>TRAITS</div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {(result.traits || []).map((t, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "rgba(255,255,255,0.14)",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, margin: "0 auto 6px",
                }}>{t.emoji}</div>
                <div style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{t.en}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, marginTop: 1 }}>{t.kr}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lucky Color + Number */}
        <div style={{ display: "flex", gap: 8, padding: "10px 14px", background: "rgba(0,0,0,0.12)" }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: 2, fontWeight: 700, marginBottom: 5 }}>LUCKY COLOR</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: result.luckyColorHex || "#c084fc", border: "1.5px solid rgba(255,255,255,0.6)", flexShrink: 0 }} />
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{result.luckyColor}</span>
            </div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: 2, fontWeight: 700, marginBottom: 3 }}>LUCKY NUMBER</div>
            <div style={{ color: "#fff", fontSize: 26, fontWeight: 900, lineHeight: 1 }}>{result.luckyNumber}</div>
          </div>
        </div>

        {/* Hanja + footer */}
        <div style={{ padding: "10px 16px 6px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>漢字 · {result.hanja}</span>
        </div>
        <div style={{ textAlign: "center", padding: "8px 0 14px", color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: 4 }}>
          ✦ K-MY NAME ✦
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18, width: "100%", maxWidth: 360, zIndex: 1 }}>
        <button style={btnGlass} onClick={() => setStep("shop")}>
          🛍️ 이름 굿즈 보기 · Personalized Goods
        </button>
        <button style={btnGlass} onClick={() => { setPhoto(null); setResult(null); setBirth({ year:"", month:"", day:"", hour:"Unknown" }); setStep("home"); }}>
          🔄 다시 분석하기 · Analyze Again
        </button>
      </div>
    </div>
  );

  /* ──────────────── SHOP ──────────────── */
  if (step === "shop") return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#fafafa", padding: "24px 16px", boxSizing: "border-box" }}>
      <style>{CSS}</style>
      <div style={{ textAlign: "center", marginBottom: 22, animation: "fadeUp 0.5s ease" }}>
        <div style={{
          fontSize: 22, fontWeight: 900,
          background: "linear-gradient(90deg, #7c3aed, #a855f7)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: 2, marginBottom: 4,
        }}>
          {result?.korean} 맞춤 굿즈
        </div>
        <p style={{ fontSize: 12, color: "#9ca3af" }}>Your name, forever yours ✦</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {GOODS.map(g => (
          <div key={g.id} style={{
            background: "#fff", border: "1px solid #f0f0f0",
            borderRadius: 16, padding: "16px 12px",
            display: "flex", flexDirection: "column", gap: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            animation: "fadeUp 0.5s ease",
          }}>
            <div style={{ fontSize: 30 }}>{g.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{g.name}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.4 }}>{g.desc}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
              <span style={{ fontWeight: 800, color: "#7c3aed", fontSize: 15 }}>${g.price}</span>
              <button
                onClick={() => alert("서비스 준비중입니다 🛠️\nComing soon!")}
                style={{ background: "#7c3aed", color: "#fff", border: "none", borderRadius: 8, padding: "5px 11px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
              >담기</button>
            </div>
          </div>
        ))}
      </div>

      <button style={btnOut} onClick={() => setStep("result")}>
        ← 결과로 돌아가기 · Back to result
      </button>
    </div>
  );

  return null;
}
