import { useState } from "react";

import "./statistics.css";
import CustomerTimes from "../modal/customerTImes/customerTimes";

export default function Statistics() {
  const [showCustomerTimes, setShowCustomerTimes] = useState(false);

  const showCustomerTimesMethod = () => {
    setShowCustomerTimes(false);
  };

  return (
    <>
      <div>
        <button
          onClick={() => setShowCustomerTimes(true)}
        >
          Clientes + veces
        </button>
        {showCustomerTimes && (
          <CustomerTimes 
          upPopup={showCustomerTimes}
          showCustomerTimesMethod={showCustomerTimesMethod}/>
        )}
      </div>
    </>
  );
}
