import { useState, useEffect, useCallback, useRef } from "react";
import html2canvas from "html2canvas";

import { GEMINI_KEY } from "./constants";
import { IAB_TYPE } from "./utils/iab";

import HomeStep from "./pages/HomeStep";
import UploadStep from "./pages/UploadStep";
import AnalyzingStep from "./pages/AnalyzingStep";
import ResultStep from "./pages/ResultStep";
import ShopStep from "./pages/ShopStep";

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
          status: "결제전",
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

  if (step === "home") return (
    <HomeStep
      iabModal={iabModal} setIabModal={setIabModal}
      selfieRef={selfieRef} galleryRef={galleryRef}
      handlePhoto={handlePhoto}
    />
  );

  if (step === "upload") return (
    <UploadStep
      errorModal={errorModal} setErrorModal={setErrorModal}
      noFaceModal={noFaceModal} setNoFaceModal={setNoFaceModal}
      setStep={setStep}
      photo={photo} setPhoto={setPhoto}
      galleryRef={galleryRef} handlePhoto={handlePhoto}
      birth={birth} setBirth={setBirth}
      birthValid={birthValid} analyze={analyze}
    />
  );

  if (step === "analyzing") return (
    <AnalyzingStep
      errorModal={errorModal} setErrorModal={setErrorModal}
      setStep={setStep}
      noFaceModal={noFaceModal} setNoFaceModal={setNoFaceModal}
      analyzing={analyzing} dotIdx={dotIdx}
    />
  );

  if (step === "result" && !result) return null;
  if (step === "result") return (
    <ResultStep
      result={result} sharing={sharing} cardRef={cardRef} photo={photo}
      shareResult={shareResult} setStep={setStep} resetHome={resetHome}
    />
  );

  if (step === "shop") return (
    <ShopStep
      orderModal={orderModal} setOrderModal={setOrderModal}
      orderStep={orderStep} setOrderStep={setOrderStep}
      shipForm={shipForm} setShipForm={setShipForm}
      result={result} submitOrder={submitOrder} submitting={submitting}
      orderGoods={orderGoods} setStep={setStep}
    />
  );

  return null;
}
