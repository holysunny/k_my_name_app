import { useState, useEffect, useCallback, useRef } from "react";
import html2canvas from "html2canvas";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || "";

const HOURS = [
  "Unknown", "00:00 子時", "01:00 丑時", "03:00 寅時", "05:00 卯時",
  "07:00 辰時", "09:00 巳時", "11:00 午時", "13:00 未時",
  "15:00 申時", "17:00 酉時", "19:00 戌時", "21:00 亥時",
];

const FORM_BASE    = "https://docs.google.com/forms/d/e/1FAIpQLSdIlknrv_B0XvEKnyayGuE5tt5LA1h4p72ZaHBANvlcZYUxsw/viewform";
const FORM_NAME    = "entry.1366709707";
const FORM_PRODUCT = "entry.1513610605";
const GOODS = [
  { id:1, name:"Ceramic Mug",      emoji:"☕", price:22, desc:"Name printed in Hangul & English", formName:"Ceramic Classic Mug (11oz) - $22", paypalUrl:"https://www.paypal.com/ncp/payment/U2ET4MZXHS8NS", detailUrl:"" },
  { id:2, name:"Embroidered Tote", emoji:"👜", price:32, desc:"Hand-stitched name on cotton bag",  formName:"Embroidered Tote Bag - $32",       paypalUrl:"https://www.paypal.com/ncp/payment/RN7DDTLLT3H9G", detailUrl:"" },
  { id:3, name:"Keychain",         emoji:"🗝️", price:12, desc:"Acrylic charm with your name",      formName:"Acrylic Keychain - $12",           paypalUrl:"https://www.paypal.com/ncp/payment/AN73PNX2KYVZA", detailUrl:"" },
  { id:4, name:"Name Stamp",       emoji:"🪬", price:18, desc:"Traditional ink stamp",             formName:"Name Stamp - $18",                 paypalUrl:"https://www.paypal.com/ncp/payment/3VC6SAYJAREFG", detailUrl:"" },
  { id:5, name:"Silk Pouch",       emoji:"🧧", price:28, desc:"Embroidered on silk fabric",        formName:"Silk Pouch - $28",                 paypalUrl:"https://www.paypal.com/ncp/payment/G2JVST66ECAKY", detailUrl:"" },
  { id:6, name:"Wall Art Print",   emoji:"🖼️", price:38, desc:"Calligraphy art print, A4",        formName:"Wall Art Print (A4) - $38",        paypalUrl:"https://www.paypal.com/ncp/payment/KMH8X43QTQQN4", detailUrl:"" },
];

const STEPS = [
  { en:"Analyzing your face...",   kr:"얼굴 분석 중..."  },
  { en:"Calculating your Saju...", kr:"사주 계산 중..."  },
  { en:"Crafting your name...",    kr:"이름 짓는 중..."  },
];

const SPARKLE_POS = [
  { top:"6%",    left:"6%",    size:18, delay:0   },
  { top:"9%",    right:"8%",   size:12, delay:0.4 },
  { top:"18%",   left:"15%",   size:10, delay:0.8 },
  { top:"22%",   right:"4%",   size:20, delay:1.2 },
  { top:"50%",   left:"2%",    size:14, delay:0.6 },
  { top:"65%",   right:"3%",   size:16, delay:1.0 },
  { bottom:"12%",left:"8%",    size:12, delay:0.3 },
  { bottom:"8%", right:"10%",  size:18, delay:0.9 },
];

const CSS = `
  @keyframes sparkle {
    0%   { opacity:0.12; transform:scale(0.7) rotate(0deg);  }
    50%  { opacity:0.7;  transform:scale(1.3) rotate(20deg); }
    100% { opacity:0.12; transform:scale(0.7) rotate(0deg);  }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes pulse {
    0%,100% { transform:scale(1);    }
    50%     { transform:scale(1.08); }
  }
  img.emoji {
    height: 1em; width: 1em;
    vertical-align: -0.1em;
    display: inline-block;
  }
`;

function Sparkles() {
  return (
    <>
      {SPARKLE_POS.map((p, i) => (
        <span key={i} style={{
          position:"absolute", color:"rgba(255,255,255,0.75)", fontSize:p.size,
          animation:`sparkle ${1.8 + i*0.25}s ${p.delay}s ease-in-out infinite`,
          pointerEvents:"none", userSelect:"none", ...p,
        }}>✦︎</span>
      ))}
    </>
  );
}

/* 인앱 브라우저 타입 감지 (모듈 레벨 - 한 번만 실행) */
const _ua = navigator.userAgent || "";
const IS_IOS = /iPhone|iPad|iPod/i.test(_ua);
const IAB_TYPE = /KAKAOTALK/i.test(_ua) ? "kakao"
  : /Instagram/i.test(_ua)              ? "instagram"
  : /FBAN|FBAV/i.test(_ua)             ? "facebook"
  : /Line\//i.test(_ua)                ? "line"
  : /NAVER|NaverApp/i.test(_ua)        ? "naver"
  : null;

