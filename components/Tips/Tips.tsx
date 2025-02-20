import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface TipsProps {
  onPriceSelect: (price: number | string) => void; // Callback to send selected price to parent
}

const Tips: React.FC<TipsProps> = ({ onPriceSelect }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTip, setCustomTip] = useState('');
  const [selectedTip, setSelectedTip] = useState<number | string | null>(null);

  // Handle click on predefined tips or "Other"
  const handleTipClick = (price: number | string) => {
    if (selectedTip === price) {
      setSelectedTip(null); 
      onPriceSelect(""); 
      setShowCustomInput(false); 
      setCustomTip(""); 
    } else if (price === "other") {
      setShowCustomInput(true); 
      setSelectedTip("other");
      setCustomTip("");
      onPriceSelect("");
    } else {
      setShowCustomInput(false); 
      setSelectedTip(price);
      onPriceSelect(price);
    }
  };
  
  // Handle custom tip input change
  const handleCustomTipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Allow only numbers and empty string
    if (/^\d*$/.test(value)) {
      setCustomTip(value);
      if (value !== "") {
        onPriceSelect(Number(value)); 
      } else {
        onPriceSelect(""); 
      }
    }
  };

  // Predefined tip options
  const data = [
    { price: 10 },
    { price: 20 },
    { price: 30 },
    { price: "other" }
  ];

  return (
    <div className="p-4 w-[90%]">
      <div className='flex gap-5 flex-wrap'>
        {data.map((item, index) => (
          <motion.div
            key={index}
            className={`border w-20 py-3 rounded-xl text-center cursor-pointer ${
              selectedTip === item.price
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-white"
            }`}
            onClick={() => handleTipClick(item.price)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.price === "other" ? "Other" : `₹${item.price}`}
          </motion.div>
        ))}
      </div>
      {showCustomInput && (
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <input
            type="text"
            placeholder="Enter custom tip amount"
            value={customTip}
            onChange={handleCustomTipChange}
            className="border p-2 rounded-xl w-full"
            inputMode="numeric" // Show numeric keyboard on mobile
          />
        </motion.div>
      )}
    </div>
  );
};

export default Tips;