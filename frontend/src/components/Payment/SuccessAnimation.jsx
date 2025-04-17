import React from "react";
import "./SuccessAnimation.css";

export default function SuccessAnimation() {
  return (
    <div className="success-container">
      <div className="checkmark-circle">
        <div className="checkmark"></div>
      </div>
      <h2 className="success-text">Payment Successful</h2>
      <p>
        You will be redirected in few seconds. Thank you for ordering from
        Mealhub 😊
      </p>
    </div>
  );
}
