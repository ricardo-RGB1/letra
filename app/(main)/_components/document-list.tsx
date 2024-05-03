"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Item } from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[]; // The data prop is an array of documents
}

export const DocumentList = ({
  parentDocumentId,
  level = 0,
}: DocumentListProps) => {
  const params = useParams(); // Get the URL parameters
  const router = useRouter(); // Get the router object
  const [expanded, setExpanded] = useState<Record<string, boolean>>({}); // State to keep track of the expanded items

  // Toggles the expanded state of a document with a given ID
  const onExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev, // Copy the previous state
      [documentId]: !prev[documentId], // Toggle the expanded state
    }));
  };

  // Fetch the documents based on the parent document ID
  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  });

  // Redirects to the document page with the specified document ID
  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && ( // Show two skeleton items for the root level
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
        <p style={{
            paddingLeft: level ? `${(level * 12) + 25}px` : undefined,
        }}
            className={cn("hidden text-sm font-medium text-muted-foreground/80",
            expanded && "last:block", // Show the text if expanded
            level === 0 && "hidden" // Hide the root level
            )}
        >
            No pages inside
        </p>
        {documents.map((document) => (
          <div key={document._id}>
            <Item
              id={document._id}
              onClick={() => onRedirect(document._id)}
              label={document.title}
              icon={FileIcon}
              documentIcon={document.icon}
              active={params.documentId === document._id} // Highlight the active document
              level={level}
              onExpand={() => onExpand(document._id)} // Toggle the expanded state
              expanded={expanded[document._id]} // Pass the expanded state 
            />
            {/* Recursively render the child documents: If the expanded object holds the document id then call the DocumentList component  */ }
            {expanded[document._id] && ( 
              <DocumentList
                parentDocumentId={document._id}
                level={level + 1}
              />
            )}
          </div>
        ))}
    </>
    )
};
