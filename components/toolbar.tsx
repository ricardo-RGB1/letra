"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { IconPicker } from "./icon-picker";
import { ImageIcon, Smile, X } from "lucide-react";
import { Button } from "./ui/button";
import { ElementRef, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextareaAutosize from "react-textarea-autosize";

interface ToolbarProps {
  initialDocument: Doc<"documents">;
  preview?: boolean;
}

export const Toolbar = ({ initialDocument, preview }: ToolbarProps) => {
  // Ref to the input element
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialDocument.title);

  const updateDocument = useMutation(api.documents.updateDocument);
  const removeIcon = useMutation(api.documents.removeIcon);

  // Enable editing of the document title
  const enableInput = () => {
    // If a guest is viewing the document, don't allow editing
    if (preview) return;
    setIsEditing(true);
    // Focus the input element after the state enters the editing state
    setTimeout(() => {
      setValue(initialDocument.title);
      inputRef.current?.focus();
    }, 0);
  };

  // Disable editing of the document title
  const disableInput = () => setIsEditing(false);

  // Callback that is called when the input value changes
  const onInputChange = (value: string) => {
    setValue(value); // Update the value in the state
    updateDocument({
      // update the document with the new title in the database
      id: initialDocument._id,
      title: value || "Untitled",
    });
  };

  /**
   * Handles the keydown event for the textarea.
   * If the Enter key is pressed, it prevents the default behavior and calls the `disableInput` function.
   * @param e - The keyboard event.
   */
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      disableInput();
    }
  };

  // Handles the icon select event from the IconPicker component
  const onIconSelect = (icon: string) => {
    updateDocument({
      id: initialDocument._id, // The ID of the document to update
      icon, // The new icon for the document
    }); // Update the document with the new icon in the database
  };

  // Handles the click event for the remove icon button
  const onRemoveIcon = () => {
    removeIcon({
      id: initialDocument._id, // The ID of the document to update
    }); // Remove the icon from the document in the database
  };

  return (
    <div className="pl-[54px] group relative">
      {/* If the document has an icon and we're not in preview mode, render the icon picker */}
      {!!initialDocument.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialDocument.icon}{" "}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {/* If the icon is true but the doc is in preview (guest), only render the icon */}
      {!!initialDocument.icon && preview && (
        <p className="text-6xl pt-6">{initialDocument.icon}</p>
      )}
      {/* If there is no icon and not on preview, render the IconPicker */}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialDocument.icon && !preview && (
          <IconPicker onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-sm"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {/* If the is no cover image and the state is not in preview */}
        {!initialDocument.coverImage && !preview && (
          <Button
            onClick={() => {}}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover image
          </Button>
        )}
      </div>
      {/* If the state is in editing and there is no preview render the TextareaAutosize */}
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          value={value}
          onChange={(e) => onInputChange(e.target.value)}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words cursor-pointer outline-none text-[#3f3f3f] dark:text-[#cfcfcf]"
        >
          {initialDocument.title || "Untitled"}
        </div>
      )}
    </div>
  );
};
