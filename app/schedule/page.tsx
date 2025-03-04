"use client";
import React from "react";
import dark from "@/assets/dark.png";
import bubble from "@/assets/pixelcut-export.png";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import MobileNavbar from "@/components/MobileNavbar";
import Navbar from "@/components/NavBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AcknowModal from "@/components/AcknowModal/AcknowModal";
import AddOns from "@/components/AddOns/AddOns";
import Tips from "@/components/Tips/Tips";
import { useOrder } from "@/contexts/orderContext";
import { Reorder } from "framer-motion";

const ScheduleWash = () => {
  return (
    <div className="w-full overflow-hidden flex flex-col items-center justify-center">
      <Navbar />
      <MobileNavbar />
      {/* <Hero /> */}
      <Booking />
      <Faq />
      <Footer />
      <ToastContainer position="top-center" autoClose={3000} />
      {/* <Footer /> */}
      {/* <Footer /> */}
    </div>
  );
};

export default ScheduleWash;

const Hero = () => {
  return (
    <div
      id="hero-section"
      className="relative h-screen  bg-cover w-full text-white   flex items-center justify-center"
      style={{ backgroundImage: `url(${bubble.src})` }}
    >
      <Image
        src={dark.src}
        alt=""
        className="w-full h-full object-cover -z-[1]"
      />
      <div className=" text-center  flex flex-col gap-6 items-center mt-10 absolute ">
        <h1 className=" font-medium md:text-[65px] text-6xl md:leading-[74px] ">
          Car wash at your <br className=" md:block hidden" />
          Doorstep?
        </h1>
        <p className=" font-medium text-[20px] leading-[30px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor <br />
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis
        </p>
        <div className=" shadow-2xl w-fit flex items-center justify-center text-center rounded-[10px] overflow-hidden">
          <button className="bg-[#D70006] text-white w-full px-8 py-4  font-semibold overflow-hidden">
            SCHEDULE WASH
          </button>
          <button className="bg-black text-white text-center font-semibold flex items-center justify-center px-8 py-4 w-[20%] whitespace-nowrap ">
            +
          </button>
        </div>
      </div>
    </div>
  );
};

type AvailableSlots = {
  [date: string]: string[]; // date as string, and slots as an array of strings
};

