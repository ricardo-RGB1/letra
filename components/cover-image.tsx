"use client";

import { cn } from "@/lib/utils";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "./ui/skeleton";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

export const CoverImage = ({ url, preview }: CoverImageProps) => {
  const { edgestore } = useEdgeStore();
  const params = useParams();
  const coverImage = useCoverImage();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);

    // Remove the cover image from the Edge Store if it exists in the Edge Store
  const onRemove = async () => { 
    if (url) {  
     await edgestore.publicFiles.delete({ 
        url: url,
      });
    }
    // this only runs if the image is removed from the Edge Store
    removeCoverImage({
      id: params.documentId as Id<"documents">,
    });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {/* IMAGE */}
      {!!url && (
        <Image src={url} fill alt="Cover image" className="object-cover" />
      )}
      {/* ACTIONS: CHANGE OR REMOVE  */}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverImage.onReplace(url)} // open the modal and set the url
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change cover
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};


CoverImage.Skeleton = function CoverImageSkeleton() {
  return (
    <Skeleton className="w-full h-[12vh]" />
  )
}