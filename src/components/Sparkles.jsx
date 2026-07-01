import { SPARKLE_POS } from "../constants";

export default function Sparkles() {
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
