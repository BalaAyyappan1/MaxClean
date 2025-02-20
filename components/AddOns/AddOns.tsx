"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import greeceBoxImage from "@/public/Addons/greeseboximage.jpeg";

interface AddOnsProps {
  selectedAddOns: { title: string; price: number }[];
  onSelectAddOns: (addOns: { title: string; price: number }[]) => void;
}

const AddOns: React.FC<AddOnsProps> = ({ selectedAddOns, onSelectAddOns }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  const data = [
    {
      //   id: 1,
      title: "Wax, brings ultimate shine (Lasts 7-10 days)",
      price: 269,
      image: greeceBoxImage,
    },
    {
      //   id: 2,

      title: "Seat foam cleaning, leather only (May get rid of light stains)",
      price: 299,
      image: greeceBoxImage,
    },
    {
      //   id: 3,

      title:
        "Trim revival, for original black color and shine to the exterior vinyl/plastic parts",
      price: 299,
      image: greeceBoxImage,
    },
    {
      //   id: 4,

      title: "Value caps for wheels (Set of 4)",
      price: 20,
      image: greeceBoxImage,
    },
    {
      //   id: 5,
      title:
        "Engine bay cleaning, no machine usage. Hand wash and polish on vinyl/plastic",
      price: 119,
      image: greeceBoxImage,
    },

    {
      //   id: 6,

      title: "Pet hair removal",
      price: 139,
      image: greeceBoxImage,
    },
    {
      //   id: 7,
      title:
        "Greasing in essential parts, grease top-up in all essential grease points",
      price: 199,
      image: greeceBoxImage,
    },
    {
      //   id: 8,
      title: "Windshield washer fluid top-up",
      price: 99,
      image: greeceBoxImage,
    },
  ];

  const toggleAddOn = (index: number) => {
    const addOn = data[index];
    const isAlreadySelected = selectedAddOns.some(
      (addon) => addon.title === addOn.title
    );

    let updatedAddOns;
    if (isAlreadySelected) {
      updatedAddOns = selectedAddOns.filter((addon) => addon.title !== addOn.title);
    } else {
      updatedAddOns = [...selectedAddOns, { title: addOn.title, price: addOn.price }];
    }

    // Update the state with the new list of selected add-ons
    onSelectAddOns(updatedAddOns);
  };
  
  useEffect(() => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      setDragConstraints({
        left: -(scrollWidth - clientWidth),
        right: 0,
      });
    }
  }, []);

  return (
    <div className="p-4 w-[90%] mx-auto md:w-full">

      <div className="relative">
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l to-transparent pointer-events-none z-10" />
        <motion.div
          className="flex flex-nowrap gap-5"
          ref={containerRef}
          style={{ cursor: "grab" }}
          drag="x" // Enable horizontal drag
          dragConstraints={dragConstraints}
          dragElastic={0.1} // Add a slight bounce effect
        >
          {data.map((item, index) => (
            <motion.div
              key={index}
              className={`p-4 border rounded-xl cursor-pointer flex-shrink-0 w-[270px] sm:w-[300px] ${selectedAddOns.some((addon) => addon.title === item.title)
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-white"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleAddOn(index)}
            >
              <div className="flex items-center gap-4 h-full">
                <div className="w-20 h-20 relative flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
      
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div className="flex flex-col justify-between h-full">
                  <h3 className="font-semibold text-sm line-clamp-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">₹{item.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AddOns;
