export const runtime = "edge";

export async function GET() {
  const file = await fetch(new URL("../../../public/og.png", import.meta.url));
  const buffer = await file.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
