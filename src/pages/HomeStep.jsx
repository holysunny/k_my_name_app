import { pageBg, CSS, btn } from "../styles";
import Sparkles from "../components/Sparkles";
import IABModal from "../components/IABModal";
import { IAB_TYPE } from "../utils/iab";

export default function HomeStep({ iabModal, setIabModal, selfieRef, galleryRef, handlePhoto }) {
  return (
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
          <span style={{ display:"block", fontSize:11, fontWeight:400, opacity:0.55, marginTop:1 }}>셀피 찍기</span>
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
}
