import { createGenerator } from "fumadocs-typescript"
import { AutoTypeTable } from "fumadocs-typescript/ui"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import defaultMdxComponents from "fumadocs-ui/mdx"
import {
    DocsBody,
    DocsDescription,
    DocsPage,
    DocsTitle
} from "fumadocs-ui/page"
import { notFound } from "next/navigation"
import type { ComponentProps } from "react"

import { source } from "@/lib/source"
import { MdxImage, MdxImg } from "@/components/mdx-image";
import { getLLMText } from "@/lib/get-llm-text"
import { CopyAIButton } from "@/components/copy-ai-button"

const generator = createGenerator()

const AutoTypeTableWithGenerator = (
    props: ComponentProps<typeof AutoTypeTable>
) => <AutoTypeTable {...props} generator={generator} />

export default async function Page(props: {
    params: Promise<{ slug?: string[] }>
}) {
    const params = await props.params
    const page = source.getPage(params.slug)

    if (!page) notFound()

    const MDX = page.data.body
    const llmText = await getLLMText(page)

    return (
        <DocsPage full={page.data.full} toc={page.data.toc}>
            <div className="flex flex-row items-center justify-between gap-4">
                <DocsTitle>{page.data.title}</DocsTitle>
                <div className="flex-shrink-0">
                    <CopyAIButton content={llmText} />
                </div>
            </div>

            <DocsDescription>{page.data.description}</DocsDescription>

            <DocsBody>
                <MDX
                    components={{
                        ...defaultMdxComponents,
                        AutoTypeTable: AutoTypeTableWithGenerator,
                        Tab,
                        Tabs,
                        Image: MdxImage,
                        img: MdxImg
                    }}
                />
            </DocsBody>
        </DocsPage>
    )
}

export async function generateStaticParams() {
    return source.generateParams()
}

export async function generateMetadata(props: {
    params: Promise<{ slug?: string[] }>
}) {
    const params = await props.params
    const page = source.getPage(params.slug)

    if (!page) notFound()

    return {
        title: page.data.title,
        description: page.data.description
    }
}
