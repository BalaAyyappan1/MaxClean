"use client";
import React, {useState} from 'react'
import Banner from "@/assets/pricing.png";
import MobileNav from "@/components/MobileNavbar";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Link from 'next/link';
import Image from 'next/image';

const PricingCard = () => {
  const [isSubscription, setIsSubscription] = useState(false);

  const oneTimePlans = [
    {
      title: "Car Foam Wash",
      price: "₹679",
      frequency: "/per wash",
      features: [
        "Exterior water wash",
        "Exterior foam wash",
        "Towel dry cleaning",
        "Interior vacuum",
        "Interior dusting & wiping",
        "Interior mat / carpet cleaning",
        "Glass clean and shine",
        "Air top up",
        "Tyre polish",
      ],
    },
    {
      title: "Car + Bike Wash Combo",
      price: "₹899",
      frequency: "/per wash",
      features: [
        "Exterior water wash",
        "Exterior foam wash",
        "Towel dry cleaning",
        "Interior vacuum",
        "Interior dusting & wiping",
        "Interior mat / carpet cleaning",
        "Glass clean and shine",
        "Air top up",
        "Tyre polish",
      ],
    },
  ];

  const subscriptionPlans = [
    {
      title: "Bi-weekly",
      price: "₹1199",
      frequency: "/month",
      features: [
        "Exterior water wash",
        "Exterior foam wash",
        "Towel dry cleaning",
        "Interior vacuum",
        "Interior dusting & wiping",
        "Interior mat / carpet cleaning",
        "Glass clean and shine",
        "Air top up",
        "Tyre polish",
      ],
    },
    {
      title: "Once a Week",
      price: "₹2199",
      frequency: "/month",
      features: [
        "Exterior water wash",
        "Exterior foam wash",
        "Towel dry cleaning",
        "Interior vacuum",
        "Interior dusting & wiping",
        "Interior mat / carpet cleaning",
        "Glass clean and shine",
        "Air top up",
        "Tyre polish",
      ],
    },
  ];

  const currentPlans = isSubscription ? subscriptionPlans : oneTimePlans;

  return (
    <>
      <Navbar />
      <MobileNav />
      
      {/* Banner Section with better responsive structure */}
      <div className='w-full'>
        <div className='relative h-[80vh] md:h-[100vh] w-full'>
          <Image 
            src={Banner} 
            alt="Pricing banner" 
            className='w-full h-full object-cover'
            priority
            fill
          />

          {/* Banner Content */}
          <div className='absolute inset-0 flex flex-col items-center  text-center px-4 top-1/4'>
            <h1 className="font-medium text-3xl lg:text-6xl text-white mb-2 md:mb-4">
              Pricing plans <br className="hidden md:block" />
              for a spotless ride
            </h1>
            <p className="text-sm lg:text-lg text-white/80 max-w-md md:max-w-2xl px-4 mb-4 md:mb-8">
              Keep your car and bike spotless and shining with our premium wash
              services. We offer flexible plans to suit every need and budget.
            </p>
            <div className="text-sm lg:text-base font-semibold flex gap-2 md:gap-4 items-center justify-center text-white">
              <span>Pay Once</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isSubscription}
                  onChange={() => setIsSubscription(!isSubscription)}
                />
                <div className="w-11 h-6 bg-[#D70006] rounded-full peer peer-checked:bg-[#D70006]">
                  <div className={`absolute top-1 left-1 bg-white rounded-full h-4 w-4 transition-transform ${isSubscription ? 'translate-x-5' : ''}`}></div>
                </div>
              </label>
              <span>Pay Monthly</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards - Using relative positioning with negative margin instead of absolute */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-[-100px] md:mt-[-120px] lg:mt-[-250px] relative z-10">
          <div className="flex flex-col md:flex-row flex-wrap justify-center gap-6 md:gap-8">
            {currentPlans.map((plan, index) => ( 
              <div
                key={index}
                className="w-full md:w-[calc(50%-16px)] lg:w-[calc(50%-32px)] max-w-lg mx-auto bg-white text-black shadow-md rounded-lg border-[0.5px] border-[#D70006]/50 pb-10 relative"
              >
                <div className="bg-black text-white py-4 md:py-5 text-lg md:text-[22px] text-center font-semibold rounded-t-lg">
                  {plan.title}
                </div>
                <div className="text-center">
                  <div className="p-4 md:p-6">
                    <h2 className="text-4xl md:text-6xl font-bold text-[#323232]">
                      {plan.price}
                      <span className="text-base md:text-xl font-normal text-[#636363] ml-1">
                        {plan.frequency}
                      </span>
                    </h2>
                  </div>
                  <ul className="mt-4 md:mt-6 px-4 md:px-6 py-8 md:py-14 bg-[#F5F5F5] space-y-2 md:space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-start gap-2 md:gap-3 text-sm md:text-base"
                      >
                        <span className="text-red-600">✔</span>
                        <span className="text-gray-800 font-bold">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={"/schedule"}
                    className="absolute bottom-0 w-full left-0 right-0 flex justify-center"
                  >
                    <button className="bg-black w-[60%] my-4 md:my-5 text-white rounded px-4 py-2 text-sm md:text-base">
                      Order Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section with proper spacing */}
        <div className="relative w-[90%] md:w-[85%] mx-auto mt-40 md:mt-48 lg:mt-56 rounded-xl py-12 md:py-16 bg-[#D70006] text-white mb-20 overflow-hidden">
  {/* Circles */}
  <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
  {/* Inner Circle */}
  <div className="w-[60vw] max-w-[80%] aspect-square border-2 md:border-4 border-white/30 rounded-full"></div>

  {/* Outer Circle */}
  <div className="absolute w-[80vw] max-w-[100%] aspect-square border-2 md:border-4 border-white/20 rounded-full"></div>
</div>


  {/* Content */}
  <div className="relative text-center px-4">
    <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Schedule a Wash</h2>
    <p className="text-sm md:text-xl text-white/80 mb-4 md:mb-6 max-w-md mx-auto">
      Book a wash now and see the magic for yourself! Get the #MAXPERIENCE!
    </p>
    <Link
      href="/schedule"
      className="inline-block px-4 py-2 md:px-6 md:py-3 bg-white text-[#D70006] rounded-lg font-semibold text-sm md:text-base hover:bg-gray-100 transition"
    >
      Book Order
    </Link>
  </div>
</div>

      </div>
      
      <Footer />
    </>  
  )
}

export default PricingCard;