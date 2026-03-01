export const isProd = process.env.NODE_ENV === "production";
export const hasCustomDomain = process.env.GITHUB_PAGES_CUSTOM_DOMAIN && process.env.GITHUB_PAGES_CUSTOM_DOMAIN !== "";
export const basePath = isProd && !hasCustomDomain ? "/better-auth-ui" : "";

export function withBase(path: string) {
    if (!path.startsWith("/") || path.startsWith("http") || path.startsWith("//")) {
        return path;
    }
    if (path.startsWith(basePath + "/") || path === basePath) {
        return path;
    }
    return `${basePath}${path}`;
}
