'use client'; 

import { Doc } from '@/convex/_generated/dataModel';

interface ToolbarProps {
    initialDocument: Doc<"documents">;
    preview?: boolean; 
}

export const Toolbar = ({ initialDocument } : ToolbarProps) => {
    return (
        <div>
            toolbar !
        </div>
    )
}