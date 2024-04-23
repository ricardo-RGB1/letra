 import { Loader } from "lucide-react";

 import { cva, type VariantProps } from "class-variance-authority";

 import { cn } from "@/lib/utils";



/**
 * Variants for the spinner component.
 */
const spinnerVariants = cva(
    "text-muted-foreground animate-spin",
    {
        variants: {
            size: {
                default: "h-4 w-4",
                sm: "h-2 w-2",
                lg: "h-6 w-6",
                icon: "h-10 w-10"
            }
        },
        defaultVariants: {
            size: "default",
        },
    },
);


/**
 * Props for the Spinner component.
 */
interface SpinnerProps extends VariantProps<typeof spinnerVariants> {}



/**
 * Renders a spinner component with the specified size.
 * @param {SpinnerProps} props - The props for the Spinner component.
 * @param {string} props.size - The size of the spinner.
 * @returns {JSX.Element} The rendered Spinner component.
 */
export const Spinner = ({ size }: SpinnerProps) => {
    return (
        <Loader className={cn(spinnerVariants({ size }))} />
    );
}