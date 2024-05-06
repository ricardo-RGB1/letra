"use client";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface TitleProps {
  initialData: Doc<"documents">;
}

/**
 * Renders a title component with editable functionality.
 * @param initialData - The initial data for the title component.
 * @returns The rendered title component.
 */
export const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateDocument = useMutation(api.documents.updateDocument);
  const [isEditing, setIsEditing] = useState(false);
  // create the title state
  const [title, setTitle] = useState(initialData.title || "Untitled");

  // Function to handle the input change
  // Purpose: Enable the input field and focus it
  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus(); // Focus the input field
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length); // Select the text in the input field
    }, 0);
  };

  // Function to disable the input field
  const disableInput = () => {
    setIsEditing(false);
  };

  // Function to handle the input change
  // Purpose: Update the title state and call the updateDocument mutation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    updateDocument({
      id: initialData._id,
      title: e.target.value || "Untitled", // If the title is empty, set it to "Untitled"
    });
  };

  // Function to handle the key down event
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      disableInput();
    } // If the user presses the Enter key, disable the input field
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          value={title}
          onClick={enableInput}
          onChange={handleChange}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{initialData?.title}</span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-9 w-20 rounded-md" />;
};
