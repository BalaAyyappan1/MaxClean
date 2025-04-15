import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = [
  "MAINTENANCE",
  "SERVICE",
  "QUALITY",
  "CONVENIENCE",
  "AFFORDABILITY",
  "CLEAN",
];

const ScrollingText = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000); // Change every 1.5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="text-center">
        <div className="text-5xl sm:text-5xl md:text-7xl lg:text-9xl font-bold tracking-wider flex flex-col space-y-10 items-center">
          {/* "MAX" in white - This will remain static */}
          <span className="text-white mb-2">MAX</span>
          
          {/* Container for animated word */}
          <div className="h-20 sm:h-24 md:h-28 lg:h-32 flex justify-center items-center relative">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWordIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute text-red-600"
              >
                {words[currentWordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollingText;