import { pageBg, CSS } from "../styles";
import { STEPS } from "../constants";
import Sparkles from "../components/Sparkles";
import ErrorModal from "../components/ErrorModal";
import NoFaceModal from "../components/NoFaceModal";

export default function AnalyzingStep({
  errorModal, setErrorModal, setStep, noFaceModal, setNoFaceModal, analyzing, dotIdx,
}) {
  if (errorModal) return <ErrorModal onClose={() => { setErrorModal(false); setStep("upload"); }} />;
  if (noFaceModal) return <NoFaceModal onClose={() => { setNoFaceModal(false); setStep("home"); }} />;

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