/* 버튼 클릭 시 나오는 브라우저 안내 모달 */
function IABModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;

  const copy = () => {
    const write = () => {
      const el = document.createElement("textarea");
      el.value = url; document.body.appendChild(el);
      el.select(); document.execCommand("copy");
      document.body.removeChild(el);
    };
    navigator.clipboard?.writeText(url).catch(write) ?? write();
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const hint = IS_IOS
    ? "Tap  ···  at the bottom → Open in Safari"
    : "Tap  ⋮  at the top right → Open in browser";
  const hintKr = IS_IOS
    ? "하단 ···  탭 → Safari로 열기"
    : "우측 상단 ⋮  탭 → 브라우저로 열기";

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:99999,
      display:"flex", alignItems:"center", justifyContent:"center",
      background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)",
      WebkitBackdropFilter:"blur(6px)", padding:"24px",
    }}>
      <div style={{
        background:"#fff", borderRadius:24, padding:"32px 22px",
        maxWidth:320, width:"100%", textAlign:"center",
        boxShadow:"0 24px 64px rgba(0,0,0,0.35)",
        animation:"fadeUp 0.3s ease",
      }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🌐</div>
        <h3 style={{ fontSize:18, fontWeight:800, color:"#1a1a1a", margin:"0 0 4px" }}>
          Open in Browser
        </h3>
        <p style={{ fontSize:12, color:"#9ca3af", margin:"0 0 16px" }}>
          외부 브라우저에서 열어주세요
        </p>
        <p style={{ fontSize:13, color:"#4b5563", lineHeight:1.7, margin:"0 0 6px" }}>
          Camera &amp; file access isn't available<br/>in messenger browsers.
        </p>
        <p style={{ fontSize:11, color:"#9ca3af", margin:"0 0 22px", lineHeight:1.6 }}>
          메신저 내 브라우저에서는 카메라·파일<br/>기능을 사용할 수 없어요.
        </p>

        <button onClick={copy} style={{
          background:"#7c3aed", color:"#fff", border:"none",
          borderRadius:12, padding:"13px 0", fontSize:15,
          fontWeight:700, cursor:"pointer", width:"100%", marginBottom:10,
        }}>
          {copied ? "✅ Copied!" : "📋 Copy Link · 링크 복사"}
        </button>

        <p style={{ fontSize:12, color:"#6b7280", margin:"0 0 4px", lineHeight:1.6 }}>
          {hint}
        </p>
        <p style={{ fontSize:11, color:"#9ca3af", margin:"0 0 20px" }}>{hintKr}</p>

        <button onClick={onClose} style={{
          background:"none", border:"none", color:"#9ca3af",
          fontSize:13, cursor:"pointer", padding:"4px",
        }}>
          닫기 · Close
        </button>
      </div>
    </div>
  );
}

/* 서버 오류 모달 */
function ErrorModal({ onClose }) {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      display:"flex", alignItems:"center", justifyContent:"center",
      background:"rgba(0,0,0,0.55)", backdropFilter:"blur(6px)",
      WebkitBackdropFilter:"blur(6px)", padding:"20px",
    }}>
      <div style={{
        background:"#fff", borderRadius:24, padding:"32px 24px",
        maxWidth:320, width:"100%", textAlign:"center",
        boxShadow:"0 24px 64px rgba(0,0,0,0.3)",
        animation:"fadeUp 0.3s ease",
      }}>
        <div style={{ fontSize:52, marginBottom:12 }}>😓</div>
        <h3 style={{ fontSize:18, fontWeight:800, color:"#1a1a1a", margin:"0 0 4px" }}>
          Our servers are a bit busy
        </h3>
        <p style={{ fontSize:12, color:"#9ca3af", margin:"0 0 16px" }}>
          서버가 잠시 바쁩니다
        </p>
        <p style={{ fontSize:14, color:"#4b5563", lineHeight:1.75, margin:"0 0 8px" }}>
          Please try again in a moment.<br/>
          Sorry for the inconvenience! 🙏
        </p>
        <p style={{ fontSize:12, color:"#9ca3af", margin:"0 0 24px", lineHeight:1.6 }}>
          잠시 후 다시 시도해주세요.<br/>불편을 드려 진심으로 죄송합니다.
        </p>
        <button onClick={onClose} style={{
          background:"#7c3aed", color:"#fff", border:"none",
          borderRadius:12, padding:"13px 0", fontSize:15,
          fontWeight:700, cursor:"pointer", width:"100%",
        }}>
          Try Again
          <span style={{ display:"block", fontSize:11, fontWeight:400, opacity:0.75, marginTop:2 }}>
            다시 시도하기
          </span>
        </button>
      </div>
    </div>
  );
}

/* EN 메인 / KR 보조 텍스트 컴포넌트 */
function BiLabel({ en, kr, enStyle={}, krStyle={} }) {
  return (
    <div>
      <span style={enStyle}>{en}</span>
      <span style={{ display:"block", opacity:0.45, fontSize:"0.85em", marginTop:1, ...krStyle }}>{kr}</span>
    </div>
  );
}

const pageBg = {
  background:"linear-gradient(145deg, #6d28d9 0%, #7c3aed 30%, #a855f7 65%, #8b5cf6 100%)",
  minHeight:"100vh", display:"flex", flexDirection:"column",
  alignItems:"center", justifyContent:"center",
  position:"relative", overflow:"hidden", padding:"24px 16px",
};

