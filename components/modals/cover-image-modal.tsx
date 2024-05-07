"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "../single-image-dropzone";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { updateDocument } from "@/convex/documents";

export const CoverImageModal = () => {
  const params = useParams(); // Get the params from the hook
  const updateDoc = useMutation(api.documents.updateDocument); // Use the update document mutation
  const [file, setFile] = useState<File>(); // Set the file to null
  const [isSubmitting, setIsSubmitting] = useState(false); // Set the submitting state to false
  const coverImage = useCoverImage(); // Get the cover image from the hook
  const { edgestore } = useEdgeStore(); // Get the edgestore from the hook

  //handles the event of the modal being closed, resets the file and submitting state, and closes the cover image modal.
  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  //handles the event of the file being changed, sets the submitting state to true, sets the file to the file, uploads the file to the public files, updates the document with the cover image, and closes the cover image modal.
  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true); // Set the submitting state to true
      setFile(file); // Set the file to the file

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url,// Replace the target URL with the cover image URL
        },
      });

      // Update the document with the cover image
      await updateDoc({
        id: params.documentId as Id<"documents">,
        coverImage: res.url,
      });

      onClose(); // Close the cover image modal
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader className="text-center text-lg font-semibold">
          <h2>Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};
