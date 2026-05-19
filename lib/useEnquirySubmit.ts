"use client";

import { useState } from "react";
import { submitForm } from "@/lib/api";
import type { EnquiryFormData } from "@/lib/types";

type SubmitState = {
  submitting: boolean;
  submitted: boolean;
  error: string | null;
};

const initial: SubmitState = { submitting: false, submitted: false, error: null };

export function useEnquirySubmit() {
  const [state, setState] = useState<SubmitState>(initial);

  async function submit(data: EnquiryFormData): Promise<boolean> {
    const endpoint = process.env.NEXT_PUBLIC_ENQUIRY_SUBMIT_URL;
    if (!endpoint) {
      setState({ submitting: false, submitted: false, error: "Submission endpoint not configured." });
      return false;
    }
    setState({ submitting: true, submitted: false, error: null });
    try {
      const result = await submitForm(endpoint, data as unknown as Record<string, unknown>);
      if (!result.success) {
        setState({ submitting: false, submitted: false, error: "Something went wrong. Please try again." });
        return false;
      }
      setState({ submitting: false, submitted: true, error: null });
      return true;
    } catch {
      setState({ submitting: false, submitted: false, error: "Network error. Please try again." });
      return false;
    }
  }

  function reset() {
    setState(initial);
  }

  return { ...state, submit, reset };
}
