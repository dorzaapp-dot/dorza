"use client";

import { useState } from "react";
import { submitForm } from "@/lib/api";
import { submitEnquiry } from "@/lib/submitEnquiry";
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
    setState({ submitting: true, submitted: false, error: null });
    const result = await submitEnquiry(data, {
      endpoint: process.env.NEXT_PUBLIC_ENQUIRY_SUBMIT_URL,
      send: submitForm,
      onLateSuccess: () => setState({ submitting: false, submitted: true, error: null }),
    });
    if (!result.ok) {
      setState({ submitting: false, submitted: false, error: result.error });
      return false;
    }
    setState({ submitting: false, submitted: true, error: null });
    return true;
  }

  function reset() {
    setState(initial);
  }

  return { ...state, submit, reset };
}
