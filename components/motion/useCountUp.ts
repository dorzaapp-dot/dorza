"use client";

import { animate, type AnimationPlaybackControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DORZA_EASE } from "./Reveal";

export function useCountUp(
  target: number,
  trigger: boolean,
  {
    duration = 1.5,
    from = 0,
    overshoot = false,
  }: { duration?: number; from?: number; overshoot?: boolean } = {}
) {
  const [value, setValue] = useState(trigger ? target : from);
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    if (!trigger) {
      setValue(from);
      return;
    }

    if (overshoot) {
      const overshootTarget = target + target * 0.06;
      const ctrl1 = animate(from, overshootTarget, {
        duration: duration * 0.7,
        ease: DORZA_EASE,
        onUpdate: (v) => setValue(v),
        onComplete: () => {
          const ctrl2 = animate(overshootTarget, target, {
            duration: duration * 0.3,
            ease: [0.32, 0, 0.67, 0],
            onUpdate: (v) => setValue(v),
          });
          controlsRef.current = ctrl2;
        },
      });
      controlsRef.current = ctrl1;
      return () => controlsRef.current?.stop();
    }

    const controls = animate(from, target, {
      duration,
      ease: DORZA_EASE,
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [target, trigger, duration, from, overshoot]);

  return value;
}
