import { motion } from 'framer-motion';

const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;

type LogoProps = {
  size?: number;
  className?: string;
  alt?: string;
};

/* Static logo mark — used in the header, footer, and anywhere a brand mark is needed. */
export function LogoMark({ size = 40, className = '', alt = 'Meridians Exports' }: LogoProps) {
  return (
    <img
      src="/logo.svg"
      width={size}
      height={size}
      alt={alt}
      className={`shrink-0 ${className}`}
      style={{ width: size, height: size }}
      loading="eager"
      decoding="async"
    />
  );
}

/* Animated logo used in the cinematic intro — fades in, scales up, with a gold light sweep. */
export function LogoIntro() {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.86, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_CINEMATIC, delay: 0.05 }}
    >
      <LogoMark size={88} className="relative z-10 drop-shadow-[0_4px_24px_rgba(200,172,112,0.25)]" />
      {/* gold light sweep across the logo */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.35 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(115deg, transparent 30%, rgba(244,240,231,0.35) 50%, transparent 70%)',
          }}
          initial={{ x: '-120%' }}
          animate={{ x: '120%' }}
          transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.35 }}
        />
      </motion.div>
    </motion.div>
  );
}

/* Compact animated mark for the reduced-motion fallback — a simple fade-in, no sweep. */
export function LogoIntroReduced() {
  return <LogoMark size={64} />;
}
