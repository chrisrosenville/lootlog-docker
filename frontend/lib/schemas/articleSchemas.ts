import z from "zod";

export const dropZoneConfig = {
  maxFiles: 1,
  maxSize: 1024 * 1024 * 4,
  multiple: false,
};

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const newArticleSchema = z.object({
  title: z.string().min(10).max(100),
  categoryName: z.string(),
  image: z
    .any()
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported",
    ),
  body: z.string(),
});

export const existingArticleSchema = z.object({
  id: z.number(),
  title: z.string().min(10).max(100),
  categoryName: z.string(),
  image: z
    .any()
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported",
    ),
  body: z.string(),
  isPublic: z.boolean(),
  isFeatured: z.boolean(),
  YTVideoId: z.string().optional(),
});
