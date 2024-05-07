"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { CoverImage } from "@/components/cover-image";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { useMemo } from "react";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), {ssr: false}), []);

  // Fetch the document with the specified ID from the API
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId, // The ID of the document to fetch
  });

  // Mutation to update the document
  const updateDoc = useMutation(api.documents.updateDocument);

  const onChange = (content: string) => {
    // Update the document content
    updateDoc({
      id: params.documentId,
      content,
    });
  };

  // The document is still loading render the skeleton
  if (document === undefined) {
    return (
      <div>
        <CoverImage.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-14 w-[80%]" />
            <Skeleton className="h-14 w-[40%]" />
            <Skeleton className="h-14 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Document not found</div>;
  }

  return (
    <div className="pb-40">
      <CoverImage preview url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialDocument={document} />
        <Editor editable={false} onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
