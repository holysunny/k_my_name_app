import { CSS } from "../styles";
import { GOODS } from "../constants";

export default function ShopStep({
  orderModal, setOrderModal, orderStep, setOrderStep,
  shipForm, setShipForm, result, submitOrder, submitting, orderGoods, setStep,
}) {
  return (
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
                📋 주문 상태는 이메일+로마자 이름으로 조회 가능해요<br/>
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
}
