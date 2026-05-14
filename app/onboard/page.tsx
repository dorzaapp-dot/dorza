"use client";

import { useReducer, useState, useCallback } from "react";
import { submitForm } from "@/lib/api";
import { generateMarkdown } from "@/lib/generateMarkdown";
import type { OnboardState, OnboardAction } from "@/lib/types";
import StepBusinessBasics from "@/components/onboard/StepBusinessBasics";
import StepDigitalPresence from "@/components/onboard/StepDigitalPresence";
import StepServices from "@/components/onboard/StepServices";
import StepTargetCustomers from "@/components/onboard/StepTargetCustomers";
import StepBrandStyle from "@/components/onboard/StepBrandStyle";
import StepPhotosAssets from "@/components/onboard/StepPhotosAssets";
import StepWebsiteSections from "@/components/onboard/StepWebsiteSections";
import StepSuccess from "@/components/onboard/StepSuccess";
import StepReview from "@/components/onboard/StepReview";
import WizardShell, { type StepMeta } from "@/components/onboard/WizardShell";
import WelcomeScreen from "@/components/onboard/WelcomeScreen";
import SubmittedScreen from "@/components/onboard/SubmittedScreen";

const TOTAL_STEPS = 9;

const STEPS: StepMeta[] = [
  { num: "01", label: "Tell us about your business", short: "About you" },
  { num: "02", label: "Where you're at online", short: "Online presence" },
  { num: "03", label: "What you offer", short: "Services" },
  { num: "04", label: "Who you serve", short: "Customers" },
  { num: "05", label: "Look & feel", short: "Brand" },
  { num: "06", label: "What you've got", short: "Assets" },
  { num: "07", label: "Site essentials", short: "Sections" },
  { num: "08", label: "What success looks like", short: "Success" },
  { num: "09", label: "Last look", short: "Review" },
];

function getDefaultSections(businessType: string): Record<string, boolean> {
  const base: Record<string, boolean> = {
    Hero: true,
    "Services/menu": true,
    "About us": true,
    "Photo gallery": false,
    "Contact form": true,
    "Google Map": true,
    Testimonials: true,
    "Online booking": false,
    "Social feed embed": false,
    FAQ: false,
    "Blog future": false,
    "E-commerce": false,
  };

  if (businessType === "Cafe/Restaurant") {
    base["Photo gallery"] = true;
  } else if (businessType === "Salon/Beauty") {
    base["Photo gallery"] = true;
    base["Online booking"] = true;
  } else if (businessType === "Fitness/Wellness") {
    base["Online booking"] = true;
  } else if (businessType === "Retail") {
    base["E-commerce"] = true;
    base["Photo gallery"] = true;
  }

  return base;
}

const initialState: OnboardState = {
  businessName: "",
  ownerName: "",
  businessType: "",
  customBusinessType: "",
  niche: "",
  abn: "",
  streetAddress: "",
  suburb: "",
  phone: "",
  email: "",
  openingHours: "",
  existingWebsite: "",
  googleBusiness: "",
  instagramHandle: "",
  facebookPage: "",
  otherPlatforms: "",
  biggestFrustration: "",
  services: ["", "", "", ""],
  differentiator: "",
  priceRange: "",
  typicalCustomer: "",
  serviceArea: "",
  discoveryChannels: [],
  hasLogo: "",
  brandColours: "",
  tone: "",
  inspirationSites: "",
  brandKeywords: "",
  logoStatus: "",
  photosStatus: "",
  menuDocStatus: "",
  testimonialsStatus: "",
  specificTestimonials: "",
  photoNotes: "",
  websiteSections: getDefaultSections(""),
  bookingLink: "",
  ecommercePlatform: "",
  otherSections: "",
  siteVisionDescription: "",
  successVision: "",
  notes: "",
};

function toggleInArray(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

function reducer(state: OnboardState, action: OnboardAction): OnboardState {
  switch (action.type) {
    case "UPDATE_FIELD": {
      const next = { ...state, [action.field]: action.value };
      if (action.field === "businessType") {
        next.websiteSections = getDefaultSections(action.value as string);
      }
      return next;
    }
    case "ADD_SERVICE":
      if (state.services.length >= 10) return state;
      return { ...state, services: [...state.services, ""] };
    case "REMOVE_SERVICE":
      return {
        ...state,
        services: state.services.filter((_, i) => i !== action.index),
      };
    case "UPDATE_SERVICE":
      return {
        ...state,
        services: state.services.map((s, i) =>
          i === action.index ? action.value : s,
        ),
      };
    case "TOGGLE_DISCOVERY_CHANNEL":
      return {
        ...state,
        discoveryChannels: toggleInArray(state.discoveryChannels, action.channel),
      };
    case "TOGGLE_WEBSITE_SECTION":
      return {
        ...state,
        websiteSections: {
          ...state.websiteSections,
          [action.section]: !state.websiteSections[action.section],
        },
      };
    default:
      return state;
  }
}

type Phase = "welcome" | "wizard" | "submitted";

export default function OnboardPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [phase, setPhase] = useState<Phase>("welcome");
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = useCallback((): boolean => {
    setErrors({});
    return true;
  }, []);

  async function goNext() {
    if (!validate()) return;
    if (step >= TOTAL_STEPS - 1) {
      setSubmitting(true);
      const result = await submitForm(
        process.env.NEXT_PUBLIC_ONBOARD_SUBMIT_URL!,
        { state, markdown: generateMarkdown(state) }
      );
      setSubmitting(false);
      if (result.success) setPhase("submitted");
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function jumpTo(i: number) {
    if (i <= step) setStep(i);
  }

  function exitToHome() {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  if (phase === "welcome") {
    return (
      <WelcomeScreen
        onStart={() => {
          setPhase("wizard");
          setStep(0);
        }}
      />
    );
  }

  if (phase === "submitted") {
    return (
      <SubmittedScreen
        ownerName={state.ownerName || "there"}
      />
    );
  }

  return (
    <WizardShell
      step={step}
      total={TOTAL_STEPS}
      steps={STEPS}
      onBack={goBack}
      onNext={goNext}
      onJumpTo={jumpTo}
      onExit={exitToHome}
      forwardLabel={step === TOTAL_STEPS - 1 ? (submitting ? "Submitting…" : "Submit my brief") : "Continue"}
      forwardDisabled={submitting}
    >
      {step === 0 && (
        <StepBusinessBasics
          state={state}
          dispatch={dispatch}
          errors={errors}
        />
      )}
      {step === 1 && (
        <StepDigitalPresence state={state} dispatch={dispatch} />
      )}
      {step === 2 && (
        <StepServices state={state} dispatch={dispatch} errors={errors} />
      )}
      {step === 3 && (
        <StepTargetCustomers state={state} dispatch={dispatch} />
      )}
      {step === 4 && <StepBrandStyle state={state} dispatch={dispatch} />}
      {step === 5 && <StepPhotosAssets state={state} dispatch={dispatch} />}
      {step === 6 && (
        <StepWebsiteSections state={state} dispatch={dispatch} />
      )}
      {step === 7 && <StepSuccess state={state} dispatch={dispatch} />}
      {step === 8 && <StepReview state={state} dispatch={dispatch} />}
    </WizardShell>
  );
}
