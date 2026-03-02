import { DocsLayout } from "fumadocs-ui/layouts/docs"
import type { ReactNode } from "react"
import { Bot } from "lucide-react"

import { baseOptions } from "@/app/layout.config"
import { source } from "@/lib/source"

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <DocsLayout
            tree={source.pageTree}
            {...baseOptions}
            sidebar={{
                footer: (
                    <a
                        href="/llm.txt"
                        className="flex items-center gap-2 p-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Bot className="h-4 w-4" />
                        AI Documentation (LLM)
                    </a>
                )
            }}
            themeSwitch={{
                mode: "light-dark-system"
            }}
        >
            {children}
        </DocsLayout>
    )
}
