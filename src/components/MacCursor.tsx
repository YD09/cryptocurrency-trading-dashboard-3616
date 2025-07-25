import { useEffect, useRef, useState } from "react";

const CURSOR_SIZE = 32;
const CURSOR_THUMB_SIZE = 44;

export default function MacCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!enabled) {
      document.body.style.cursor = "";
      if (cursorRef.current) cursorRef.current.style.display = "none";
      return;
    }
    document.body.style.cursor = "none";
    if (cursorRef.current) cursorRef.current.style.display = "block";

    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - CURSOR_SIZE / 2}px, ${e.clientY - CURSOR_SIZE / 2}px, 0)`;
      }
    };
    window.addEventListener("mousemove", move);

    // Interactive hover effect
    const onMouseOver = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      const target = e.target as HTMLElement;
      if (target.closest("button, a, input, select, textarea, [role='button'], [tabindex]:not([tabindex='-1'])")) {
        cursorRef.current.classList.add("mac-cursor-thumb");
        target.classList.add("mac-cursor-glow");
      }
    };
    const onMouseOut = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      cursorRef.current.classList.remove("mac-cursor-thumb");
      document.querySelectorAll(".mac-cursor-glow").forEach(el => el.classList.remove("mac-cursor-glow"));
    };
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.body.style.cursor = "";
    };
  }, [enabled]);

  return (
    <>
      <div
        ref={cursorRef}
        className="mac-cursor"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.85)",
          boxShadow: "0 2px 16px 2px rgba(0,0,0,0.25)",
          pointerEvents: "none",
          zIndex: 99999,
          transition: "width 0.18s, height 0.18s, background 0.18s, box-shadow 0.18s",
          mixBlendMode: "exclusion",
        }}
      />
      <button
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 100000,
          background: "#222",
          color: "#fff",
          border: "none",
          borderRadius: 16,
          padding: "8px 16px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        onClick={() => setEnabled((v) => !v)}
      >
        {enabled ? "Disable" : "Enable"} macOS Cursor
      </button>
      <style>{`
        .mac-cursor-thumb {
          width: ${CURSOR_THUMB_SIZE}px !important;
          height: ${CURSOR_THUMB_SIZE}px !important;
          background: #111 !important;
          box-shadow: 0 0 0 4px #222, 0 2px 16px 2px rgba(0,0,0,0.25) !important;
        }
        .mac-cursor-glow {
          box-shadow: 0 0 0 4px #222, 0 2px 16px 2px rgba(0,0,0,0.25) !important;
          transition: box-shadow 0.18s;
        }
      `}</style>
    </>
  );
} 