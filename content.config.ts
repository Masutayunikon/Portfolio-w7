// content.config.ts
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            type: 'page',
            source: 'blog/*.md',
            schema: z.object({
                title: z.string(),
                description: z.string().optional(),
                cover: z.string().url().optional(), // image de couverture
                date: z.string().datetime(), // ISO date
                tags: z.array(z.string()).optional(),
                draft: z.boolean().default(false), // pour cacher certains articles
            })
        }),
        projects: defineCollection({
            type: 'page',
            source: 'projects/*.md',
            schema: z.object({
                title: z.string(),
                description: z.string().optional(),
                cover: z.string().url().optional(),
                repo: z.string().url().optional(), // lien GitHub
                demo: z.string().url().optional(), // lien vers une démo en ligne
                tech: z.array(z.string()).optional(), // stack utilisée
                date: z.string().datetime().optional(),
            })
        })
    }
})
