import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const WorkflowStep = ({ steps }) => {
  return (
    <div className="mb-3 d-flex gap-4 align-items-center flex-wrap">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div
            className="border py-2 px-3 bg-white d-flex align-items-center gap-2 rounded small"
            style={{ minWidth: "fit-content" }}
          >
            {step.icon && (
              <img
                src={step.icon}
                alt={step.alt || step.label}
                width={24}
                height={24}
                className="object-fit-cover"
              />
            )}
            {step.label}
          </div>
          {index < steps.length - 1 && (
            <FaArrowRightLong className="text-brand" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WorkflowStep;
