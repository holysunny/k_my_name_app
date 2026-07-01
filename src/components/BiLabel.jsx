/* EN 메인 / KR 보조 텍스트 컴포넌트 (원본에 있었으나 사용처는 없음 - 삭제하지 않고 그대로 이동) */
export default function BiLabel({ en, kr, enStyle={}, krStyle={} }) {
  return (
    <div>
      <span style={enStyle}>{en}</span>
      <span style={{ display:"block", opacity:0.45, fontSize:"0.85em", marginTop:1, ...krStyle }}>{kr}</span>
    </div>
  );
}
