"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import greeceBoxImage from "@/public/Addons/greeseboximage.jpeg";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface AddOnsProps {
  selectedAddOns: { title: string; price: number }[];
  onSelectAddOns: (addOns: { title: string; price: number }[]) => void;
}

const AddOns: React.FC<AddOnsProps> = ({ selectedAddOns, onSelectAddOns }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  // Track if user is currently scrolling with mouse/touch
  const isScrolling = useRef(false);
  // Store the last scroll position
  const lastScrollLeft = useRef(0);
  // Store animation frame ID for cleanup
  const animationFrame = useRef<number | null>(null);

  const data = [
    {
      title: "Wax, brings ultimate shine (Lasts 7-10 days)",
      price: 269,
      image: greeceBoxImage,
    },
    {
      title: "Seat foam cleaning, leather only (May get rid of light stains)",
      price: 299,
      image: greeceBoxImage,
    },
    {
      title: "Trim revival, for original black color and shine to the exterior vinyl/plastic parts",
      price: 299,
      image: greeceBoxImage,
    },
    {
      title: "Value caps for wheels (Set of 4)",
      price: 20,
      image: greeceBoxImage,
    },
    {
      title: "Engine bay cleaning, no machine usage. Hand wash and polish on vinyl/plastic",
      price: 119,
      image: greeceBoxImage,
    },
    {
      title: "Pet hair removal",
      price: 139,
      image: greeceBoxImage,
    },
    {
      title: "Greasing in essential parts, grease top-up in all essential grease points",
      price: 199,
      image: greeceBoxImage,
    },
    {
      title: "Windshield washer fluid top-up",
      price: 99,
      image: greeceBoxImage,
    },
  ];

  // Implement smooth inertia scrolling
  const smoothScroll = (targetScrollLeft: number) => {
    if (!containerRef.current) return;
    
    // Calculate distance to target
    const container = containerRef.current;
    const currentScrollLeft = container.scrollLeft;
    const distance = targetScrollLeft - currentScrollLeft;
    
    // If distance is very small, just set it directly
    if (Math.abs(distance) < 0.5) {
      container.scrollLeft = targetScrollLeft;
      return;
    }
    
    // Apply easing (adjust the division factor to change speed - smaller = faster)
    const newScrollLeft = currentScrollLeft + distance * 0.2;
    container.scrollLeft = newScrollLeft;
    
    // Continue animation
    animationFrame.current = requestAnimationFrame(() => smoothScroll(targetScrollLeft));
  };

  // Enhanced wheel handling with inertia
  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();
    
    // Cancel any ongoing smooth scroll
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    
    const container = containerRef.current;
    
    // Apply speed multiplier (higher = faster)
    const scrollSpeed = 2.5;
    const targetScrollLeft = container.scrollLeft + (e.deltaY * scrollSpeed);
    
    // Start smooth scroll to target
    isScrolling.current = true;
    lastScrollLeft.current = targetScrollLeft;
    smoothScroll(targetScrollLeft);
    
    // Set a timeout to stop scrolling after wheel events end
    setTimeout(() => {
      isScrolling.current = false;
    }, 100);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Set up wheel event
    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      
      // Apply speed multiplier (higher = faster)
      const scrollSpeed = 1.5;
      const targetScrollLeft = container.scrollLeft + (e.deltaY * scrollSpeed);
      
      // Cancel any ongoing smooth scroll
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      
      // Start smooth scroll to target
      isScrolling.current = true;
      lastScrollLeft.current = targetScrollLeft;
      smoothScroll(targetScrollLeft);
    };
    
    // Add event listener with passive: false to allow preventDefault
    container.addEventListener('wheel', wheelHandler, { passive: false });
    
    // Cleanup
    return () => {
      container.removeEventListener('wheel', wheelHandler);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

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

    onSelectAddOns(updatedAddOns);
  };

  return (
    <div className="p-4 w-[90%] mx-auto md:w-full">
      <div className="relative">
        {/* <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" /> */}
        
        <div
          ref={containerRef}
          className="overflow-x-auto py-4"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
          onWheel={handleWheel}
        >
          <div
            ref={sliderRef}
            className="flex gap-5 w-max"
          >
            {data.map((item, index) => (
              <motion.div
                key={index}
                className={`p-4 border rounded-xl cursor-pointer flex-shrink-0 w-[270px] sm:w-[300px] ${
                  selectedAddOns.some((addon) => addon.title === item.title)
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOns;