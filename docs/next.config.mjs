import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const isProd = process.env.NODE_ENV === "production";
const hasCustomDomain =
  process.env.GITHUB_PAGES_CUSTOM_DOMAIN &&
  process.env.GITHUB_PAGES_CUSTOM_DOMAIN !== "";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "export",
  basePath: isProd && !hasCustomDomain ? "/better-auth-ui" : "",
  images: { unoptimized: true },
};

export default withMDX(config);