export default function App() {
  const [step,      setStep]      = useState("home");
  const [photo,     setPhoto]     = useState(null);
  const [birth,     setBirth]     = useState({ year:"", month:"", day:"", hour:"Unknown" });
  const [result,    setResult]    = useState(null);
  const [analyzing, setAnalyzing] = useState(0);
  const [dotIdx,    setDotIdx]    = useState(0);
  const [error,     setError]     = useState(null);
  const [sharing,    setSharing]    = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [noFaceModal, setNoFaceModal] = useState(false);
  const [iabModal,   setIabModal]   = useState(false);
  const [orderModal, setOrderModal] = useState(null);
  const [orderStep,  setOrderStep]  = useState("form"); // "form" | "payment"
  const [shipForm,   setShipForm]   = useState({ name:"", email:"", address:"", city:"", postal:"", country:"" });
  const [submitting, setSubmitting] = useState(false);
  const cardRef    = useRef(null);
  const selfieRef  = useRef(null);
  const galleryRef = useRef(null);

  /* 카카오톡: 앱 열리자마자 외부 브라우저로 자동 리다이렉트 */
  useEffect(() => {
    if (IAB_TYPE === "kakao") {
      window.location.href =
        "kakaotalk://web/openExternal?url=" + encodeURIComponent(window.location.href);
    }
  }, []);

  /* Twemoji: 모든 이모지를 플랫폼 무관하게 동일하게 렌더링 */
  useEffect(() => {
    if (window.twemoji) {
      window.twemoji.parse(document.body, {
        folder: "svg",
        ext: ".svg",
      });
    }
  }, [step]);

  useEffect(() => {
    if (step !== "analyzing") return;
    const textTimer = setInterval(() => setAnalyzing(a => a + 1), 3000);
    const dotTimer  = setInterval(() => setDotIdx(d => (d + 1) % 5), 1000);
    return () => { clearInterval(textTimer); clearInterval(dotTimer); };
  }, [step]);

  const handlePhoto = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      setStep("upload");
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const birthValid = birth.year.length === 4 && birth.month && birth.day;

  const analyze = async () => {
    if (!photo) { setStep("home"); return; }
    setStep("analyzing");
    setAnalyzing(0);
    setError(null);
    try {
      const base64   = photo.split(",")[1];
      const mimeType = photo.split(";")[0].split(":")[1];

      const prompt = `STEP 1 — Face check: Does this image contain at least one human or animal face in a real photograph (babies, children, adults, group photos, pets — all OK)?
If the image is a cartoon, illustration, anime, drawing, painting, AI art, or any non-photographic artwork — respond ONLY with:
{"error":"no_face"}
If there is NO face at all (object, food, landscape, text, etc.) — respond ONLY with:
{"error":"no_face"}

If YES, a real face is present in a real photo, proceed with this full analysis.
Birth: ${birth.year}/${birth.month}/${birth.day}, Hour: ${birth.hour}

You are a Korean name master and Saju (사주) expert. Analyze the face and birth info.
Return ONLY valid JSON, no markdown:
{
  "korean": "한글 이름(given name only, NO family name/성, 1-2자, e.g. 하나 not 김하나)",
  "hanja": "漢字 (given name only, no family name hanja)",
  "romanization": "ROMANIZED GIVEN NAME IN CAPS (e.g. HANA not KIM HANA)",
  "element": "Water",
  "elementKr": "수",
  "elementEmoji": "💧",
  "personality": "2-3문장으로 이 사람의 성격을 한국어로 설명",
  "personalityEn": "2-3 sentences describing this person's personality in English",
  "traits": [
    { "emoji":"🌙", "en":"Intuitive",  "kr":"직관적인" },
    { "emoji":"🎨", "en":"Creative",   "kr":"창의적인" },
    { "emoji":"🔥", "en":"Passionate", "kr":"열정적인" }
  ],
  "luckyColor":    "Lavender",
  "luckyColorKr":  "라벤더",
  "luckyColorHex": "#c084fc",
  "luckyNumber":   7,
  "saju": {
    "yearPillar":"甲子","monthPillar":"乙丑","dayPillar":"丙寅","timePillar":"丁卯"
  },
  "dominantElement":"목","dominantElementEn":"Wood",
  "lackingElement":"금","lackingElementEn":"Metal"
}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
        {
          method:"POST",
          headers:{ "Content-Type":"application/json", "x-goog-api-key":GEMINI_KEY },
          body:JSON.stringify({
            contents:[{ parts:[
              { inlineData:{ mimeType, data:base64 } },
              { text:prompt },
            ]}],
            generationConfig:{ temperature:0.85 },
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      const data = await res.json();
      if (data.error) throw new Error(data.error.message || "API error");

      const raw    = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const json   = raw.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
      const parsed = JSON.parse(json);

      if (parsed.error === "no_face") {
        setNoFaceModal(true);
        setPhoto(null);
        return;
      }

      setResult(parsed);
      setStep("result");
    } catch (err) {
      console.error(err);
      // 오너 알림 — ntfy.sh 푸시 (sendBeacon: CORS 없이 확실하게 전송)
      const isTimeout = err.name === "AbortError";
      const ntfyMsg = isTimeout
        ? `⏱ 타임아웃 (30s 초과) — Gemini 서버 바쁨\n${new Date().toLocaleString("ko-KR")}`
        : `🚨 API 오류: ${err.message}\n${new Date().toLocaleString("ko-KR")}`;
      const ntfyParams = new URLSearchParams({
        title: "K-MY NAME 오류",
        priority: "high",
        tags: isTimeout ? "hourglass_flowing_sand" : "warning",
      });
      navigator.sendBeacon(
        `https://ntfy.sh/kmyname-errors-sunny?${ntfyParams}`,
        new Blob([ntfyMsg], { type: "text/plain" })
      ); // 알림 실패해도 앱에 영향 없음
      setErrorModal(true);
    }
  };

  const orderGoods = (goods) => {
    setShipForm({ name:"", email:"", address:"", city:"", postal:"", country:"" });
    setOrderStep("form");
    setOrderModal(goods);
  };

  const submitOrder = async () => {
    const { name, email, address, city, country } = shipForm;
    if (!name || !email || !address || !city || !country) return;
    setSubmitting(true);
    try {
      await fetch("https://k-my-name-default-rtdb.firebaseio.com/orders.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          koreanName: result?.korean,
          romanization: result?.romanization,
          product: orderModal?.name,
          price: orderModal?.price,
          ...shipForm,
          orderedAt: new Date().toISOString(),
          paid: false,
        }),
      });
      // 오너 ntfy 알림
      const msg = `🛍 새 주문!\n${result?.korean} (${result?.romanization}) · ${orderModal?.name} · $${orderModal?.price}\n📦 ${name} · ${city}, ${country}\n📧 ${email}`;
      const p = new URLSearchParams({ title:"K-MY NAME 새 주문 🛍", priority:"high", tags:"shopping" });
      navigator.sendBeacon(`https://ntfy.sh/kmyname-errors-sunny?${p}`, new Blob([msg], { type:"text/plain" }));
      setOrderStep("payment");
    } catch(e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const resetHome = () => {
    setPhoto(null); setResult(null);
    setBirth({ year:"", month:"", day:"", hour:"Unknown" });
    setStep("home");
  };

  const shareResult = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    await new Promise(r => setTimeout(r, 120)); // wait for solid-bg re-render
    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true, scale: 2, backgroundColor: null,
        logging: false,
      });
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `${result.korean}-korean-name.png`, { type:"image/png" });
        if (navigator.canShare?.({ files:[file] })) {
          await navigator.share({
            files:[file],
            title:`My Korean Name: ${result.korean} (${result.romanization})`,
            text:`✨ I discovered my Korean name! ${result.korean} · ${result.romanization}`,
          });
        } else {
          // fallback: download
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = file.name; a.click();
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (e) {
      console.error(e);
    } finally {
      setSharing(false);
    }
  };

  /* ─── Shared styles ─── */
  const btn = {
    display:"flex", alignItems:"center", justifyContent:"center",
    flexDirection:"column", gap:2,
    background:"#7c3aed", color:"#fff", border:"none",
    borderRadius:14, padding:"13px 28px",
    fontSize:15, fontWeight:600, cursor:"pointer",
    width:"100%", boxSizing:"border-box",
  };
  const btnSub = { display:"block", fontSize:11, fontWeight:400, opacity:0.55, marginTop:1 };
  const btnOutline = {
    ...btn, background:"transparent", color:"#7c3aed",
    border:"2px solid #7c3aed", marginTop:10,
  };
  const btnOutlineSub = { ...btnSub, opacity:0.5 };
  const btnGlass = {
    ...btn,
    background:"rgba(255,255,255,0.18)",
    backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
    border:"1px solid rgba(255,255,255,0.32)", color:"#fff",
  };
  const inputStyle = {
    width:"100%", boxSizing:"border-box", padding:"10px 12px",
    border:"2px solid #e5e7eb", borderRadius:10, fontSize:15,
    color:"#1a1a1a", outline:"none", fontFamily:"inherit", background:"#fff",
  };
  const labelStyle = {
    fontSize:11, color:"#6b7280", marginBottom:6, display:"block",
    fontWeight:600, textTransform:"uppercase", letterSpacing:1,
  };

  /* ════════════════════════════════ HOME ══════════════════════════════ */
  if (step === "home") return (
    <div style={pageBg}>
      <style>{CSS}</style>
      <Sparkles />

      <div style={{ textAlign:"center", color:"#fff", marginBottom:28, zIndex:1, animation:"fadeUp 0.7s ease" }}>
        <div style={{ fontSize:40, marginBottom:6 }}>✨</div>
        <h1 style={{ fontSize:30, fontWeight:900, margin:"0 0 18px", letterSpacing:3 }}>K-MY NAME</h1>

        <div style={{ opacity:0.35, fontSize:16, margin:"0 0 8px" }}>✦︎</div>
        <p style={{ fontSize:22, fontWeight:900, margin:"0 0 2px", lineHeight:1.25,
          textShadow:"0 2px 16px rgba(0,0,0,0.25)", whiteSpace:"nowrap" }}>
          What's your Korean name?
        </p>
        <p style={{ fontSize:12, opacity:0.45, margin:"0 0 8px", fontWeight:500 }}>
          당신의 한국 이름은?
        </p>
        <div style={{ opacity:0.35, fontSize:16, margin:"0 0 16px" }}>✦︎</div>

        <p style={{ fontSize:14, fontWeight:500, opacity:0.75, margin:"0 0 2px", lineHeight:1.5, fontStyle:"italic" }}>
          You were born with a Korean name.
        </p>
        <p style={{ fontSize:11, opacity:0.4, margin:"0 0 10px", fontWeight:400, fontStyle:"italic" }}>
          당신은 한국 이름을 가지고 태어났어요.
        </p>

        <p style={{ fontSize:14, fontWeight:500, opacity:0.75, margin:"0 0 2px", lineHeight:1.5, fontStyle:"italic" }}>
          You just didn't know it yet.
        </p>
        <p style={{ fontSize:11, opacity:0.4, margin:"0 0 12px", fontWeight:400, fontStyle:"italic" }}>
          단지 몰랐을 뿐이에요.
        </p>

        <p style={{ fontSize:14, fontWeight:500, opacity:0.75, margin:"0 0 2px", lineHeight:1.5, fontStyle:"italic" }}>
          Discover it now ↓
        </p>
        <p style={{ fontSize:11, opacity:0.4, fontWeight:400, fontStyle:"italic", margin:0 }}>지금 알아보세요</p>
      </div>

      <div style={{
        background:"rgba(255,255,255,0.97)", borderRadius:22, padding:"24px 20px",
        width:"100%", maxWidth:360,
        boxShadow:"0 20px 60px rgba(0,0,0,0.25)",
        zIndex:1, animation:"fadeUp 0.8s ease",
      }}>
        <p style={{ fontSize:13, color:"#6b7280", lineHeight:1.7, marginBottom:20, textAlign:"center" }}>
          📷 Selfie + 📅 Birth date<br/>
          <span style={{ fontSize:11, color:"#9ca3af" }}>AI analyzes your face &amp; Saju to craft your name</span>
        </p>

        {/* Hidden inputs */}
        <input ref={selfieRef}  type="file" accept="image/*" capture="user" onChange={handlePhoto} style={{ display:"none" }} />
        <input ref={galleryRef} type="file" accept="image/*"               onChange={handlePhoto} style={{ display:"none" }} />

        {/* IAB 모달 */}
        {iabModal && <IABModal onClose={() => setIabModal(false)} />}

        {/* Selfie — front camera */}
        <button style={{ ...btn, marginBottom:10 }} onClick={() => {
          if (IAB_TYPE) { setIabModal(true); return; }
          selfieRef.current?.click();
        }}>
          📷 Take Selfie
          <span style={btnSub}>셀피 찍기</span>
        </button>

        {/* Gallery */}
        <button style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          flexDirection:"column", gap:2,
          background:"transparent", color:"#7c3aed",
          border:"2px solid #7c3aed", borderRadius:14, padding:"13px 28px",
          fontSize:15, fontWeight:600, cursor:"pointer",
          width:"100%", boxSizing:"border-box",
        }} onClick={() => {
          if (IAB_TYPE) { setIabModal(true); return; }
          galleryRef.current?.click();
        }}>
          📁 Choose from Gallery
          <span style={{ fontSize:11, fontWeight:400, opacity:0.5, marginTop:1 }}>갤러리에서 선택</span>
        </button>

        <div style={{ marginTop:14, textAlign:"center", borderTop:"1px solid #f0f0f0", paddingTop:12 }}>
          <p style={{ fontSize:11, color:"#9ca3af", margin:"0 0 3px" }}>
            🔒 Photos are not stored
          </p>
          <p style={{ fontSize:10, color:"#c4c4c4", margin:"0 0 6px" }}>사진은 저장되지 않습니다</p>
          <p style={{ fontSize:11, color:"#9ca3af", margin:"0 0 2px" }}>
            For entertainment purposes only ✨
          </p>
          <p style={{ fontSize:10, color:"#c4c4c4", margin:0 }}>오락 목적으로 제공됩니다</p>
        </div>
      </div>
    </div>
  );

  /* ════════════════════════════════ UPLOAD ════════════════════════════ */
  if (step === "upload") return (
    <>
    {errorModal && <ErrorModal onClose={() => setErrorModal(false)} />}

      {noFaceModal && (
        <div style={{
          position:"fixed", inset:0, zIndex:9999,
          display:"flex", alignItems:"center", justifyContent:"center",
          background:"rgba(0,0,0,0.55)", backdropFilter:"blur(6px)",
          WebkitBackdropFilter:"blur(6px)", padding:"20px",
        }}>
          <div style={{
            background:"#fff", borderRadius:24, padding:"32px 24px",
            maxWidth:300, width:"100%", textAlign:"center",
            boxShadow:"0 24px 64px rgba(0,0,0,0.3)",
            animation:"fadeUp 0.3s ease",
          }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🙈</div>
            <h3 style={{ fontSize:17, fontWeight:800, color:"#1a1a1a", margin:"0 0 8px" }}>
              No face detected
            </h3>
            <p style={{ fontSize:13, color:"#6b7280", lineHeight:1.65, margin:"0 0 20px" }}>
              얼굴을 찾을 수 없어요.<br/>
              셀피나 인물 사진을 올려주세요 📸<br/>
              <span style={{ fontSize:11, opacity:0.7 }}>단체사진은 인식이 어려워요</span>
            </p>
            <button onClick={() => { setNoFaceModal(false); setStep("home"); }} style={{
              background:"#7c3aed", color:"#fff", border:"none",
              borderRadius:12, padding:"12px 32px", fontSize:14,
              fontWeight:700, cursor:"pointer", fontFamily:"inherit",
            }}>
              다시 시도 · Try Again
            </button>
          </div>
        </div>
      )}
    <div style={{ maxWidth:480, margin:"0 auto", minHeight:"100vh",
      background:"linear-gradient(160deg,#f5f0ff 0%,#ede9ff 100%)",
      padding:"28px 16px", boxSizing:"border-box" }}>
      <style>{CSS}</style>

      <div style={{ textAlign:"center", marginBottom:24, animation:"fadeUp 0.6s ease" }}>
        <div style={{
          display:"inline-block", fontSize:26, fontWeight:900, letterSpacing:2,
          background:"linear-gradient(90deg,#6d28d9,#a855f7)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        }}>K-MY NAME</div>
        <p style={{ fontSize:12, color:"#7c3aed", marginTop:4, fontWeight:600 }}>
          ✦︎ Enter your birth date
        </p>
        <p style={{ fontSize:11, color:"#9ca3af", margin:"2px 0 0" }}>생년월일을 입력해주세요</p>
      </div>


      {photo && (
        <div style={{ textAlign:"center", marginBottom:22, animation:"fadeUp 0.5s ease" }}>
          <img src={photo} alt="uploaded" style={{
            width:110, height:110, borderRadius:"50%",
            objectFit:"cover", objectPosition:"top",
            border:"3px solid #7c3aed",
            boxShadow:"0 4px 20px rgba(124,58,237,0.3)",
          }} />
          <div>
            <input ref={galleryRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display:"none" }} />
            <button style={{ display:"inline-flex", flexDirection:"column", alignItems:"center",
              gap:2, marginTop:10, cursor:"pointer", color:"#7c3aed", fontSize:13, fontWeight:600,
              background:"none", border:"none" }}
              onClick={() => galleryRef.current?.click()}>
              📸 Change Photo
              <span style={{ fontSize:10, opacity:0.5, fontWeight:400 }}>사진 변경</span>
            </button>
          </div>
        </div>
      )}

      <div style={{ background:"#fff", borderRadius:18, padding:"22px 18px",
        boxShadow:"0 2px 16px rgba(109,40,217,0.1)", animation:"fadeUp 0.7s ease",
        border:"1px solid rgba(139,92,246,0.12)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:10, marginBottom:14 }}>
          <div>
            <label style={labelStyle}>Year<span style={{ fontWeight:400, opacity:0.5, marginLeft:4 }}>연도</span></label>
            <input style={inputStyle} type="number" placeholder="e.g. 1995" min="1900" max="2024"
              value={birth.year} onChange={e => setBirth(p => ({ ...p, year:e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Month<span style={{ fontWeight:400, opacity:0.5, marginLeft:4 }}>월</span></label>
            <input style={inputStyle} type="number" placeholder="1-12" min="1" max="12"
              value={birth.month} onChange={e => setBirth(p => ({ ...p, month:e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Day<span style={{ fontWeight:400, opacity:0.5, marginLeft:4 }}>일</span></label>
            <input style={inputStyle} type="number" placeholder="1-31" min="1" max="31"
              value={birth.day} onChange={e => setBirth(p => ({ ...p, day:e.target.value }))} />
          </div>
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={labelStyle}>
            Birth Hour (optional)
            <span style={{ fontWeight:400, opacity:0.5, marginLeft:4 }}>태어난 시간 (선택)</span>
          </label>
          <select style={inputStyle} value={birth.hour}
            onChange={e => setBirth(p => ({ ...p, hour:e.target.value }))}>
            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <button style={{ ...btn, opacity:birthValid ? 1 : 0.45 }} disabled={!birthValid} onClick={analyze}>
          🔮 Analyze My Name
          <span style={btnSub}>이름 &amp; 사주 분석하기</span>
        </button>
        <button style={btnOutline} onClick={() => { setPhoto(null); setStep("home"); }}>
          ← Back
          <span style={btnOutlineSub}>뒤로 가기</span>
        </button>
      </div>
    </div>
    </>
  );

  /* ════════════════════════════════ ANALYZING ═════════════════════════ */
  if (step === "analyzing") {
    if (errorModal) return <ErrorModal onClose={() => { setErrorModal(false); setStep("upload"); }} />;
    if (noFaceModal) return (
      <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.55)", backdropFilter:"blur(6px)", padding:"20px" }}>
        <div style={{ background:"#fff", borderRadius:24, padding:"32px 24px", maxWidth:300, width:"100%", textAlign:"center", boxShadow:"0 24px 64px rgba(0,0,0,0.3)" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🙈</div>
          <h3 style={{ fontSize:17, fontWeight:800, color:"#1a1a1a", margin:"0 0 8px" }}>No face detected</h3>
          <p style={{ fontSize:13, color:"#6b7280", lineHeight:1.65, margin:"0 0 20px" }}>얼굴을 찾을 수 없어요.<br/>셀피나 인물 사진을 올려주세요 📸<br/><span style={{ fontSize:11, opacity:0.7 }}>단체사진은 인식이 어려워요</span></p>
          <button onClick={() => { setNoFaceModal(false); setStep("home"); }} style={{ background:"#7c3aed", color:"#fff", border:"none", borderRadius:12, padding:"12px 32px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            다시 시도 · Try Again
          </button>
        </div>
      </div>
    );
    const cur = STEPS[analyzing % STEPS.length];
    return (
      <div style={pageBg}>
        <style>{CSS}</style>
        <Sparkles />
        <div style={{ textAlign:"center", zIndex:1 }}>
          <div style={{ fontSize:64, marginBottom:20, display:"inline-block",
            animation:"pulse 1.4s ease-in-out infinite" }}>
            {["🔍","☯️","✍️"][analyzing % 3]}
          </div>
          {/* English main */}
          <h2 style={{ fontSize:22, fontWeight:700, margin:"0 0 5px", color:"#fff" }}>{cur.en}</h2>
          {/* Korean secondary */}
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", margin:0 }}>{cur.kr}</p>
          <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:24 }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{
                width:8, height:8, borderRadius:"50%",
                background: i === dotIdx ? "#fff" : "rgba(255,255,255,0.3)",
                transition:"background 0.3s",
              }}/>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════ RESULT ════════════════════════════ */
  if (step === "result" && !result) return null;
  if (step === "result") return (
    <div style={pageBg}>
      <style>{CSS}</style>
      <Sparkles />

      <div ref={cardRef} style={{
        background: sharing
          ? "linear-gradient(145deg,#6d28d9,#7c3aed 50%,#8b5cf6)"
          : "rgba(255,255,255,0.13)",
        backdropFilter: sharing ? "none" : "blur(24px)",
        WebkitBackdropFilter: sharing ? "none" : "blur(24px)",
        border:"1.5px solid rgba(255,255,255,0.28)",
        borderRadius:28, width:"100%", maxWidth:360,
        overflow:"hidden", zIndex:1,
        animation:"fadeUp 0.7s ease",
        boxShadow:"0 24px 64px rgba(0,0,0,0.35)",
      }}>
        <div style={{ textAlign:"center", padding:"13px 0 6px",
          color:"rgba(255,255,255,0.65)", fontSize:10, letterSpacing:4, fontWeight:700 }}>
          YOUR KOREAN NAME
        </div>

        {/* Photo + Name */}
        <div style={{ display:"flex", minHeight:210 }}>
          <div style={{ width:"46%", position:"relative", overflow:"hidden", flexShrink:0 }}>
            {photo && (
              <img src={photo} alt="you" style={{
                width:"100%", height:"100%",
                objectFit:"cover", objectPosition:"center top", display:"block",
                WebkitMaskImage:"linear-gradient(to right,rgba(0,0,0,0.95) 40%,transparent 100%)",
                maskImage:       "linear-gradient(to right,rgba(0,0,0,0.95) 40%,transparent 100%)",
              }}/>
            )}
          </div>
          <div style={{ flex:1, padding:"20px 16px 16px 8px",
            display:"flex", flexDirection:"column", justifyContent:"center", gap:10 }}>
            {/* Korean name + romanization side by side */}
            <div style={{ display:"flex", alignItems:"flex-end", gap:6, flexWrap:"wrap" }}>
              <span style={{ fontSize:54, fontWeight:900, color:"#fff",
                lineHeight:1, letterSpacing:-1, textShadow:"0 2px 12px rgba(0,0,0,0.4)" }}>
                {result.korean}
              </span>
              <span style={{ fontSize:10, color:"rgba(255,255,255,0.7)", letterSpacing:3,
                fontWeight:700, paddingBottom:7, lineHeight:1 }}>
                {result.romanization}
              </span>
            </div>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:5,
              background:"rgba(168,85,247,0.35)", border:"1px solid rgba(255,255,255,0.4)",
              borderRadius:20, padding:"4px 11px",
              color:"#fff", fontSize:11, fontWeight:600, width:"fit-content",
            }}>
              ✦︎ {result.element} · {result.elementKr}
            </div>
          </div>
        </div>

        {/* Personality — EN first, KR below */}
        <div style={{ padding:"14px 20px 10px", textAlign:"center", background:"rgba(0,0,0,0.08)" }}>
          <div style={{ color:"#fbbf24", fontSize:30, lineHeight:0.6, marginBottom:8 }}>"</div>
          {result.personalityEn && (
            <p style={{ color:"#fff", fontSize:13, lineHeight:1.75, margin:"0 0 8px" }}>
              {result.personalityEn}
            </p>
          )}
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:11, lineHeight:1.6, margin:0, fontStyle:"italic" }}>
            {result.personality}
          </p>
          <div style={{ color:"#fbbf24", fontSize:30, lineHeight:0.6, marginTop:8 }}>"</div>
        </div>

        {/* Traits */}
        <div style={{ padding:"14px 16px" }}>
          <div style={{ textAlign:"center", fontSize:9, color:"rgba(255,255,255,0.45)",
            letterSpacing:4, fontWeight:700, marginBottom:12 }}>
            TRAITS
            <span style={{ fontWeight:400, marginLeft:6, opacity:0.6 }}>성격</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-around" }}>
            {(result.traits||[]).map((t,i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{
                  width:48, height:48, borderRadius:"50%",
                  background:"rgba(255,255,255,0.14)",
                  border:"1.5px solid rgba(255,255,255,0.3)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:22, margin:"0 auto 6px",
                }}>{t.emoji}</div>
                <div style={{ color:"#fff", fontSize:11, fontWeight:700 }}>{t.en}</div>
                <div style={{ color:"rgba(255,255,255,0.45)", fontSize:10, marginTop:1 }}>{t.kr}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lucky */}
        <div style={{ display:"flex", gap:8, padding:"10px 14px", background:"rgba(0,0,0,0.12)" }}>
          <div style={{ flex:1, background:"rgba(255,255,255,0.1)", borderRadius:12, padding:"10px 12px" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)", letterSpacing:2,
              fontWeight:700, marginBottom:5 }}>
              LUCKY COLOR
              <span style={{ fontWeight:400, marginLeft:4, opacity:0.6 }}>행운의 색</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ width:14, height:14, borderRadius:"50%",
                background:result.luckyColorHex||"#c084fc",
                border:"1.5px solid rgba(255,255,255,0.6)", flexShrink:0 }}/>
              <div>
                <span style={{ color:"#fff", fontSize:13, fontWeight:700 }}>{result.luckyColor}</span>
                <span style={{ display:"block", color:"rgba(255,255,255,0.45)", fontSize:10 }}>{result.luckyColorKr}</span>
              </div>
            </div>
          </div>
          <div style={{ flex:1, background:"rgba(255,255,255,0.1)", borderRadius:12, padding:"10px 12px" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)", letterSpacing:2,
              fontWeight:700, marginBottom:3 }}>
              LUCKY NUMBER
              <span style={{ fontWeight:400, marginLeft:4, opacity:0.6 }}>행운의 숫자</span>
            </div>
            <div style={{ color:"#fff", fontSize:26, fontWeight:900, lineHeight:1 }}>
              {result.luckyNumber}
            </div>
          </div>
        </div>

        {/* Hanja + footer */}
        <div style={{ padding:"10px 16px 6px", textAlign:"center",
          borderTop:"1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>漢字 · {result.hanja}</span>
        </div>
        <div style={{ textAlign:"center", padding:"8px 0 14px",
          color:"rgba(255,255,255,0.35)", fontSize:10, letterSpacing:4 }}>
          ✦︎ K-MY NAME ✦︎
        </div>
      </div>

      {/* 3-button row */}
      <div style={{ display:"flex", gap:8, marginTop:18, width:"100%", maxWidth:360, zIndex:1 }}>
        {[
          { icon:"📤", en:"Share",     kr:"결과 공유",    action: shareResult },
          { icon:"🎁", en:"Keep Name", kr:"이름 간직하기", action: () => setStep("shop") },
          { icon:"🏠", en:"Home",      kr:"홈으로",       action: resetHome },
        ].map(({ icon, en, kr, action }) => (
          <button key={en} onClick={action} style={{
            flex:1, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", gap:3,
            background:"rgba(255,255,255,0.18)",
            backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
            border:"1px solid rgba(255,255,255,0.32)", color:"#fff",
            borderRadius:14, padding:"12px 6px", cursor:"pointer",
          }}>
            <span style={{ fontSize:22 }}>{icon}</span>
            <span style={{ fontSize:12, fontWeight:700 }}>{en}</span>
            <span style={{ fontSize:9, opacity:0.55 }}>{kr}</span>
          </button>
        ))}
      </div>
    </div>
  );

  /* ════════════════════════════════ SHOP ══════════════════════════════ */
  if (step === "shop") return (
    <div style={{ maxWidth:480, margin:"0 auto", minHeight:"100vh",
      background:"linear-gradient(160deg,#f5f0ff 0%,#ede9ff 100%)",
      padding:"24px 16px", boxSizing:"border-box" }}>
      <style>{CSS}</style>

      {/* 주문 모달 */}
      {orderModal && (
        <div style={{
          position:"fixed", inset:0, zIndex:9999,
          display:"flex", alignItems:"center", justifyContent:"center",
          background:"rgba(0,0,0,0.55)", backdropFilter:"blur(6px)",
          WebkitBackdropFilter:"blur(6px)", padding:"20px",
          overflowY:"auto",
        }}>
          <div style={{
            background:"#fff", borderRadius:24, padding:"24px 20px",
            maxWidth:340, width:"100%",
            boxShadow:"0 24px 64px rgba(0,0,0,0.3)",
            animation:"fadeUp 0.3s ease",
          }} onClick={e => e.stopPropagation()}>

            {/* 상품 헤더 */}
            <div style={{ textAlign:"center", marginBottom:16 }}>
              <div style={{ fontSize:36 }}>{orderModal.emoji}</div>
              <div style={{ fontWeight:800, fontSize:16, color:"#1a1a1a", margin:"4px 0 2px" }}>{orderModal.name}</div>
              <div style={{ fontSize:12, color:"#9ca3af" }}>
                For: <strong style={{ color:"#7c3aed" }}>{result?.korean}</strong> · {result?.romanization}
              </div>
              <div style={{ fontSize:20, fontWeight:900, color:"#7c3aed", marginTop:4 }}>${orderModal.price} USD</div>
            </div>

            {orderStep === "form" ? (<>
              {/* STEP 1 — 배송지 입력 */}
              <div style={{ background:"#f5f3ff", borderRadius:12, padding:"10px 14px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#7c3aed", letterSpacing:1 }}>STEP 1 · Shipping Info</div>
                <div style={{ fontSize:9, color:"#a78bfa" }}>배송지를 입력해주세요</div>
              </div>

              {[
                { key:"name",    label:"Full Name",      placeholder:"Jane Smith",        type:"text"  },
                { key:"email",   label:"Email",          placeholder:"jane@example.com",  type:"email" },
                { key:"address", label:"Street Address", placeholder:"123 Main St",       type:"text"  },
                { key:"city",    label:"City",           placeholder:"Hong Kong",         type:"text"  },
                { key:"postal",  label:"Postal Code (optional)", placeholder:"000000",   type:"text"  },
                { key:"country", label:"Country",        placeholder:"Hong Kong",         type:"text"  },
              ].map(f => (
                <div key={f.key} style={{ marginBottom:8 }}>
                  <label style={{ fontSize:10, color:"#6b7280", fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, display:"block", marginBottom:3 }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={shipForm[f.key]}
                    onChange={e => setShipForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width:"100%", boxSizing:"border-box", border:"1.5px solid #e5e7eb", borderRadius:8, padding:"8px 10px", fontSize:13, fontFamily:"inherit", outline:"none" }}
                  />
                </div>
              ))}

              <button
                onClick={submitOrder}
                disabled={submitting || !shipForm.name || !shipForm.email || !shipForm.address || !shipForm.city || !shipForm.country}
                style={{
                  width:"100%", background: submitting ? "#a78bfa" : "#7c3aed",
                  color:"#fff", border:"none", borderRadius:12,
                  padding:"13px 0", fontSize:14, fontWeight:700,
                  cursor:"pointer", marginTop:6, fontFamily:"inherit",
                  opacity: (!shipForm.name || !shipForm.email || !shipForm.address || !shipForm.city || !shipForm.country) ? 0.5 : 1,
                }}>
                {submitting ? "Saving..." : "Next: Pay →"}
                <span style={{ display:"block", fontSize:10, fontWeight:400, opacity:0.75, marginTop:2 }}>배송지 저장 후 결제</span>
              </button>

            </>) : (<>
              {/* STEP 2 — 결제 */}
              <div style={{ background:"#f0fdf4", borderRadius:12, padding:"10px 14px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#16a34a", letterSpacing:1 }}>✅ STEP 1 Complete!</div>
                <div style={{ fontSize:9, color:"#4ade80" }}>배송지가 저장되었어요</div>
              </div>

              <div style={{ background:"#f5f3ff", borderRadius:12, padding:"10px 14px", marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#7c3aed", letterSpacing:1 }}>STEP 2 · Payment</div>
                <div style={{ fontSize:9, color:"#a78bfa" }}>결제를 완료해주세요</div>
              </div>

              <a href={orderModal.paypalUrl} target="_blank" rel="noreferrer"
                style={{
                  display:"block", background:"#0070ba", color:"#fff",
                  borderRadius:12, padding:"14px 0", fontSize:15,
                  fontWeight:700, textDecoration:"none", textAlign:"center", marginBottom:12,
                }}>
                💳 Pay ${orderModal.price} · PayPal
                <span style={{ display:"block", fontSize:10, fontWeight:400, opacity:0.8, marginTop:2 }}>
                  No account needed · 계정 없어도 OK
                </span>
              </a>

              <p style={{ fontSize:11, color:"#9ca3af", textAlign:"center", lineHeight:1.6, margin:"0 0 12px" }}>
                Your order will be shipped within<br/>5–7 business days after payment. 📦
              </p>

              <p style={{ fontSize:11, color:"#a78bfa", textAlign:"center", lineHeight:1.6, margin:"0 0 4px" }}>
                📋 주문 상태는 이메일+한글이름으로 조회 가능해요<br/>
                <a href="/order-status.html" target="_blank" rel="noreferrer" style={{ color:"#7c3aed", fontWeight:700 }}>
                  k-my-name-app.vercel.app/order-status.html
                </a>
              </p>
            </>)}

            <button onClick={() => setOrderModal(null)} style={{
              display:"block", margin:"0 auto",
              background:"none", border:"none", color:"#d1d5db",
              fontSize:12, cursor:"pointer", padding:"4px",
            }}>
              닫기 · Close
            </button>
          </div>
        </div>
      )}

      <div style={{ textAlign:"center", marginBottom:22, animation:"fadeUp 0.5s ease" }}>
        <div style={{
          fontSize:20, fontWeight:900, letterSpacing:1, marginBottom:2,
          background:"linear-gradient(90deg,#6d28d9,#a855f7)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        }}>Custom Goods for {result?.korean}</div>
        <div style={{ fontSize:12, color:"#9ca3af", marginBottom:2 }}>{result?.korean} 맞춤 굿즈</div>
        <p style={{ fontSize:12, color:"#c4b5fd", margin:0 }}>Your name, forever yours ✦︎</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        {GOODS.map(g => (
          <div key={g.id} style={{
            background:"#fff", border:"1px solid rgba(139,92,246,0.12)",
            borderRadius:16, padding:"16px 12px",
            display:"flex", flexDirection:"column", gap:6,
            boxShadow:"0 2px 8px rgba(109,40,217,0.08)",
            animation:"fadeUp 0.5s ease",
          }}>
            <div style={{ fontSize:30 }}>{g.emoji}</div>
            <div style={{ fontWeight:700, fontSize:14, color:"#1a1a1a" }}>{g.name}</div>
            <div style={{ fontSize:11, color:"#9ca3af", lineHeight:1.4 }}>{g.desc}</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:4 }}>
              <span style={{ fontWeight:800, color:"#7c3aed", fontSize:15 }}>${g.price}</span>
              <div style={{ display:"flex", gap:6 }}>
                {g.detailUrl && (
                  <a href={g.detailUrl} target="_blank" rel="noreferrer"
                    style={{ background:"#f5f3ff", color:"#7c3aed", border:"1px solid #ddd6fe",
                      borderRadius:8, padding:"5px 9px", fontSize:12, cursor:"pointer", fontWeight:600,
                      textDecoration:"none", display:"inline-block" }}>
                    상세<span style={{ display:"block", fontSize:9, fontWeight:400, opacity:0.7 }}>보기</span>
                  </a>
                )}
                <button
                  onClick={() => orderGoods(g)}
                  style={{ background:"#7c3aed", color:"#fff", border:"none",
                    borderRadius:8, padding:"5px 11px", fontSize:12, cursor:"pointer", fontWeight:600 }}>
                  Order<span style={{ display:"block", fontSize:9, fontWeight:400, opacity:0.7 }}>주문하기</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button style={{ display:"flex", alignItems:"center", justifyContent:"center",
        flexDirection:"column", gap:2,
        background:"transparent", color:"#7c3aed", border:"2px solid #7c3aed",
        borderRadius:14, padding:"13px 28px", fontSize:15, fontWeight:600,
        cursor:"pointer", width:"100%", boxSizing:"border-box" }}
        onClick={() => setStep("result")}>
        ← Back to Result
        <span style={{ fontSize:11, fontWeight:400, opacity:0.5, marginTop:1 }}>결과로 돌아가기</span>
      </button>
    </div>
  );

  return null;
}
