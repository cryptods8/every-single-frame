import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";

import data from "../../data.json";
import { baseUrl } from "@/app/frames/route";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { num: string };
}): Promise<Metadata> {
  const frame = data.find((frame) => frame.slug === params.slug);
  if (!frame) {
    return {
      title: "Every Single Frame",
      description: "Frames from visual masterpieces",
    };
  }
  const queryParams = new URLSearchParams();
  queryParams.set("slug", frame.slug);
  if (searchParams.num) {
    queryParams.set("num", searchParams.num);
  }
  return {
    title: `Every Single Frame - ${frame.title}`,
    description: `Frames from ${frame.title}`,
    other: {
      ...(await fetchMetadata(
        new URL(`/frames?${queryParams.toString()}`, baseUrl)
      )),
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
