"use client";

import EmojiPicker, { Theme } from "emoji-picker-react";

import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface IconPickerProps {
  onChange: (icon: string) => void; // Callback that is called when the user selects an icon
  children: React.ReactNode;
  asChild?: boolean; // If true, the icon picker will be rendered as a child of the trigger element
}

// IconPicker component that allows the user to pick an icon from a list of emojis
export const IconPicker = ({
  onChange,
  children,
  asChild,
}: IconPickerProps) => {
  const { resolvedTheme } = useTheme(); // Get the current theme
  const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap;

  // Map the theme name to the EmojiPicker theme
  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  };

  // Get the EmojiPicker theme for the current theme
  const theme = themeMap[currentTheme];

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>
        {children} {/* Render the trigger element */}
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full border-none shadow-none">
        <EmojiPicker
          height={350}
          theme={theme}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
};
