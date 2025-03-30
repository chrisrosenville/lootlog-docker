"use client";
import { ChangeEvent, useEffect, useState } from "react";

import Image from "next/image";
import dynamic from "next/dynamic";

import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { getCategories } from "@/lib/db/categories";
import { updateArticle } from "@/lib/db/articles";

import { existingArticleSchema } from "@/lib/schemas/articleSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Button } from "../ui/button";
import { TArticle } from "@/types/article.types";
import { Message } from "../ui/message";

const DynamicArticleEditor = dynamic(
  () => import("../editor/ArticleEditor").then((mod) => mod.ArticleEditor),
  {
    ssr: false,
  },
);

type Props = {
  article: TArticle;
};

export const UpdateArticleForm = ({ article }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [imageState, setImageState] = useState<string | null | undefined>(null);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getCategories(),
  });

  const form = useForm<z.infer<typeof existingArticleSchema>>({
    resolver: zodResolver(existingArticleSchema),
    defaultValues: {
      id: (article.id ??= 0),
      title: (article.title ??= ""),
      categoryName: article.category?.name ?? "",
      image: null,
      body: (article.body ??= ""),
      isPublic: (article.isPublic ??= false),
      isFeatured: (article.isFeatured ??= false),
      YTVideoId: (article.YTVideoId ??= ""),
    },
  });

  const handleImageSelect = () => {
    document.getElementById("hidden-image-input")?.click();
  };

  const imageLoader = (evt: ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.files);

    if (evt.target.files?.length) {
      setImageState(URL.createObjectURL(evt.target.files[0]));
      form.setValue("image", evt.target.files[0]);
    }

    return;
  };

  async function onSubmit(values: z.infer<typeof existingArticleSchema>) {
    const res = await updateArticle(values);

    if (res?.ok) window.location.href = "/dashboard/author/my-articles";
    else {
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (res.status === 413) setErrorMessage("The image is too large");
      else setErrorMessage(res.statusText);
    }

    return;
  }

  useEffect(() => {
    if (!imageState && article.image) {
      setImageState(article.image.url);
      form.setValue("image", article.image);
    }
  }, [article.image, form, imageState]);

  return (
    <>
      {errorMessage && <Message type="error" message={errorMessage} />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto max-w-3xl space-y-2 py-10"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" {...field} />
                </FormControl>
                <FormDescription>{"The article's headline"}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  required
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-neutral-800">
                    {categories?.map((category) => (
                      <SelectItem
                        className="capitalize focus:bg-neutral-700"
                        value={category.name}
                        key={category.id}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the category your article belongs to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <input
                  type="file"
                  className="hidden"
                  id="hidden-image-input"
                  onChange={(evt) => imageLoader(evt)}
                />
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <div className="relative aspect-video w-full">
                    <div className="absolute inset-0 z-50 flex h-full w-full items-center justify-center">
                      <Button
                        type="button"
                        onClick={handleImageSelect}
                        className="shadow-sm"
                      >
                        Change image
                      </Button>
                    </div>
                    <Image
                      className="object-cover object-center"
                      src={imageState ?? "/images/placeholder.webp"}
                      alt=""
                      fill
                      priority
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  {"This will be the article's cover image"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body</FormLabel>
                <FormControl>
                  <DynamicArticleEditor
                    articleBody={field.value}
                    // onChange={(text) => field.onChange(text)}
                    onChange={(text) => field.onChange(text)}
                  />
                </FormControl>
                <FormDescription>Article body</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update</Button>
        </form>
      </Form>
    </>
  );
};
