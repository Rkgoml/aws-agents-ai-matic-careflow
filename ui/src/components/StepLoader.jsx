import React, { useState, useEffect } from "react";

export default function StepLoader() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 0, label: "Analyzing your selected use case..." },
    { id: 1, label: "Creating a new dynamic agent profile..." },
    { id: 2, label: "Designing the architecture flow..." },
    { id: 3, label: "Finalizing and bringing your agent online..." },
  ];

 useEffect(() => {
   const totalSteps = steps.length;
   const intervalTime = 60000 / totalSteps; 

   const interval = setInterval(() => {
     setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
   }, intervalTime);

   return () => clearInterval(interval);
 }, []);


  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="flex items-center gap-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="relative">
              <svg
                width="200"
                height="220"
                viewBox="0 0 200 220"
                className="drop-shadow-md"
              >
                <polygon
                  points="100,10 180,60 180,160 100,210 20,160 20,60"
                  fill={currentStep === index ? "#f97316" : "#a8a29e"}
                  stroke={currentStep === index ? "#ea580c" : "transparent"}
                  strokeWidth="4"
                  className="transition-all duration-500"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center px-8">
                <p
                  className={`text-center text-sm font-medium leading-tight transition-colors duration-500 ${
                    currentStep === index ? "text-black" : "text-white"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`h-1 w-8 transition-colors duration-500 ${
                  currentStep > index ? "bg-orange-500" : "bg-stone-400"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
