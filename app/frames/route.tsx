import { createFrames, Button } from "frames.js/next";
import data from "../data.json";
import { baseUrl } from "../constants";

const frames = createFrames({
  baseUrl,
  basePath: "/frames",
});

const handleRequest = frames(async (ctx) => {
  const slug = ctx.searchParams.slug;
  const numParam = ctx.searchParams.num;
  const frame =
    (slug && data.find((frame) => frame.slug === slug)) ||
    data[Math.floor(Math.random() * data.length)]!;

  const maxNum = parseInt(frame.num, 10);
  const num = numParam
    ? parseInt(numParam, 10)
    : Math.floor(Math.random() * maxNum) + 1;

  const sharedUrl = `${baseUrl}/f/${frame.slug}?num=${num}`;
  const shareParams = new URLSearchParams();
  shareParams.set(
    "text",
    "Every Single Frame by @ds8\n\nBeautiful frames from visual masterpieces"
  );
  shareParams.set("url", sharedUrl);
  const shareUrl = `https://warpcast.com/~/compose?${shareParams.toString()}`;
  return {
    image: `${frame.baseUrl}${num}${frame.ext ?? ".jpg"}`,
    buttons: [
      <Button
        action="post"
        target={{ pathname: "/", query: { slug: frame.slug } }}
      >
        {`${frame.title} - Random`}
      </Button>,
      <Button action="post" target={{ pathname: "/" }}>
        Random
      </Button>,
      <Button action="link" target={shareUrl}>
        Share
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
