export const CSS = `
  @keyframes sparkle {
    0%   { opacity:0.12; transform:scale(0.7) rotate(0deg);  }
    50%  { opacity:0.7;  transform:scale(1.3) rotate(20deg); }
    100% { opacity:0.12; transform:scale(0.7) rotate(0deg);  }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes pulse {
    0%,100% { transform:scale(1);    }
    50%     { transform:scale(1.08); }
  }
  img.emoji {
    height: 1em; width: 1em;
    vertical-align: -0.1em;
    display: inline-block;
  }
`;

export const pageBg = {
  background:"linear-gradient(145deg, #6d28d9 0%, #7c3aed 30%, #a855f7 65%, #8b5cf6 100%)",
  minHeight:"100vh", display:"flex", flexDirection:"column",
  alignItems:"center", justifyContent:"center",
  position:"relative", overflow:"hidden", padding:"24px 16px",
};

export const btn = {
  display:"flex", alignItems:"center", justifyContent:"center",
  flexDirection:"column", gap:2,
  background:"#7c3aed", color:"#fff", border:"none",
  borderRadius:14, padding:"13px 28px",
  fontSize:15, fontWeight:600, cursor:"pointer",
  width:"100%", boxSizing:"border-box",
};
export const btnSub = { display:"block", fontSize:11, fontWeight:400, opacity:0.55, marginTop:1 };
export const btnOutline = {
  ...btn, background:"transparent", color:"#7c3aed",
  border:"2px solid #7c3aed", marginTop:10,
};
export const btnOutlineSub = { ...btnSub, opacity:0.5 };
export const btnGlass = {
  ...btn,
  background:"rgba(255,255,255,0.18)",
  backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
  border:"1px solid rgba(255,255,255,0.32)", color:"#fff",
};
export const inputStyle = {
  width:"100%", boxSizing:"border-box", padding:"10px 12px",
  border:"2px solid #e5e7eb", borderRadius:10, fontSize:15,
  color:"#1a1a1a", outline:"none", fontFamily:"inherit", background:"#fff",
};
export const labelStyle = {
  fontSize:11, color:"#6b7280", marginBottom:6, display:"block",
  fontWeight:600, textTransform:"uppercase", letterSpacing:1,
};
