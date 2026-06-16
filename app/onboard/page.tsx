"use client";

import { useReducer, useState, useCallback, useEffect, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { submitForm } from "@/lib/api";
import { generateMarkdown } from "@/lib/generateMarkdown";
import { loadDraft, saveDraft, clearDraft, type OnboardPhase } from "@/lib/onboardPersistence";
import { trackOnboard } from "@/lib/onboardAnalytics";
import type { OnboardState, OnboardAction } from "@/lib/types";
import StepBusinessBasics from "@/components/onboard/StepBusinessBasics";
import StepDigitalPresence from "@/components/onboard/StepDigitalPresence";
import StepServices from "@/components/onboard/StepServices";
import StepTargetCustomers from "@/components/onboard/StepTargetCustomers";
import StepLookFeel from "@/components/onboard/StepLookFeel";
import StepSiteAssets from "@/components/onboard/StepSiteAssets";
import StepSuccess from "@/components/onboard/StepSuccess";
import StepReview from "@/components/onboard/StepReview";
import WizardShell, { type StepMeta } from "@/components/onboard/WizardShell";
import WelcomeScreen from "@/components/onboard/WelcomeScreen";
import SubmittedScreen from "@/components/onboard/SubmittedScreen";

const TOTAL_STEPS = 8;

const STEPS: StepMeta[] = [
  { num: "01", label: "Tell us about your business", short: "About you", why: "The essentials that go on your site, Google listing, and invoices." },
  { num: "02", label: "Where you're at online", short: "Online presence", why: "So we know what to keep, fix, or build from scratch." },
  { num: "03", label: "What you offer", short: "Services", why: "These become your services page and shape your SEO." },
  { num: "04", label: "Who you serve", short: "Customers", why: "The clearer this is, the sharper your copy lands." },
  { num: "05", label: "Look & feel", short: "Look & feel", why: "Tone, colour, and vibe — how your site should feel." },
  { num: "06", label: "Your site & assets", short: "Site & assets", why: "Which sections you need and what you've already got." },
  { num: "07", label: "What success looks like", short: "Success", why: "So we build toward the outcome you actually want." },
  { num: "08", label: "Last look", short: "Review", why: "A quick check, then your brief is on its way." },
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
  colourMood: "",
  brandColours: "",
  brandPalette: [],
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
  agreedToTerms: false,
};

function toggleInArray(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

function reducer(state: OnboardState, action: OnboardAction): OnboardState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
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

export default function OnboardPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [phase, setPhase] = useState<OnboardPhase>("welcome");
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore any in-progress draft once, on the client, after hydration.
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      // Merge over initialState so drafts saved before a field existed still hydrate cleanly.
      dispatch({ type: "HYDRATE", state: { ...initialState, ...draft.state } });
      setStep(draft.step);
      setPhase(draft.phase === "submitted" ? "welcome" : draft.phase);
      setSavedAt(draft.savedAt);
      setHasDraft(true);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated || phase !== "wizard") return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const now = new Date().toISOString();
      saveDraft({ state, step, phase, savedAt: now });
      setSavedAt(now);
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, step, phase, hydrated]);

  useEffect(() => {
    if (phase !== "wizard") return;
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        trackOnboard("onboard_abandon", { step: step + 1 });
      }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [phase, step]);

  useEffect(() => {
    if (phase === "wizard") trackOnboard("onboard_step_view", { step: step + 1 });
  }, [step, phase]);

  const validate = useCallback((): boolean => {
    setErrors({});
    return true;
  }, []);

  async function goNext() {
    if (!validate()) return;
    if (step >= TOTAL_STEPS - 1) {
      setSubmitError(false);
      setSubmitting(true);
      trackOnboard("onboard_submit_attempt");
      const result = await submitForm(process.env.NEXT_PUBLIC_ONBOARD_SUBMIT_URL!, {
        state,
        markdown: generateMarkdown(state),
      });
      setSubmitting(false);
      if (result.success) {
        trackOnboard("onboard_submit_success");
        clearDraft();
        setPhase("submitted");
      } else {
        trackOnboard("onboard_submit_error");
        setSubmitError(true);
      }
      return;
    }
    trackOnboard("onboard_step_next", { from: step + 1, to: step + 2 });
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    trackOnboard("onboard_step_back", { from: step + 1, to: step });
    setStep((s) => Math.max(s - 1, 0));
  }

  function startFresh() {
    clearDraft();
    dispatch({ type: "HYDRATE", state: initialState });
    setStep(0);
    setHasDraft(false);
    setSavedAt(null);
    setPhase("wizard");
    trackOnboard("onboard_start");
  }

  function resumeDraft() {
    setPhase("wizard");
    trackOnboard("onboard_resume", { step: step + 1 });
  }

  function jumpTo(i: number) {
    if (i <= step) setStep(i);
  }

  function exitToHome() {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  if (!hydrated) return null;

  if (phase === "welcome") {
    return (
      <WelcomeScreen
        onStart={startFresh}
        onResume={resumeDraft}
        hasInProgress={hasDraft}
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
      savedAt={savedAt}
      submitError={submitError}
      forwardLabel={step === TOTAL_STEPS - 1 ? (submitting ? "Submitting…" : "Submit my brief") : "Continue"}
      forwardDisabled={submitting || (step === TOTAL_STEPS - 1 && !state.agreedToTerms)}
    >
      <StepTransition step={step}>
        {step === 0 && (
          <StepBusinessBasics state={state} dispatch={dispatch} errors={errors} />
        )}
        {step === 1 && <StepDigitalPresence state={state} dispatch={dispatch} />}
        {step === 2 && (
          <StepServices state={state} dispatch={dispatch} errors={errors} />
        )}
        {step === 3 && <StepTargetCustomers state={state} dispatch={dispatch} />}
        {step === 4 && <StepLookFeel state={state} dispatch={dispatch} />}
        {step === 5 && <StepSiteAssets state={state} dispatch={dispatch} />}
        {step === 6 && <StepSuccess state={state} dispatch={dispatch} />}
        {step === 7 && <StepReview state={state} dispatch={dispatch} />}
      </StepTransition>
    </WizardShell>
  );
}

function StepTransition({ step, children }: { step: number; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
