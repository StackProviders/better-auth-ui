import { source } from "@/lib/source"

// cached forever
export const revalidate = false

export async function GET() {
    const pages = source.getPages()

    const summary = `# Better Auth UI Documentation

> Plug & play shadcn/ui components for better-auth. The most comprehensive authentication UI library for TypeScript.

## Core Documentation

- [Introduction](/)
- [Installation](/getting-started/installation)
- [Usage](/getting-started/usage)

## Advanced Features

- [Organizations](/advanced/organizations)
- [Multi-Session](/advanced/multi-session)
- [Two-Factor Authentication](/advanced/two-factor-authentication)

## Components

${pages
            .filter(p => p.url.startsWith('/components/'))
            .map(p => `- [${p.data.title}](${p.url}): ${p.data.description}`)
            .join('\n')}

## Full Content
- [Full Documentation](/llms-full.txt): Complete markdown content of all documentation pages for full AI ingestion.
`

    return new Response(summary)
}
