import { cn } from "@/lib/utils";

/** The SEVO wordmark. Always understated — never scale this up for effect. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("sevo-wordmark text-base", className)} aria-label="SEVO">
      SEVO
    </span>
  );
}

/**
 * Secondary mark: three geometric lines derived from the structure of the E.
 * Works standalone on tongue labels, packaging, favicons and loading states.
 */
export function Mark({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="1" y="2" width="14" height="1.6" fill="currentColor" />
      <rect x="1" y="7.2" width="9" height="1.6" fill="currentColor" />
      <rect x="1" y="12.4" width="14" height="1.6" fill="currentColor" />
    </svg>
  );
}

/** Minimal loading state using the secondary mark. */
export function MarkLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <Mark size={24} className="animate-pulse text-foreground" />
    </div>
  );
}
