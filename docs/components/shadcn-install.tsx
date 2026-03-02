"use client"

import { Tab, Tabs } from "fumadocs-ui/components/tabs"

interface ShadcnInstallProps {
    /**
     * The name of the registry item (e.g., 'auth', 'org') or a full URL.
     */
    name: string
}

export function ShadcnInstall({ name }: ShadcnInstallProps) {
    const isUrl = name.startsWith("http");
    const url = isUrl ? name : `https://stackproviders.github.io/better-auth-ui/r/${name}.json`;

    const commands = {
        pnpm: `pnpm dlx shadcn@latest add ${url}`,
        npm: `npx shadcn@latest add ${url}`,
        yarn: `yarn dlx shadcn@latest add ${url}`,
        bun: `bun x shadcn@latest add ${url}`
    };

    return (
        <Tabs items={["pnpm", "npm", "yarn", "bun"]}>
            <Tab value="pnpm">
                <pre className="bg-transparent! !p-0">
                    <code className="language-bash">{commands.pnpm}</code>
                </pre>
            </Tab>
            <Tab value="npm">
                <pre className="bg-transparent! !p-0">
                    <code className="language-bash">{commands.npm}</code>
                </pre>
            </Tab>
            <Tab value="yarn">
                <pre className="bg-transparent! !p-0">
                    <code className="language-bash">{commands.yarn}</code>
                </pre>
            </Tab>
            <Tab value="bun">
                <pre className="bg-transparent! !p-0">
                    <code className="language-bash">{commands.bun}</code>
                </pre>
            </Tab>
        </Tabs>
    );
}
