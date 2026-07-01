import { CSS, btn, btnSub, btnOutline, btnOutlineSub, inputStyle, labelStyle } from "../styles";
import { HOURS } from "../constants";
import ErrorModal from "../components/ErrorModal";
import NoFaceModal from "../components/NoFaceModal";

export default function UploadStep({
  errorModal, setErrorModal, noFaceModal, setNoFaceModal, setStep,
  photo, setPhoto, galleryRef, handlePhoto,
  birth, setBirth, birthValid, analyze,
}) {
  return (
    <>
    {errorModal && <ErrorModal onClose={() => setErrorModal(false)} />}

    {noFaceModal && (
      <NoFaceModal onClose={() => { setNoFaceModal(false); setStep("home"); }} />
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
}
