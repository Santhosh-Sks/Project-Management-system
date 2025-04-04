import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Other utility functions



export function getPriorityColor(priority: string): string {

  // Define the logic for priority color

  switch (priority) {

    case 'High':

      return 'text-red-500';

    case 'Medium':

      return 'text-yellow-500';

    case 'Low':

      return 'text-green-500';

    default:

      return 'text-gray-500';

  }

}

// Other utility functions



export function formatDate(date: string | Date): string {

  const d = new Date(date);

  return d.toLocaleDateString(); // Example formatting logic

}
