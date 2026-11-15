import { buttonClasses, type ButtonVariant } from "@/components/ui/buttonClasses";
import { Spinner } from "@/components/ui/Spinner";

type Props = {
  submitting: boolean;
  variant: ButtonVariant;
  idleLabel: string;
  className?: string;
};

/** Submit button for the enquiry forms: spinner + "Sending…" while in flight, announced to screen readers. */
export default function SubmitButton({ submitting, variant, idleLabel, className }: Props) {
  return (
    <>
      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className={buttonClasses(variant, "default", `${submitting ? "disabled:!opacity-100 " : ""}${className ?? ""}`)}
      >
        {submitting && <Spinner />}
        {submitting ? "Sending…" : idleLabel}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {submitting ? "Sending your enquiry" : ""}
      </span>
    </>
  );
}
