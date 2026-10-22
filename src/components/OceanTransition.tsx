
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogoIntro, LogoIntroReduced } from '@/components/Logo';

type Phase = 'brand' | 'ocean' | 'reveal' | 'done';

type Props = {
  trigger: string;
  full: boolean;
  onComplete?: () => void;
};

const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;
const EASE_DIVE = [0.76, 0, 0.24, 1] as const;

export function OceanTransition({ trigger, full, onComplete }: Props) {
  const [active, setActive] = useState(true);
  const [phase, setPhase] = useState<Phase>(full ? 'brand' : 'done');

  const reduceMotion = usePrefersReducedMotion();
  const doneRef = useRef<string | null>(null);
  const activeTrigger = useRef(trigger);
  const timersRef = useRef<number[]>([]);
  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    activeTrigger.current = trigger;

    if (doneRef.current === trigger) return;

    clearTimers();

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(callback, delay);
      timersRef.current.push(timer);
    };

    const finish = () => {
      if (doneRef.current === activeTrigger.current) return;

      doneRef.current = activeTrigger.current;
      setPhase('done');
      setActive(false);
      completeRef.current?.();
    };

    if (reduceMotion) {
      finish();
      return () => clearTimers();
    }

    setActive(true);

    if (full) {
      // FIRST LOAD:
      // Show only the brand intro. Do not play the ship transition afterward.
      setPhase('brand');

      schedule(finish, 2400);
    } else {
      // PAGE NAVIGATION:
      // Show the cargo ship first, then use the ocean scene as a reveal curtain.
      setPhase('ocean');

      schedule(() => setPhase('reveal'), 1100);
      schedule(finish, 2200);
      schedule(finish, 3500);
    }

    return () => clearTimers();

    // `full` is intentionally omitted. The trigger determines when
    // a new transition begins; changing full after the intro must not restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, reduceMotion]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="ocean-overlay"
          className="fixed inset-0 z-[120] overflow-hidden bg-[#030c1d]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          aria-hidden="true"
          role="presentation"
        >
          {reduceMotion ? (
            <ReducedFallback />
          ) : (
            <Scene phase={phase} full={full} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }
}

function Scene({ phase, full }: { phase: Phase; full: boolean }) {
  return (
    <div className="absolute inset-0 bg-[#030c1d]">
      <AnimatePresence mode="wait">
        {phase === 'brand' && <BrandReveal key="brand" />}
        {phase === 'ocean' && <OceanJourney key="ocean" />}
        {phase === 'reveal' && <PageReveal key="reveal" full={full} />}
      </AnimatePresence>
    </div>
  );
}

function BrandReveal() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#030c1d]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(58,92,150,0.32),transparent_64%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,12,29,0.3)_0%,transparent_45%,rgba(3,12,29,0.45)_100%)]" />

      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,199,232,0.18),transparent_70%)] blur-2xl" />
      </motion.div>

      <div className="relative flex flex-col items-center px-6">
        <LogoIntro />

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: EASE_CINEMATIC, delay: 0.15 }}
          className="mt-7 h-px w-40 origin-center bg-gradient-to-r from-transparent via-gold to-transparent sm:w-48"
        />

        <motion.h1
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE_CINEMATIC, delay: 0.1 }}
          className="text-center font-display text-3xl font-light tracking-[0.18em] text-ivory sm:text-5xl md:text-6xl md:tracking-[0.3em]"
        >
          Meridians <span className="text-gradient-gold">Exports</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.4 }}
          className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-gold/75 sm:text-xs sm:tracking-[0.5em]"
        >
          Origin · Ocean · Market
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: EASE_CINEMATIC, delay: 0.15 }}
          className="mt-6 h-px w-40 origin-center bg-gradient-to-r from-transparent via-gold to-transparent sm:w-48"
        />
      </div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-32 -translate-y-1/2"
        style={{
          background:
            'linear-gradient(90deg,transparent 0%,rgba(200,172,112,0.05) 42%,rgba(244,240,231,0.14) 50%,rgba(200,172,112,0.05) 58%,transparent 100%)',
        }}
        initial={{ x: '-70%', opacity: 0 }}
        animate={{ x: '70%', opacity: [0, 1, 0] }}
        transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.1 }}
      />
    </motion.div>
  );
}

function OceanJourney() {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#030c1d]"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.25 } }}
      transition={{ duration: 0.45, ease: EASE_CINEMATIC }}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/cargo-ship.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          filter: 'saturate(1.05) contrast(1.05) brightness(0.98)',
        }}
      />

      {/* Keep the ship visible instead of covering it with a heavy blue overlay. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030c1d]/10 via-transparent to-[#030c1d]/45" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(3,12,29,0.28)_100%)]" />

      <motion.div
        className="absolute inset-x-0 bottom-[16%] flex justify-center px-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: [0, 1, 0], y: [16, 0, -8] }}
        transition={{ duration: 1.05, times: [0, 0.25, 1], ease: 'easeOut' }}
      >
        <span className="text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-white drop-shadow-lg sm:text-xs sm:tracking-[0.5em]">
          From origin to destination
        </span>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#030c1d]/50 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
}

function PageReveal({ full }: { full: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#030c1d]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      {/* The video curtain moves up to reveal the destination page below. */}
      <motion.div
        className="absolute inset-0 bg-[#030c1d]"
        initial={{ y: '0%' }}
        animate={{ y: '-105%' }}
        transition={{
          duration: full ? 1.05 : 0.95,
          ease: EASE_DIVE,
        }}
      >
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/cargo-ship.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{
            filter: 'saturate(1.05) contrast(1.05) brightness(0.98)',
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030c1d]/10 via-transparent to-[#030c1d]/45" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(3,12,29,0.28)_100%)]" />

        {/* Subtle wave edge at the bottom of the moving curtain. */}
        <div className="absolute inset-x-0 bottom-0 h-[65px] bg-[#030c1d] sm:h-[90px]">
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            className="absolute -top-[64px] left-0 h-[66px] w-full sm:-top-[89px] sm:h-[91px]"
          >
            <path
              d="M0,100 L0,55 C180,90 360,15 720,48 C1080,82 1260,20 1440,52 L1440,100 Z"
              fill="#030c1d"
            />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ReducedFallback() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-[#030c1d]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col items-center gap-4 px-6">
        <LogoIntroReduced />
        <span className="h-px w-36 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <span className="text-center font-display text-2xl font-light tracking-[0.2em] text-ivory sm:tracking-[0.35em]">
          Meridians <span className="text-gold">Exports</span>
        </span>
        <span className="h-px w-36 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>
    </motion.div>
  );
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    setReduce(mq.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setReduce(event.matches);
    };

    mq.addEventListener?.('change', onChange);

    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return reduce;
}
