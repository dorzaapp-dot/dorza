"use client";

import { useReducer, useState, useCallback } from "react";
import type { OnboardState, OnboardAction } from "@/lib/types";
import StepBusinessBasics from "@/components/onboard/StepBusinessBasics";
import StepDigitalPresence from "@/components/onboard/StepDigitalPresence";
import StepServices from "@/components/onboard/StepServices";
import StepTargetCustomers from "@/components/onboard/StepTargetCustomers";
import StepBrandStyle from "@/components/onboard/StepBrandStyle";
import StepPhotosAssets from "@/components/onboard/StepPhotosAssets";
import StepWebsiteSections from "@/components/onboard/StepWebsiteSections";
import StepSocialMedia from "@/components/onboard/StepSocialMedia";
import StepPackage from "@/components/onboard/StepPackage";
import StepReview from "@/components/onboard/StepReview";
import WizardShell, { type StepMeta } from "@/components/onboard/WizardShell";
import WelcomeScreen from "@/components/onboard/WelcomeScreen";
import SubmittedScreen from "@/components/onboard/SubmittedScreen";

const TOTAL_STEPS = 10;

const STEPS: StepMeta[] = [
  { num: "01", label: "Tell us about your business", short: "About you" },
  { num: "02", label: "Where you're at online", short: "Online presence" },
  { num: "03", label: "What you offer", short: "Services" },
  { num: "04", label: "Who you serve", short: "Customers" },
  { num: "05", label: "Look & feel", short: "Brand" },
  { num: "06", label: "What you've got", short: "Assets" },
  { num: "07", label: "Site essentials", short: "Sections" },
  { num: "08", label: "Social rhythm", short: "Social" },
  { num: "09", label: "Pick your package", short: "Package" },
  { num: "10", label: "Last look", short: "Review" },
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
  socialPlatforms: [],
  postingFrequency: "",
  contentTypes: [],
  approvalProcess: "",
  avoidTopics: "",
  selectedPackage: "",
  foundingClient: false,
  agreedSetupFee: 0,
  agreedMonthlyFee: 0,
  paymentMethod: "",
  startDate: new Date().toISOString().split("T")[0],
  notes: "",
  completedBy: "",
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
    case "TOGGLE_SOCIAL_PLATFORM":
      return {
        ...state,
        socialPlatforms: toggleInArray(state.socialPlatforms, action.platform),
      };
    case "TOGGLE_CONTENT_TYPE":
      return {
        ...state,
        contentTypes: toggleInArray(state.contentTypes, action.contentType),
      };
    case "TOGGLE_WEBSITE_SECTION":
      return {
        ...state,
        websiteSections: {
          ...state.websiteSections,
          [action.section]: !state.websiteSections[action.section],
        },
      };
    case "SELECT_PACKAGE": {
      const fees: Record<string, { setup: number; monthly: number }> = {
        Starter: { setup: 499, monthly: 199 },
        Growth: { setup: 799, monthly: 349 },
        Pro: { setup: 1299, monthly: 549 },
      };
      const f = fees[action.pkg];
      const setupFee = state.foundingClient
        ? Math.round(f.setup * 0.5)
        : f.setup;
      return {
        ...state,
        selectedPackage: action.pkg,
        agreedSetupFee: setupFee,
        agreedMonthlyFee: f.monthly,
      };
    }
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

  const validate = useCallback(
    (currentStep: number): boolean => {
      const errs: Record<string, string> = {};

      if (currentStep === 0) {
        if (!state.businessName.trim())
          errs.businessName = "Business name is required";
        if (!state.ownerName.trim())
          errs.ownerName = "Your name is required";
        if (!state.phone.trim()) errs.phone = "Phone is required";
      }

      if (currentStep === 2) {
        if (!state.services.some((s) => s.trim()))
          errs.services = "At least one service is required";
      }

      if (currentStep === 8) {
        if (!state.selectedPackage)
          errs.selectedPackage = "Please select a package";
      }

      setErrors(errs);
      return Object.keys(errs).length === 0;
    },
    [state],
  );

  function goNext() {
    if (!validate(step)) return;
    if (step >= TOTAL_STEPS - 1) {
      setPhase("submitted");
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
      forwardLabel={step === TOTAL_STEPS - 1 ? "Submit my brief" : "Continue"}
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
      {step === 7 && <StepSocialMedia state={state} dispatch={dispatch} />}
      {step === 8 && (
        <StepPackage state={state} dispatch={dispatch} errors={errors} />
      )}
      {step === 9 && <StepReview state={state} dispatch={dispatch} />}
    </WizardShell>
  );
}
