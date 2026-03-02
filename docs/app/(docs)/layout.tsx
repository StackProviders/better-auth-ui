import { DocsLayout } from "fumadocs-ui/layouts/docs"
import type { ReactNode } from "react"
import { Bot, Github } from "lucide-react"

import { baseOptions } from "@/app/layout.config"
import { source } from "@/lib/source"

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <DocsLayout
            tree={source.pageTree}
            {...baseOptions}
            sidebar={{
                footer: (
                    <div className="flex flex-col gap-1">
                        <a
                            href="https://github.com/StackProviders/better-auth-ui"
                            className="flex items-center gap-2 p-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Github className="h-4 w-4" />
                            GitHub Repository
                        </a>
                        <a
                            href="/llm.txt"
                            className="flex items-center gap-2 p-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Bot className="h-4 w-4" />
                            AI Documentation (LLM)
                        </a>
                        <div className="px-2 py-1.5 text-[10px] text-muted-foreground uppercase tracking-wider font-medium opacity-70">
                            Built by StackProviders
                        </div>
                    </div>
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
