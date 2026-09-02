import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

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
          background: "#090D17",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: 4,
            height: 16,
            borderRadius: 9999,
            background: "#9146E8",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
