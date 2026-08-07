import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const WorkflowStep = ({ steps }) => {
  return (
    <div className="mb-3 d-flex gap-3 align-items-center flex-wrap">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div
            className="border py-1 px-2 d-flex align-items-center gap-2 rounded-pill small"
            style={{ minWidth: "fit-content", backgroundColor: "#F5F3EE" }}
          >
            {step.icon && (
              <img
                src={step.icon}
                alt={step.alt || step.label}
                width={18}
                height={18}
                className="object-fit-cover"
              />
            )}
            {step.label}
          </div>
          {index < steps.length - 1 && (
            <FaArrowRightLong className="text-secondary" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WorkflowStep;
