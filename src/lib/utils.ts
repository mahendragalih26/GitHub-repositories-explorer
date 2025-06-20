import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getClientType(): string {
  if (typeof window === "undefined") {
    return "web-desktop"
  } else {
    const isMobile =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        navigator.userAgent
      )
    return isMobile ? "web-mobile" : "web-desktop"
  }
}
