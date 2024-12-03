import React from "react";

interface PaddedNumProps {
  number: number;
  maxNumber: number;
}

const PaddedNum: React.FC<PaddedNumProps> = ({ number, maxNumber }) => {
  const maxDigits = String(maxNumber).length;
  const currentDigits = String(number).length;
  const paddingNeeded = maxDigits - currentDigits;
  const padding = Array(paddingNeeded).fill("\u00A0").join("");

  return (
    <span>
      {padding}
      {number}
    </span>
  );
};

export default PaddedNum;
