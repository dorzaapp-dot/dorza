import { pillarLinkHint } from "@/lib/data/pillars";

/** A short nav label, plus hidden words saying where it goes when the label alone ("Start") doesn't. */
export function LinkLabel({ label, href }: { label: string; href: string }) {
  const hint = pillarLinkHint(href);
  return (
    <>
      {label}
      {hint ? <span className="sr-only">: {hint}</span> : null}
    </>
  );
}
