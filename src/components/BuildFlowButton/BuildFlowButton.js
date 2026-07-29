import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const BuildFlowButton = () => {
  return (
    <button className="btn p-2 border border-brand d-flex align-items-center gap-2">
      Build this flow <FaArrowRight />
    </button>
  );
};

export default BuildFlowButton;
