"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface BannerProps {
  documentId: Id<"documents">;
}

export const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();

  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  // Function to remove the document with the specified ID and show a toast message when the operation is complete and redirect to the documents page
  const onRemove = () => {
    const promise = remove({ id: documentId });
    // Show a toast message while the operation is in progress
    toast.promise(promise, {
      loading: "Removing document...",
      success: "Document removed successfully!",
      error: "Failed to remove document.",
    });
    // Redirect to the documents page
    router.push("/documents");
  };

  // Function to restore the document with the specified ID and show a toast message when the operation is complete
  const onRestore = () => {
    const promise = restore({ id: documentId });
    // Show a toast message while the operation is in progress
    toast.promise(promise, {
      loading: "Restoring document...",
      success: "Document restored successfully!",
      error: "Failed to restore document.",
    });
  };

  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>This document has been deleted. Do you want to restore it?</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};
