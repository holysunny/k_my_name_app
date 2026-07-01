import { useState } from "react";
import { IS_IOS } from "../utils/iab";

/* 버튼 클릭 시 나오는 브라우저 안내 모달 */
export default function IABModal({ onClose }) {
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
