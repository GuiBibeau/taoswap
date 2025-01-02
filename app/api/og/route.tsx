import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(to bottom right, #23268F, #0C0C36, #0D0D33)",
          padding: "40px",
        }}
      >
        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              background: "linear-gradient(to bottom, #FFFFFF, #999999)",
              backgroundClip: "text",
              color: "transparent",
              margin: "0",
              textAlign: "center",
              lineHeight: "1.2",
            }}
          >
            τaoSwap:
            <br />
            Bittensor&apos;s DeFi Hub
          </h1>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "24px",
            color: "#999999",
            textAlign: "center",
            maxWidth: "800px",
            marginTop: "24px",
          }}
        >
          The first DEX built on Bittensor, enabling secure TAO trading and DeFi
          opportunities
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
