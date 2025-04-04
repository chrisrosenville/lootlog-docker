"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";

import { toast } from "react-hot-toast";

import { apiClient } from "@/utils/apiClient";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormItem } from "@/components/forms/ui/FormItem";
import { FormLabel } from "@/components/forms/ui/FormLabel";
import { FormItemDescription } from "./ui/FormItemDescription";
import { ICategory } from "@/types/category.types";
import { useAuthStore } from "@/store/auth-store";
const DynamicArticleEditor = dynamic(
  () => import("../editor/ArticleEditor").then((mod) => mod.ArticleEditor),
  {
    ssr: false,
  },
);

export const dropZoneConfig = {
  maxFiles: 1,
  maxSize: 1024 * 1024 * 4,
  multiple: false,
};

export const ArticleForm = () => {
  const user = useAuthStore((state) => state.user);

  const [title, setTitle] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [images, setImages] = useState<File[] | null>([]);
  const [body, setBody] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  console.log(images);

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (user) {
        const res = await apiClient.fetch("/categories/all", {
          method: "GET",
        });
        console.log(res);
        return res;
      }
    },
  });

  async function handleFormSubmit() {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await apiClient.fetch("/articles", {
        method: "POST",
        body: JSON.stringify({ title, categoryName, images, body }),
      });

      if (res.OK) {
        toast.success(res.message, { position: "top-center" });
        router.push("/dashboard/author/my-articles");
        return;
      }

      toast.error(res.message, { position: "top-center" });
    } catch (error) {
      console.error("Form error:", error);
      toast.error(
        <p className="text-neutral-950">
          An unknown error occurred. Please try again later.
        </p>,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleFormSubmit}
        className="mx-auto max-w-3xl space-y-2 py-10"
      >
        <FormItem>
          <FormLabel>Title</FormLabel>
          <Input
            placeholder=""
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FormItemDescription>{"The article's headline"}</FormItemDescription>
        </FormItem>

        <FormItem>
          <FormLabel>Title</FormLabel>
          <Select
            required
            onValueChange={setCategoryName}
            defaultValue={categoryName}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800">
              {data?.categories?.map((category: ICategory) => (
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
          <FormItemDescription>{"The article's headline"}</FormItemDescription>
        </FormItem>

        <FormItem>
          <FormLabel>Image</FormLabel>
          <div className="flex w-full items-center justify-center">
            {images?.length === 0 && (
              <label
                htmlFor="dropzone-file"
                className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-400 bg-neutral-800 hover:bg-neutral-700"
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <svg
                    className="mb-4 h-8 w-8 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImages([file]);
                    }
                  }}
                />
              </label>
            )}
            {images && images[0] && (
              <div className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-400 bg-neutral-800 hover:bg-neutral-700">
                <div key={images[0].name} className="relative h-full w-full">
                  <Image
                    src={URL.createObjectURL(images[0])}
                    alt="Article image"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </FormItem>

        <FormItem>
          <FormLabel>Body</FormLabel>
          <DynamicArticleEditor
            articleBody={body}
            onChange={(text) => setBody(text)}
          />
          <FormItemDescription>{"The article's body"}</FormItemDescription>
        </FormItem>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </>
  );
};
