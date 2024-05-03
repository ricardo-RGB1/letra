"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItem } from "./user-item";
import { Item } from "./item";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { DocumentList } from "./document-list";
import { TrashBox } from "./trash-box";

/**
 * Renders the navigation component.
 * The navigation component includes a sidebar and a navbar.
 * The sidebar can be resized and collapsed.
 * The navbar is displayed outside the sidebar on larger screens and inside the sidebar on smaller screens.
 */

export const Navigation = () => {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const newNote = useMutation(api.documents.create); // Create a new document using the create mutation function and the documents API. newNote is a mutation function that creates a new document in the database.

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  /**
   * Handles the mouse move event for resizing the sidebar.
   *
   * @param event - The mouse event object.
   */
  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX; // Get the new width of the sidebar

    // Set limits to resizing the sidebar
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    // Resize the sidebar and the navbar by changing their width and left properties respectively
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.left = `${newWidth}px`;
      navbarRef.current.style.width = `calc(100% - ${newWidth}px)`;
    }
  };

  /**
   * Handles the mouse up event for resizing the sidebar.
   * Removes the event listeners for mouse move and mouse up.
   */
  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  /** Handles the mouse down event for resizing the sidebar 
        Prevents the default behavior and stops the event from propagating.
        Sets the isResizingRef to true.
        Add event listeners for mouse move and mouse up events and call the handleMouseMove and handleMouseUp functions respectively.
*/
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Reset the width of the sidebar and the navbar
  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false); // Set the sidebar to be expanded
      setIsResetting(true); // Set the resetting state to true

      // Reset the width of the sidebar and the navbar
      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)" // Set the width of the navbar to the width of the sidebar
      );
      navbarRef.current.style.setProperty(
        "left",
        isMobile ? "100%" : "240px" // Set the left property of the navbar to the width of the sidebar
      );

      // Set the resetting state to false after 300ms
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  // Collapse the sidebar
  const collapseWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true); // Set the sidebar to be collapsed
      setIsResetting(true); // Set the resetting state to true

      // Reset the width of the sidebar and the navbar
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%"); // Set the width of the navbar to 100%
      navbarRef.current.style.setProperty("left", "0"); // Set the left property of the navbar to 0

      // Set the resetting state to false after 300ms
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  // Create the useEffects that will handle the sidebar and navbar resizing and collapsing
  // Collapse the sidebar when the screen size changes
  useEffect(() => {
    if (isMobile) {
      collapseWidth();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  // Collapse the sidebar when the pathname changes
  useEffect(() => {
    if (isMobile) {
      collapseWidth();
    }
  }, [pathname, isMobile]);

  // Handle the creation of a new note:
  // Create a new note with the title "Untitled"
  // Display a toast message while creating the note
  const handleNewNote = () => {
    // Create a new note with the title "Untitled"
    const promise = newNote({ title: "Untitled" });

    toast.promise(promise, {
      // Display a toast message while creating the note
      loading: "Creating a new note...",
      success: "Note created!",
      error: "Failed to create a note. Please try again.",
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapseWidth}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100" // Always show the button on mobile
          )}
        >
          <ChevronsLeft className="w-6 h-6" />
        </div>
        <div>
          {/* RENDER THE ITEMS AND NOTES'S LIST */}
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={() => {}} />
          <Item label="Settings" icon={Settings} isSearch onClick={() => {}} />
          <Item onClick={handleNewNote} label="New page" icon={PlusCircle} />
        </div>
        {/* THE LIST OF NOTES */}
        <div className="mt-4">
          <DocumentList />

          <Item onClick={handleNewNote} icon={Plus} label="New note" />

          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
          
        </div>
        {/* This is the resize sidebar */}
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      {/* Outside the aside */}
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              onClick={resetWidth}
              role="button"
              className="h-6 w-6 text-muted-foreground"
            />
          )}
        </nav>
      </div>
    </>
  );
};
