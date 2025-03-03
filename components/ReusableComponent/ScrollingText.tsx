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
    }, 1500); // Change every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="text-[50px] sm:text-[50px] md:text-[70px] lg:text-[90px] font-bold tracking-wider flex flex-col sm:flex-row items-center">
        {/* "MAX" in red - This will remain static */}
        <span className="text-white sm:mr-4 md:mr-6 lg:mr-8">MAX</span>

        {/* Responsive container for animated word */}
        <div className="relative w-full sm:w-[250px] md:w-[300px] lg:w-[400px] h-[60px] sm:h-[80px] md:h-[100px] lg:h-[130px] flex justify-center sm:justify-start items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentWordIndex}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute text-red-600"
            >
              {words[currentWordIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ScrollingText;
