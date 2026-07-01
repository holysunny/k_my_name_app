/* 인앱 브라우저 타입 감지 (모듈 레벨 - 한 번만 실행) */
const _ua = navigator.userAgent || "";
export const IS_IOS = /iPhone|iPad|iPod/i.test(_ua);
export const IAB_TYPE = /KAKAOTALK/i.test(_ua) ? "kakao"
  : /Instagram/i.test(_ua)              ? "instagram"
  : /FBAN|FBAV/i.test(_ua)             ? "facebook"
  : /Line\//i.test(_ua)                ? "line"
  : /NAVER|NaverApp/i.test(_ua)        ? "naver"
  : null;
