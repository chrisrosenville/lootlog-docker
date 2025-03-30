"use client";
import { useState } from "react";

import dynamic from "next/dynamic";

import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/lib/db/categories";
import { createArticle } from "@/lib/db/articles";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { dropZoneConfig, newArticleSchema } from "@/lib/schemas/articleSchemas";
import { Message } from "../ui/message";

const DynamicArticleEditor = dynamic(
  () => import("../editor/ArticleEditor").then((mod) => mod.ArticleEditor),
  {
    ssr: false,
  },
);

export const ArticleForm = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [files, setFiles] = useState<File[] | null>(null);

  const form = useForm<z.infer<typeof newArticleSchema>>({
    resolver: zodResolver(newArticleSchema),
    defaultValues: {
      title: "",
      categoryName: "",
      image: {},
      body: "",
    },
  });

  async function onSubmit(values: z.infer<typeof newArticleSchema>) {
    try {
      const res = await createArticle(values);

      console.log("Form response:", res);

      if (res?.ok) {
        toast.success(
          <p className="text-neutral-950">Article has been created</p>,
        );
        window.location.href = "/dashboard/author/my-articles";
        return;
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });

        if (res.status === 413) setErrorMessage("The image is too large");
        else setErrorMessage(res.statusText);
      }
    } catch (error) {
      console.error("Form error:", error);
      toast.error(
        <p className="text-neutral-950">
          An unknown error occurred. Please try again later.
        </p>,
      );
    }
  }

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
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <FileUploader
                    value={files}
                    onValueChange={(img) => {
                      setFiles(img);
                      field.onChange(img);
                    }}
                    dropzoneOptions={dropZoneConfig}
                    className="relative rounded-lg bg-neutral-800 p-2"
                  >
                    <FileInput
                      id="fileInput"
                      className="outline-dashed outline-1 outline-slate-500"
                    >
                      <div className="flex w-full flex-col items-center justify-center p-8">
                        <CloudUpload className="h-10 w-10 text-gray-500" />
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp; or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          JPG, JPEG, PNG or WEBP
                        </p>
                      </div>
                    </FileInput>
                    <FileUploaderContent>
                      {files &&
                        files.length > 0 &&
                        files.map((file, i) => (
                          <FileUploaderItem
                            key={i}
                            index={i}
                            className="hover:bg-neutral-700"
                          >
                            <Paperclip className="h-4 w-4 stroke-current" />
                            <span>{file.name}</span>
                          </FileUploaderItem>
                        ))}
                    </FileUploaderContent>
                  </FileUploader>
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
};
