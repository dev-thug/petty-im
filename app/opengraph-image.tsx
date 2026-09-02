import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#090D17",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 96, color: "#F5F6FA", fontWeight: 700 }}>
            petty
          </span>
          <div
            style={{
              width: 10,
              height: 64,
              borderRadius: 9999,
              background: "#9146E8",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