const Booking = () => {
  // const servicePrices: { [key: string]: string } = {
  //   "Car foam wash": "679",
  //   "Car + Bike combo": "899",
  //   "Bi Weekly": "1199",
  //   Weekly: "2199",
  // };

  const servicePrices: Record<string, number> = {
    "Car foam wash": 679,
    "Car + Bike combo": 899,
    "Bi Weekly": 1199,
    Weekly: 2199,
  };

  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedService, setSelectedService] = useState<string>("");
  // const [price, setPrice] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false); //added Modal
  const [ReOrderData, setReOrderData] = useState({
    price: "",
    phoneNumber: "",
    service: "",
    address: "",
    landmark: "",
    pincode: "",
    carType: "",
  });

  const [selectedTip, setSelectedTip] = useState<number | string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<
    { title: string; price: number }[]
  >([]); // Add Ons

  // Calculate total add-on price
  const addOnTotalPrice = selectedAddOns.reduce(
    (total, addon) => total + addon.price,
    0
  );
  const validTip = typeof selectedTip === 'number' ? selectedTip : 0;

  // Calculate total amount
  const totalAmount = price + addOnTotalPrice + validTip;

  const handleSelectedAddOns = (addOns: { title: string; price: number }[]) => {
    setSelectedAddOns(addOns);
  };

  const { selectedOrder } = useOrder(); // Reorder context

  useEffect(() => {
    if (selectedOrder) {
      setReOrderData({
        price: selectedOrder.price?.toString() || "",
        phoneNumber: selectedOrder.phoneNumber?.toString() || "",
        service: selectedOrder.service || "",
        address: selectedOrder.address || "",
        landmark: selectedOrder.landmark || "",
        pincode: selectedOrder.pincode || "",
        carType: selectedOrder.carType || "",
        
      });
  
      setSelectedService(selectedOrder.service || ""); 
      setPrice(selectedOrder.price || 0);  
    }
  }, [selectedOrder]);
  
  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    setPrice(servicePrices[service] ?? 0); // Ensure fallback to 0 if service not found
  };

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [selectedSlot, setSelectedSlot] = useState("");
  const [carType, setCarType] = useState("");

  const handleSlotChange = (e: any) => {
    setSelectedSlot(e.target.value);
    const [date, slot] = e.target.value.split("|");
    setSelectedDate(date);
    console.log("Selected Date:", date);
    console.log("Selected Slot:", slot);
  };

  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [isAddOnVisible, setAddonVisible] = useState(false);
  const [isTipVisible, setTipVisible] = useState(false);

  const handleAddonVisible = () => {
    setAddonVisible((prev) => !prev);
    setTipVisible(false);
  };

  const handleTipVisible = () => {
    setTipVisible((prev) => !prev);
    setAddonVisible(false);
  };

  // const [notes, setNotes] = useState("");

  const [slotsError, setSlotsError] = useState("");

  const [availableSlots, setAvailableSlots] = useState<{
    [date: string]: string[];
  }>({});

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await fetch("/api/available-slots");
        const data = await response.json();

        // Check if slots are actually available
        const hasAvailableSlots = Object.values(
          data as Record<string, string[]>
        ).some((slots) => slots.length > 0);

        if (!hasAvailableSlots) {
          setSlotsError(
            "No available slots at the moment. Please try another date."
          );
        }

        setAvailableSlots(data);
      } catch (error) {
        console.error("Error fetching available slots:", error);
        setSlotsError(
          "Unable to fetch available slots. Please try again later."
        );
        toast.error("Error fetching available slots.");
      }
    };

    fetchAvailableSlots();
  }, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/user"); // The API route to get user details
        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }
        const data = await response.json();
        setUserDetails({
          name: data.user.firstName + " " + (data.user.lastName || ""),
          email: data.user.email,
          phoneNumber: data.user.phoneNumber || "",
        });
      } catch (error) {
        console.log(error);
        toast.error("Unable to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // if (!availableSlots || Object.keys(availableSlots).length === 0) {
  //   return <div></div>;
  // }

  const initiatePayment = async (orderId: string) => {
    try {
      // Step 1: Make the request to the backend to create the Razorpay order
      const response = await fetch(`/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId, // Pass the MongoDB orderId to backend
        }),
      });

      console.log(orderId);

      const orderResult = await response.json();
      console.log("Order Result:", orderResult); // Log the response to ensure correct data

      if (!response.ok) {
        throw new Error(orderResult.message || "Failed to create order");
      }

      const { orderId: razorpayOrderId, key } = orderResult; // Extract Razorpay orderId and key
      if (!razorpayOrderId || !key) {
        console.error("Order ID or key is missing in Razorpay response");
        return;
      }

      console.log("Razorpay Order ID:", razorpayOrderId);

      const options = {
        key,
        amount: price * 100,
        currency: "INR",
        name: "MaxClean",
        description: `${selectedService} Service`,
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          console.log("Razorpay response:", response);

          // Step 3: Verify payment after successful payment
          const verifyResponse = await fetch("/api/payment/verify-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId, // MongoDB orderId for verification
            }),
          });

          const verifyResult = await verifyResponse.json();
          console.log("Verify Order Result:", verifyResult); // Log the verification result

          if (verifyResponse.ok) {
            toast.success("Payment successful!");
            resetForm();
            toast.loading("Redirecting...");
            setTimeout(() => {
              router.push("/order-history");
            }, 3000);
          } else {
            toast.error(verifyResult.message || "Payment verification failed");
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phoneNumber,
        },
        theme: {
          color: "#D70006",
        },
        modal: {
          ondismiss: async () => {
            // Handle cancellation scenario
            const response = await fetch("/api/payment/cancel-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId,
              }),
            });

            const data = await response.json();
            console.log("Cancel Order Result:", data);

            if (response.ok) {
              toast.info("Payment was cancelled.");
              resetForm();
            } else {
              toast.error("Failed to update payment status.");
            }
          },
        },
      };

      // Open Razorpay payment modal
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      setError(
        error instanceof Error ? error.message : "Payment initiation failed"
      );
    }
  };

  const handleModal = async () => {
    const errors = [];

    if (!userDetails.name.trim()) errors.push("Name is required");
    if (!userDetails.email.trim()) errors.push("Email is required");
    if (!userDetails.phoneNumber.trim() && !ReOrderData.phoneNumber)
      errors.push("Phone number is required");

    if (!carType && !ReOrderData.carType) errors.push("Car type is required");

    if (!selectedService && !ReOrderData.service)
      errors.push("Service selection is required");

    if (!selectedSlot) errors.push("Time slot is required");

    if (!(address.trim() || ReOrderData.address?.trim()))
      errors.push("Address is required");

    if (!(landmark.trim() || ReOrderData.landmark?.trim()))
      errors.push("Landmark is required");

    if (!pincode.trim() && !ReOrderData.pincode)
      errors.push("Pincode is required");
 
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    setShowModal(true);
  };

  const handlePayment = async () => {
    console.log("Beofre saving", address);

    try {
      const orderData = {
        name: userDetails.name.trim(),
        email: userDetails.email.trim(),
        phoneNumber: userDetails.phoneNumber.trim() || ReOrderData.phoneNumber,
        service: selectedService || ReOrderData.service,
        price: price || ReOrderData.price,
        address: address.trim() || ReOrderData.address.trim(),
        landmark: landmark.trim() || ReOrderData.landmark.trim(),
        pincode: pincode.trim() || ReOrderData.pincode,
        date: selectedDate,
        carType: carType || ReOrderData.carType,
        timeSlot: selectedSlot,
        isAcknowledged: isAcknowledged,
        tips: selectedTip,
        addOn: selectedAddOns,
      };
  
      console.log("After saving", address);

      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        await initiatePayment(data.orderId);
        setShowModal(false);
      } else {
        toast.error(data.message || "Order Confirmation failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    handleModal();
  };

  const handleModalClose = () => {
    setShowModal(false); // Close the modal
    if (isAcknowledged) {
      handlePayment(); // Initiate payment only if the checkbox is checked
    }
  };

  // Optional reset form function
  const resetForm = () => {
    setSelectedService("");
    setPrice(0);
    setSelectedSlot("");
    setSelectedDate("");
    setAddress("");
    setLandmark("");
    setPincode("");
    setCarType("");
    // setNotes("");
  };

  const handlePriceSelect = (price: number | string) => {
    setSelectedTip(price);
    console.log("Selected Tip:", price); // For debu
  };

  return (
    <div className="py-20 mt-10 w-full flex flex-col h-full items-center gap-14">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <h1 className="md:text-[60px] text-5xl text-center">
        Book an appointment <span className="text-[#D70006]">now</span>
      </h1>
      <div className="w-full flex flex-col md:flex-row gap-6 justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4 w-full md:w-1/2"
        >
          <div className="flex flex-col items-center md:flex-row gap-6 w-full">
            <input
              type="text"
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
              className="outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%]"
              placeholder="Name*"
            />
            <input
              type="email"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
              className="outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%]"
              placeholder="Email*"
            />
          </div>
          <div className="flex flex-col items-center md:flex-row gap-6 w-full">
            <input
              type="tel"
              value={
                userDetails.phoneNumber !== ""
                  ? userDetails.phoneNumber
                  : ReOrderData.phoneNumber
              }
              onChange={(e) => {
                if (
                  e.target.value.length <= 10 &&
                  /^\d*$/.test(e.target.value)
                ) {
                  setUserDetails({
                    ...userDetails,
                    phoneNumber: e.target.value,
                  });
                }
              }}
              maxLength={10}
              className="outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%]"
              placeholder="Mobile Number*"
            />
            <select
              value={selectedService !== "" ? selectedService : ReOrderData.service}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="block outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%]"
            >
              <option value="" disabled>
                Select a Service*
              </option>
              {Object.keys(servicePrices).map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-center md:flex-row gap-6 w-full">
            <input
              type="text"
              value={price || ReOrderData.price}
              readOnly
              className="outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%] cursor-not-allowed"
              placeholder="Price*"
            />
            <input
              type="number"
              value={pincode !== "" ? pincode : ReOrderData.pincode}
              maxLength={6}
              max={999999}
              min={100000}
              onChange={(e) => {
                if (e.target.value.length <= 6) {
                  setPincode(e.target.value);
                }
              }}
              className="outline-gray-500 rounded-[8px] bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-[50%]"
              placeholder="Pincode*"
            />
          </div>
          {/* Added carType */}
          <select
            id="carType"
            className="block bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-full outline-gray-500 rounded-[8px]"
            value={carType !== "" ? carType : ReOrderData.carType}
            onChange={(e) => setCarType(e.target.value)}
          >
            <option value="" disabled>
              Choose Car Type
            </option>
            <option value="Hatchback">Hatchback</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="MUV">MUV</option>
          </select>

          <select
            id="timeSlot"
            className="block bg-[#F7F8FA] px-4 py-4 w-[90%] md:w-full outline-gray-500 rounded-[8px]"
            value={selectedSlot ? `${selectedDate}|${selectedSlot}` : ""}
            onChange={(e) => {
              if (e.target.value) {
                const [date, slot] = e.target.value.split("|");
                setSelectedDate(date);
                setSelectedSlot(slot);
              } else {
                setSelectedDate("");
                setSelectedSlot("");
              }
            }}
          >
            <option value="" disabled>
              Choose a time slot
            </option>
            {Object.keys(availableSlots).length === 0 ? (
              <option disabled>No slots available</option>
            ) : (
              Object.keys(availableSlots).map((date) => {
                // Format the date to "Day Month Year" format
                const formattedDate = new Date(date).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                );

                // Only render the optgroup if there are available slots for that date
                return (
                  availableSlots[date].length > 0 && (
                    <optgroup key={date} label={formattedDate}>
                      {availableSlots[date].map((slot) => (
                        <option
                          key={`${date}|${slot}`}
                          value={`${date}|${slot}`}
                        >
                           {slot}
                        </option>
                      ))}
                    </optgroup>
                  )
                );
              })
            )}
          </select>
          {/* {selectedDate && selectedSlot && (
  <div className="selected-time">
    <span>{new Date(selectedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span> - <span>{selectedSlot}</span>
  </div>
)} */}

          <input
            type="text"
            value={address !== "" ? address : ReOrderData.address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-[#F7F8FA] w-[90%] md:w-full px-4 py-4 outline-gray-500 rounded-[8px]"
            placeholder="Address*"
          />
          <input
            type="text"
            value={landmark !== "" ? landmark : ReOrderData.landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="bg-[#F7F8FA] w-[90%] md:w-full px-4 py-4 outline-gray-500 rounded-[8px]"
            placeholder="Landmark*"
          />

          {/*
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-[#F7F8FA] mt-2 w-[90%] md:w-full px-4 py-4 h-60 outline-gray-500 rounded-[8px]"
            placeholder="Additional Notes (optional)"
          >

          </textarea>
          */}

          {/* Add on Feilds  */}

          {error && <div className="text-red-500">{error}</div>}

          <AcknowModal
            show={showModal}
            handleClose={handleModalClose}
            setIsAcknowledged={setIsAcknowledged}
          />
          <div className="flex flex-row gap-4 w-full md:pl-0 px-7">
            <button
              type="button"
              className="text-white text-md mt-2 bg-black px-2 py-1 whitespace-nowrap rounded-[8px] "
              onClick={handleAddonVisible}
            >
              Addon
            </button>
            <button
              type="button"
              className="text-white text-md mt-2 bg-black px-2 py-1 whitespace-nowrap rounded-[8px] "
              onClick={handleTipVisible}
            >
              Tips
            </button>
          </div>

          {isTipVisible && (
            <div className="w-[90%] md:w-full overflow-hidden justify-start">
              <Tips onPriceSelect={handlePriceSelect} />
            </div>
          )}

          {isAddOnVisible && (
            <div className="w-[90%] md:w-full overflow-hidden justify-start">
              <AddOns
                selectedAddOns={selectedAddOns}
                onSelectAddOns={handleSelectedAddOns}
              />
            </div>
          )}

<button
  type="submit"
  className="text-white text-xl w-[90%] md:w-full mt-2 bg-black whitespace-nowrap rounded-[8px] py-3"
>
  Pay Now - ₹{totalAmount}
</button>
        </form>

        {/* Sidebar */}
        <div className="hidden md:flex flex-col gap-10 py-12 px-8 bg-[#D70006] text-white rounded-[20px] w-full md:w-1/3">
        <div>
              <h1 className="text-2xl mb-2">For special order requests </h1>call
              us/whatsapp us @+91-8179987444
            </div>
          <div>
            <h1 className="text-3xl mb-2">Contact</h1>
            <p>
              Phone: <a href="tel:+91-8179987444">+91-8179987444 </a>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:maxcleanbusiness@gmail.com">
                maxcleanbusiness@gmail.com
              </a>
            </p>
          </div>
          <div>
            <h1 className="text-3xl mb-2">Timings</h1>
            <p> Monday - Sunday: 9:00 AM - 6:00PM</p>
            
           
          </div>
          <div>

          </div>
        </div>
      </div>
    </div>
  );
};
