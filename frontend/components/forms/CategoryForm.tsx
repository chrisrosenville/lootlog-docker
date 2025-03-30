"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { toast } from "sonner";

import { TCategory } from "@/types/article.types";
import { createCategory, updateCategory } from "@/lib/db/categories";
import { newCategorySchema } from "@/lib/schemas/categorySchemas";

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
import { Button } from "../ui/button";

type Props = {
  existingCategory?: TCategory;
};

export const CategoryForm = ({ existingCategory }: Props) => {
  const [statusMessage, setStatusMessage] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof newCategorySchema>>({
    resolver: zodResolver(newCategorySchema),
    defaultValues: {
      name: existingCategory?.name ?? "",
    },
  });

  const handleResponse = async (res: Response | null) => {
    if (res?.ok) {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      window.location.href = "/dashboard/admin/categories";
    } else {
      const status = await res?.json();
      setStatusMessage([status.message]);
    }
  };

  async function onSubmit(values: z.infer<typeof newCategorySchema>) {
    if (!existingCategory) {
      try {
        const res = await createCategory(values);
        await handleResponse(res);
        return;
      } catch (err) {
        console.error("Error creating category:", err);
        toast.error(
          <p className="text-neutral-950">
            An unknown error occurred. Please try again later.
          </p>,
        );
        return;
      }
    }

    if (existingCategory.id) {
      try {
        const res = await updateCategory({
          ...existingCategory,
          name: values.name,
        });

        await handleResponse(res);
        return;
      } catch (err) {
        console.error("Error updating category:", err);
        toast.error(
          <p className="text-neutral-950">
            An unknown error occurred. Please try again later.
          </p>,
        );
        return;
      }
    }
  }

  return (
    <Form {...form}>
      {statusMessage.length > 0 &&
        statusMessage.map((msg, index) => (
          <p key={index} className="form-error-message">
            {msg}
          </p>
        ))}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-2 py-10"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="" type="text" {...field} />
              </FormControl>
              <FormDescription>{"The category's name"}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {existingCategory?.name ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
};
