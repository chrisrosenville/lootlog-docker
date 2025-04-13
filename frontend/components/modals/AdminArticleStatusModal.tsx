import { useAdminArticleModalStore } from "@/store/admin-article-modal-store";
import { ArticleStatusEnum } from "@/types/articleStatus.types";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { apiClient } from "@/utils/apiClient";
import { FormItem } from "../forms/ui/FormItem";
import { FormLabel } from "../forms/ui/FormLabel";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface AdminArticleStatusModalProps {
  onDismiss: () => void;
}

export const AdminArticleStatusModal = ({
  onDismiss,
}: AdminArticleStatusModalProps) => {
  const { articleId, currentStatus } = useAdminArticleModalStore();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ArticleStatusEnum>(
    currentStatus as ArticleStatusEnum,
  );

  const queryClient = useQueryClient();

  const handleStatusUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (articleId) {
      const res = await apiClient.fetch(`/articles/status/${articleId}`, {
        method: "PUT",
        body: JSON.stringify({
          status: newStatus,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.OK) {
        toast.success(res.message, { position: "top-center" });
        queryClient.invalidateQueries({ queryKey: ["articles"] });
        onDismiss();
      } else {
        toast.error(res.message, { position: "top-center" });
      }
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div onClick={handleModalClick} onMouseDown={handleModalClick}>
      <h2 className="mb-4 text-xl font-semibold">Update Article Status</h2>

      <div className="flex flex-col gap-4">
        <FormItem>
          <FormLabel>Current Status</FormLabel>
          <div className="rounded-md bg-neutral-700 px-3 py-1.5 capitalize">
            {currentStatus?.toLowerCase()}
          </div>
        </FormItem>

        <form onSubmit={handleStatusUpdate} className="z-[200]">
          <FormItem>
            <FormLabel>New Status</FormLabel>
            <Select
              open={isSelectOpen}
              onOpenChange={setIsSelectOpen}
              onValueChange={(value) => {
                setNewStatus(value as ArticleStatusEnum);
                setIsSelectOpen(false);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent
                className="z-[200]"
                onCloseAutoFocus={(e) => {
                  e.preventDefault();
                }}
              >
                {Object.values(ArticleStatusEnum).map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    disabled={status === currentStatus}
                    className="capitalize"
                  >
                    {status.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>

          <div className="mt-4 flex justify-end space-x-2">
            <Button type="button" onClick={onDismiss}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange700">
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
