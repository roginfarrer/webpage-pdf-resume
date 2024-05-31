import { defineCollection, z } from "astro:content";

const letters = defineCollection({
  type: "content",
  schema: z.object({
    company: z.string(),
    title: z.string(),
  }),
});

export const collections = { letters };
