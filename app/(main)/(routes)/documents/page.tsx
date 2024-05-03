'use client'; 

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"; 
import { toast } from "sonner";


/**
 * Renders the DocumentsPage component.
 * This component displays a welcome message, an image, and a button to create a new document.
 * It uses the Clerk authentication library to get the current user and the Convex library to create new documents.
 * @returns The rendered DocumentsPage component.
 */
const DocumentsPage = () => {
    const { user } = useUser(); 
    const newDocument = useMutation(api.documents.create);

    
    // Additional action when creating a new document
    // This function creates a new document with the title "Untitled"
    // It also displays a toast notification to indicate the status of the operation
    const onCreateDocument = () => {
        // Create a new document with the title "Untitled"
        const promise = newDocument({ title: "Untitled" }); 

        toast.promise(promise, {
            loading: 'Creating a new note...',
            success: 'Note created!',
            error: 'Failed to create a note. Please try again.'
        });
    };


    return ( 
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image 
                src="/empty.svg"
                height='300'
                width='300'
                alt="Empty"
            />
            <h2 className='text-lg font-medium'>
                Welcome to {user?.firstName}&apos;s Letra
            </h2>
            <Button onClick={onCreateDocument}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create a note
            </Button>
        </div>
     );
}
 
export default DocumentsPage;