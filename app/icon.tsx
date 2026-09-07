import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Same sparkle mark as components/brand/logo-mark.tsx, on the app's own
// dark background — ImageResponse can't import a React component that
// renders plain SVG props the way the browser does, so the path is
// duplicated here rather than shared.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#16130e",
          borderRadius: 6,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#c2540e">
          <path d="M12 2 L14.2 9.8 L22 12 L14.2 14.2 L12 22 L9.8 14.2 L2 12 L9.8 9.8 Z" />
        </svg>
      </div>
    ),
    size,
  );
}
