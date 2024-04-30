import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import { baseUrl } from "./frames/route";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Every Single Frame by ds8",
    description: "Frames from visual masterpieces",
    other: {
      ...(await fetchMetadata(new URL("/frames", baseUrl))),
    },
  };
}

export default async function Home() {
  return (
    <div
      style={{
        width: "100vw",
        whiteSpace: "pre-wrap",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <a href="https://www.everysingleframe.com/">Every Single Frame</a>
        <br />
        <br />
        Frame by <a href="https://warpcast.com/ds8">ds8</a>
      </div>
    </div>
  );
}
