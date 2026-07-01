/* 얼굴 인식 실패 모달 (원본에서 Upload/Analyzing 두 곳에 동일하게 중복돼있던 마크업을 하나로 합침) */
export default function NoFaceModal({ onClose }) {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      display:"flex", alignItems:"center", justifyContent:"center",
      background:"rgba(0,0,0,0.55)", backdropFilter:"blur(6px)", padding:"20px",
    }}>
      <div style={{
        background:"#fff", borderRadius:24, padding:"32px 24px",
        maxWidth:300, width:"100%", textAlign:"center",
        boxShadow:"0 24px 64px rgba(0,0,0,0.3)",
      }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🙈</div>
        <h3 style={{ fontSize:17, fontWeight:800, color:"#1a1a1a", margin:"0 0 8px" }}>No face detected</h3>
        <p style={{ fontSize:13, color:"#6b7280", lineHeight:1.65, margin:"0 0 20px" }}>
          얼굴을 찾을 수 없어요.<br/>
          셀피나 인물 사진을 올려주세요 📸<br/>
          <span style={{ fontSize:11, opacity:0.7 }}>단체사진은 인식이 어려워요</span>
        </p>
        <button onClick={onClose} style={{
          background:"#7c3aed", color:"#fff", border:"none",
          borderRadius:12, padding:"12px 32px", fontSize:14,
          fontWeight:700, cursor:"pointer", fontFamily:"inherit",
        }}>
          다시 시도 · Try Again
        </button>
      </div>
    </div>
  );
}
