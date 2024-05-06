"use client";

import { Id } from "@/convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface MenuProps {
  documentId: Id<"documents">;
}

/**
 * Renders the Menu component.
 *
 * @param {Object} props - The component props.
 * @param {Id<"documents">} props.documentId - The ID of the document.
 * @returns {JSX.Element} The rendered Menu component.
 */
export const Menu = ({ documentId }: MenuProps) => {
  const router = useRouter();
  const { user } = useUser();
  const archive = useMutation(api.documents.archive);

  // Archive the document and show a toast notification, then redirect to the documents page
  const onArchive = () => {
    const promise = archive({ id: documentId });

    toast.promise(promise, {
      loading: "Archiving...",
      success: "Document archived successfully",
      error: "Failed to archive document",
    });

    router.push("/documents");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className='w-60'
        align='end'
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
            <Trash className="h-4 w-4 mr-2" />Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div
            className="text-xs text-muted-foreground p-2"
        >Last edited by: {user?.fullName} </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


Menu.Skeleton = function MenuSkeleton() {
    return (
        <Skeleton className="h-10 w-10" />
    )
}