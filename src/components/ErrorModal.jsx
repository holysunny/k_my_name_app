/* 서버 오류 모달 */
export default function ErrorModal({ onClose }) {
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
