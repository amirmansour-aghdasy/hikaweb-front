import { clsx } from "clsx";

/**
 * Utility function to merge class names
 * Combines clsx with Tailwind CSS class merging
 */
export function cn(...inputs) {
    return clsx(inputs);
}

