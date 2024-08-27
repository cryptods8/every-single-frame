import { createFrames, Button } from "frames.js/next";
import data from "../data.json";
import { baseUrl } from "../constants";
import { validateFrameMessage } from "frames.js";
import { FramesMiddleware } from "frames.js/types";

const airstackApiKey = process.env["AIRSTACK_API_KEY"];

const hubHttpUrl = airstackApiKey
  ? "https://hubs.airstack.xyz"
  : process.env["FRAME_HUB_HTTP_URL"] || "http://localhost:3010/hub";
const hubRequestOptions = airstackApiKey
  ? {
      headers: { "x-airstack-hubs": airstackApiKey },
    }
  : undefined;

const validationMiddleware: FramesMiddleware<any, {}> = async (ctx, next) => {
  const { request } = ctx;
  if (request.method !== "POST") {
    return next();
  }

  request
    .clone()
    .json()
    .then((payload) =>
      validateFrameMessage(payload, {
        hubHttpUrl,
        hubRequestOptions,
      })
    )
    .catch((error) => {
      console.error("validation error", error);
    });

  return next();
};

const frames = createFrames({
  baseUrl,
  basePath: "/frames",
  middleware: [validationMiddleware],
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
  shareParams.set("embeds[]", sharedUrl);
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
