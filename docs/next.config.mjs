import { createMDX } from "fumadocs-mdx/next"

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    output: "export",
    basePath: process.env.NODE_ENV === "production" && !process.env.GITHUB_PAGES_CUSTOM_DOMAIN ? "/better-auth-ui" : "",
    images: { unoptimized: true }
}

export default withMDX(config)
