type Props = {
  size?: number;
  className?: string;
};

/** Inline loading ring. Inherits colour from the text around it; stills under reduced motion. */
export function Spinner({ size = 16, className }: Props) {
  return (
    <svg
      data-spinner
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`animate-spin motion-reduce:animate-none ${className ?? ""}`}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
