import { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error(error, info);
    const msg = `💥 화면 렌더링 크래시: ${error.message}\n${error.stack?.slice(0, 300) || ""}\n${new Date().toLocaleString("ko-KR")}`;
    const params = new URLSearchParams({ title: "K-MY NAME 크래시", priority: "high", tags: "boom" });
    navigator.sendBeacon(`https://ntfy.sh/kmyname-errors-sunny?${params}`, new Blob([msg], { type: "text/plain" }));
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 14,
          background: "linear-gradient(145deg, #6d28d9 0%, #7c3aed 30%, #a855f7 65%, #8b5cf6 100%)",
          color: "#fff", textAlign: "center", padding: 24, boxSizing: "border-box",
        }}>
          <div style={{ fontSize: 48 }}>😓</div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Something went wrong</div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>문제가 발생했어요. 다시 시도해주세요.</div>
          <button onClick={() => window.location.reload()} style={{
            background: "#fff", color: "#7c3aed", border: "none",
            borderRadius: 12, padding: "12px 28px", fontSize: 15,
            fontWeight: 700, cursor: "pointer", marginTop: 8,
          }}>
            🔄 Reload · 새로고침
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
