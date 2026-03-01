import NextImage from "next/image";
import { withBase } from "@/lib/config";
import type { ComponentProps } from "react";

export function MdxImage({ src, ...props }: ComponentProps<typeof NextImage>) {
    const prefixedSrc = typeof src === "string" ? withBase(src) : src;
    return <NextImage {...props} src={prefixedSrc} />;
}

export function MdxImg({ src, ...props }: ComponentProps<"img">) {
    const prefixedSrc = src && typeof src === "string" ? withBase(src) : (src as any);
    return <img {...props} src={prefixedSrc} />;
}
