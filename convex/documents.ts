import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Helpter function that retrieves the user ID from the provided context.
 * @param ctx The context object.
 * @returns A Promise that resolves to the user ID.
 * @throws Error if the user is not authenticated.
 */
async function getUserId(ctx: any): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Not authenticated");
  }

  return identity.subject;
}

export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    // Get the document with the specified ID
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Document not found");
    }

    // Check if the document belongs to the user
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Recursively archive the child documents
    const recursiveArchive = async (documentId: Id<"documents">) => {
      const childDocs = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      // Archive the child documents recursively
      for (const child of childDocs) {
        // Loop through the child documents
        await ctx.db.patch(child._id, {
          // Archive the child document
          isArchived: true,
        });

        // Recursively archive the child's children
        await recursiveArchive(child._id);
      }
    };

    // Archive the document: args.id
    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    recursiveArchive(args.id); // Recursively archive the child documents

    return document;
  },
});



/**
 * Retrieves the sidebar documents based on the provided parent document ID.
 * getSidebar is an API function that retrieves the documents that belong to the current user and have the specified parent document ID.
 * @param {string} parentDocument - The ID of the parent document (optional).
 * @returns {Promise<Array<Document>>} - A promise that resolves to an array of documents.
 * @throws {Error} - If the user is not authenticated.
 */
export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    // Get the documents that belong to the user
    const documents = await ctx.db
      .query("documents")
      .withIndex(
        "by_user_parent",
        (q) =>
          q
            .eq("userId", userId) // Filter by user ID
            .eq("parentDocument", args.parentDocument) // Filter by parent document ID
      )
      .filter(
        (q) => q.eq(q.field("isArchived"), false) // Filter out archived documents
      )
      .order("desc") // Order the documents in descending order
      .collect(); // Collect the documents

    return documents; // Return the documents
  },
});

/**
 * Creates a new document in the database.
 * @param {string} title - The title of the document.
 * @param {string} parentDocument - The ID of the parent document (optional).
 * @returns {Promise<object>} - A promise that resolves to the created document object. Ex: { _id: "123", title: "Untitled", parentDocument: "456", userId: "789", isArchived: false, isPublished: false }
 * @throws {Error} - Throws an error if the user is not authenticated.
 */
export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx); // Get the user ID

    const document = await ctx.db.insert("documents", {
      title: args.title, // Set the title
      parentDocument: args.parentDocument,
      userId, // shortcut for userId: userId
      isArchived: false,
      isPublished: false,
    });

    return document; // Return the created document. Ex: { _id: "123", title: "Untitled", parentDocument: "456", userId: "789", isArchived: false, isPublished: false }
  },
});

/**
 * Retrieves the archived documents for a specific user.
 * @returns {Promise<Document[]>} A promise that resolves to an array of archived documents.
 */
export const getTrash = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId)) // Filter by user ID
      .filter(
        (q) => q.eq(q.field("isArchived"), true) // Filter out non-archived documents)
      )
      .order("desc") // Order the documents in descending order
      .collect(); // Collect the documents

    return documents;
  },
});

/**
 * Restores a document by setting its isArchived property to false.
 * If the document has a parent document that is archived, the parent document is also restored.
 *
 * @param ctx - The execution context.
 * @param args - The arguments for the mutation.
 * @returns The restored document.
 * @throws Error if the document is not found or if the user is unauthorized.
 */
export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const document = await ctx.db.get(args.id);

    if (!document) {
      throw new Error("Document not found");
    }

    if (document.userId !== userId) {
      throw new Error("Unauthorized");
    }

    /**
     * Restores a document and its children recursively.
     * @param documentId The ID of the document to restore.
     */
    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      // Restore the children recursively
      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: false });
        await recursiveRestore(child._id);
      }
    };

    // Restore the document by setting isArchived to false
    // Partial<Doc<"documents">> is used to allow only a subset of the document fields to be updated
    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    // Recursively restore the parent documents
    if (document.parentDocument) {
      // If the document has a parent
      const parent = await ctx.db.get(document.parentDocument); // Get the parent document
      if (parent?.isArchived) {
        // If the parent document is archived
        options.parentDocument = undefined; // Unset the parent document
      }
    }

    await ctx.db.patch(args.id, options); // Update the document
    recursiveRestore(args.id); // Recursively restore the children
    return document;
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    // Get the document with the specified ID
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Document not found");
    }

    // Check if the document belongs to the user
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.delete(args.id);

    return document; // Return the deleted document
  },
});

/**
 * Retrieves the search results based on the provided query.
 * @param {object} ctx - The context object.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of documents.
 */
export const getSearch = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId)) // Filter by user ID
      .filter((q) => q.eq(q.field("isArchived"), false)) // Filter out archived documents
      .order("desc") // Order the documents in descending order
      .collect(); // Collect the documents

    return documents; // Return the documents
  },
});





/**
 * Retrieves a document by its ID.
 * 
 * @param {string} documentId - The ID of the document to retrieve.
 * @returns {Promise<Document>} - A promise that resolves to the retrieved document.
 * @throws {Error} - If the document is not found, the user is unauthorized, or the document does not belong to the user.
 */
export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    // Get the document with the specified ID from the database
    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Document not found");
    }

    // Check if the document is published and not archived so user can view it
    if (document.isPublished && !document.isArchived) {
      return document;
    }

    // Check if the user is authenticated
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get the user ID  from the identity object
    const userId = identity.subject;


    // Check if the document belongs to the user
    if(document.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return document;


  },
});





/**
 * Updates a document with the specified ID.
 * 
 * @param {string} id - The ID of the document to update.
 * @param {string} [title] - The new title of the document (optional).
 * @param {string} [content] - The new content of the document (optional).
 * @param {string} [coverImage] - The new cover image of the document (optional).
 * @param {string} [icon] - The new icon of the document (optional).
 * @param {boolean} [isPublished] - The new published status of the document (optional).
 * 
 * @returns {Promise<Document>} - The updated document.
 * @throws {Error} - If the user is not authenticated, the document is not found, or the user is not authorized.
 */
export const updateDocument = mutation({
  args: { 
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
   },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
 
    // Check if the user is authenticated
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get the user ID from the identity object
    const userId = identity.subject;

// Destructure the args object to get the document ID and the rest of the fields
    const { id, ...rest } = args; 

    // Get the document with the specified ID
    const existingDocument = await ctx.db.get(args.id); 


    if(!existingDocument) {
      throw new Error("Document not found");
    }


    // Check if the document belongs to the user
    if(existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Update the document with the new fields
    const updatedDocument = await ctx.db.patch(args.id, rest);

    return updatedDocument; // Return the updated document

  },
});