
import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OceanTransition } from '@/components/OceanTransition';
import { ScrollToTop } from '@/components/ScrollToTop';

import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Products } from '@/pages/Products';
import { Downloads } from '@/pages/Downloads';
import { Contact } from '@/pages/Contact';

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();
  const firstPath = useRef(location.pathname);
  const [isFull, setIsFull] = useState(true);
  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    // Do not trigger a second transition on the initial render.
    if (firstPath.current === location.pathname) return;

    firstPath.current = location.pathname;
    setIsFull(false);
    setTransitionKey((key) => key + 1);
  }, [location.pathname]);

  return (
    <>
      <OceanTransition
        trigger={`${location.pathname}-${transitionKey}`}
        full={isFull}
      />

      <ScrollToTop />
      <Header />

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={<PageTransition><Home /></PageTransition>}
            />
            <Route
              path="/about"
              element={<PageTransition><About /></PageTransition>}
            />
            <Route
              path="/products"
              element={<PageTransition><Products /></PageTransition>}
            />
            <Route
              path="/downloads"
              element={<PageTransition><Downloads /></PageTransition>}
            />
            <Route
              path="/contact"
              element={<PageTransition><Contact /></PageTransition>}
            />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}

export default App;
