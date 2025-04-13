"use client";
import { useState } from "react";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Button } from "../ui/button";
import { apiClient } from "@/utils/apiClient";
import { IArticle } from "@/types/article.types";
import { useAuthStore } from "@/store/auth-store";
import { FormItem } from "./ui/FormItem";
import { FormLabel } from "./ui/FormLabel";
import { FormItemDescription } from "./ui/FormItemDescription";
import { ArticleStatusEnum } from "@/types/articleStatus.types";
import { resizeImageAndConvertToBlob } from "@/utils/image";
import toast from "react-hot-toast";

const DynamicArticleEditor = dynamic(
  () => import("../editor/ArticleEditor").then((mod) => mod.ArticleEditor),
  {
    ssr: false,
  },
);

interface Props {
  articleProp?: IArticle;
}

type FormInputs = {
  title: string;
  categoryName: string;
  image: File[] | string | null;
  body: string;
};

export const UpdateArticleForm = ({ articleProp }: Props) => {
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (user) {
        const res = await apiClient.fetch("/categories", {
          method: "GET",
        });
        return res;
      }
    },
  });

  const { control, handleSubmit, watch, setValue } = useForm<FormInputs>({
    defaultValues: {
      title: articleProp?.title || "",
      categoryName: articleProp?.category?.name || "",
      image: articleProp?.image.url || null,
      body: articleProp?.body || "",
    },
  });

  const image = watch("image");

  const handleFormSubmit = async (data: FormInputs) => {
    setIsLoading(true);
    let imageToUpload: File | string | null = null;

    if (typeof data.image !== "string" && data.image) {
      const blob = await resizeImageAndConvertToBlob(data.image[0]);
      if (blob) {
        imageToUpload = new File([blob], data.image[0].name, {
          type: data.image[0].type,
        });
      }
    } else if (typeof data.image === "string") {
      imageToUpload = data.image;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("categoryName", data.categoryName);
    formData.append("body", data.body);

    if (imageToUpload) {
      formData.append("image", imageToUpload);
    }

    try {
      const res = await apiClient.fetch(`/articles/${articleProp?.id}`, {
        method: "PUT",
        body: formData,
      });

      console.log("Form response:", res);

      if (res.OK) {
        toast.success("Article updated successfully", {
          position: "top-center",
        });
        router.push("/dashboard/author/my-articles");
      } else {
        toast.error(res.message, {
          position: "top-center",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          position: "top-center",
        });
        queryClient.invalidateQueries({
          queryKey: ["articles", user?.id],
        });
      } else {
        toast.error("An unexpected error occurred", {
          position: "top-center",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mx-auto max-w-3xl space-y-2 py-10"
    >
      <FormItem>
        <FormLabel>Title</FormLabel>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input placeholder="" type="text" {...field} />
          )}
        />
        <FormItemDescription>{"The article's headline"}</FormItemDescription>
      </FormItem>

      <FormItem>
        <FormLabel>Category</FormLabel>
        <Controller
          name="categoryName"
          control={control}
          render={({ field }) => (
            <Select
              required
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800">
                {categoriesQuery.data?.categories &&
                  categoriesQuery.data?.categories.map((category) => (
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
          )}
        />
        <FormItemDescription>{"The article's category"}</FormItemDescription>
      </FormItem>

      <FormItem>
        <FormLabel>Image</FormLabel>
        <div className="flex w-full items-center justify-center">
          {(!image || image.length === 0) && (
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
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
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
                    setValue("image", [file]);
                  }
                }}
              />
            </label>
          )}
          {image && image[0] && (
            <div className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-400 bg-neutral-800 hover:bg-neutral-700">
              <div className="relative h-full w-full">
                <Image
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image[0])
                  }
                  alt="Article image"
                  fill
                  className="object-cover"
                  onClick={() => {
                    setValue("image", null);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </FormItem>

      <FormItem>
        <FormLabel>Body</FormLabel>
        <Controller
          name="body"
          control={control}
          render={({ field }) => (
            <DynamicArticleEditor
              key={field.name}
              articleBody={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <FormItemDescription>{"The article's body"}</FormItemDescription>
      </FormItem>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};
