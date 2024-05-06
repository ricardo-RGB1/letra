"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  }
}

const DocumentIdPage = ({params} : DocumentIdPageProps) => {
    // Fetch the document with the specified ID from the API
    const document = useQuery(api.documents.getById, {
        documentId: params.documentId // The ID of the document to fetch
    })

    if (document === undefined) {
        return <div>Loading...</div>
    }


    if(document === null) {
        return <div>Document not found</div>
    }


  return (
    <div className="pb-40">
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
            <Toolbar initialDocument={document} />
        </div>
    </div>
  )
};

export default DocumentIdPage;
