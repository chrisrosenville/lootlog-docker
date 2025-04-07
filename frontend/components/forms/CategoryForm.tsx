"use client";
import { useState } from "react";

import { toast } from "react-hot-toast";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { apiClient } from "@/utils/apiClient";
import { useRouter } from "next/navigation";

import { FormItem } from "@/components/forms/ui/FormItem";
import { FormLabel } from "@/components/forms/ui/FormLabel";

export const CategoryForm = () => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Creating category:", categoryName);
      const res = await apiClient.fetch("/categories", {
        method: "POST",
        body: JSON.stringify({ categoryName }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.OK) {
        toast.success("The category has been created", {
          position: "top-center",
        });
        router.push("/dashboard/admin/manage-categories");
        return;
      }

      toast.error(res.message, {
        position: "top-center",
      });
      return;
    } catch (error) {
      console.error("Form error:", error);
      toast.error("An unknown error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-auto max-w-3xl space-y-2 py-10"
    >
      <FormItem>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder=""
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </FormItem>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};
