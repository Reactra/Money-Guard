// src/components/dashboard/Balance.jsx
import React from "react";
import "./Balance.css";

const Balance = ({ amount, isLoading }) => {
  const isAmountValid = typeof amount === "number";

  const formattedAmount = isAmountValid
    ? amount.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";

  const balanceContent = isLoading ? (
    <span className="balance-loading">...</span>
  ) : (
    <>
      <span className="balance-icon">₴</span> {formattedAmount}
    </>
  );

  return (
    <div className="balance-card">
      <p className="balance-label">YOUR BALANCE</p>
      <h2 className="balance-amount">{balanceContent}</h2>
    </div>
  );
};

export default Balance;