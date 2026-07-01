import { pageBg, CSS } from "../styles";
import Sparkles from "../components/Sparkles";

export default function ResultStep({ result, sharing, cardRef, photo, shareResult, setStep, resetHome }) {
  return (
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
}
