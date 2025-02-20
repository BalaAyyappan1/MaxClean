"use client";

import { useState, useEffect } from "react";

interface ModalProps {
  show: boolean;
  handleClose: () => void;
  setIsAcknowledged: (value: boolean) => void;
}

const AcknowModal: React.FC<ModalProps> = ({ show, handleClose, setIsAcknowledged }) => {
  const [isChecked, setIsChecked] = useState(false);

  // Reset isChecked to false whenever the modal is open
  useEffect(() => {
    if (show) {
      setIsChecked(false); // Resetting the chcekbox
    }
  }, [show]);

  useEffect(() => {
    // Update the parent when the checkbox is checked/unchecked
    setIsAcknowledged(isChecked);
  }, [isChecked, setIsAcknowledged]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-100 sm:w-90">
      <div className="bg-white p-6 rounded-lg shadow-lg ">
        <h2 className="text-lg font-semibold text-gray-900 text-center mb-4">
          Terms & Conditions
        </h2>

        <div className="flex items-center justify-center mb-4">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            className="mr-2 w-5 h-5 cursor-pointer"
          />
          <span className="text-gray-700">
            I acknowledge that I have understood the terms and conditions.<br />
            I permit the car to be washed in the parking area and <br />
            confirm that no valuables are stored in the vehicle.
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isChecked) handleClose(); 
          }}
          className={`text-white text-xl w-[90%] md:w-full mt-2 bg-black whitespace-nowrap rounded-[8px] py-3 ${
            !isChecked ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-900"
          }`}
          disabled={!isChecked}
        >
          Agree
        </button>
      </div>
    </div>
  );
};

export default AcknowModal;
