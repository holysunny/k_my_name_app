export const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || "";

export const HOURS = [
  "Unknown", "00:00 子時", "01:00 丑時", "03:00 寅時", "05:00 卯時",
  "07:00 辰時", "09:00 巳時", "11:00 午時", "13:00 未時",
  "15:00 申時", "17:00 酉時", "19:00 戌時", "21:00 亥時",
];

export const FORM_BASE    = "https://docs.google.com/forms/d/e/1FAIpQLSdIlknrv_B0XvEKnyayGuE5tt5LA1h4p72ZaHBANvlcZYUxsw/viewform";
export const FORM_NAME    = "entry.1366709707";
export const FORM_PRODUCT = "entry.1513610605";

export const GOODS = [
  { id:1, name:"Ceramic Mug",      emoji:"☕", price:22, desc:"Name printed in Hangul & English", formName:"Ceramic Classic Mug (11oz) - $22", paypalUrl:"https://www.paypal.com/ncp/payment/U2ET4MZXHS8NS", detailUrl:"" },
  { id:2, name:"Embroidered Tote", emoji:"👜", price:32, desc:"Hand-stitched name on cotton bag",  formName:"Embroidered Tote Bag - $32",       paypalUrl:"https://www.paypal.com/ncp/payment/RN7DDTLLT3H9G", detailUrl:"" },
  { id:3, name:"Keychain",         emoji:"🗝️", price:12, desc:"Acrylic charm with your name",      formName:"Acrylic Keychain - $12",           paypalUrl:"https://www.paypal.com/ncp/payment/AN73PNX2KYVZA", detailUrl:"" },
  { id:4, name:"Name Stamp",       emoji:"🪬", price:18, desc:"Traditional ink stamp",             formName:"Name Stamp - $18",                 paypalUrl:"https://www.paypal.com/ncp/payment/3VC6SAYJAREFG", detailUrl:"" },
  { id:5, name:"Silk Pouch",       emoji:"🧧", price:28, desc:"Embroidered on silk fabric",        formName:"Silk Pouch - $28",                 paypalUrl:"https://www.paypal.com/ncp/payment/G2JVST66ECAKY", detailUrl:"" },
  { id:6, name:"Wall Art Print",   emoji:"🖼️", price:38, desc:"Calligraphy art print, A4",        formName:"Wall Art Print (A4) - $38",        paypalUrl:"https://www.paypal.com/ncp/payment/KMH8X43QTQQN4", detailUrl:"" },
];

export const STEPS = [
  { en:"Analyzing your face...",   kr:"얼굴 분석 중..."  },
  { en:"Calculating your Saju...", kr:"사주 계산 중..."  },
  { en:"Crafting your name...",    kr:"이름 짓는 중..."  },
];

export const SPARKLE_POS = [
  { top:"6%",    left:"6%",    size:18, delay:0   },
  { top:"9%",    right:"8%",   size:12, delay:0.4 },
  { top:"18%",   left:"15%",   size:10, delay:0.8 },
  { top:"22%",   right:"4%",   size:20, delay:1.2 },
  { top:"50%",   left:"2%",    size:14, delay:0.6 },
  { top:"65%",   right:"3%",   size:16, delay:1.0 },
  { bottom:"12%",left:"8%",    size:12, delay:0.3 },
  { bottom:"8%", right:"10%",  size:18, delay:0.9 },
];
