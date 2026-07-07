import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "EBH Training Academy - Premium Training Room, Meeting Room and Workspace Rental";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #061A3A 0%, #0B2A5B 55%, #C9972B 100%)",
          color: "white",
          padding: "64px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: "0.08em",
            }}
          >
            EBH TRAINING ACADEMY
          </div>

          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.35)",
              borderRadius: 999,
              padding: "14px 26px",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            Workspace for Rent
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#FFD36A",
              fontSize: 28,
              fontWeight: 800,
              marginBottom: 18,
            }}
          >
            Training Room • Meeting Room • Consultant Room
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 950,
              lineHeight: 1.05,
              maxWidth: 980,
            }}
          >
            Premium Space untuk Kursus, Meeting & Coaching
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 30,
              lineHeight: 1.35,
              maxWidth: 900,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Tempah ruang profesional dengan mudah — sesuai untuk kelas, seminar
            kecil, private consultation dan mesyuarat.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 18,
            alignItems: "center",
            fontSize: 26,
            fontWeight: 800,
          }}
        >
          <div
            style={{
              display: "flex",
              background: "#FFD36A",
              color: "#061A3A",
              borderRadius: 18,
              padding: "18px 28px",
            }}
          >
            Book Online Now
          </div>

          <div
            style={{
              display: "flex",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Seri Kembangan • Selangor
          </div>
        </div>
      </div>
    ),
    size
  );
}