import React from 'react';

export type StepState = 'pending' | 'active' | 'done' | 'rejected';

export interface Step {
  label: string;
  state: StepState;
}

interface ProgressStepsProps {
  steps: Step[];
}

export function ProgressSteps({ steps }: ProgressStepsProps) {
  const icon = (s: StepState) => {
    if (s === 'done') return '✅';
    if (s === 'active') return '⏳';
    if (s === 'rejected') return '❌';
    return '⬜';
  };

  const labelColor = (s: StepState) => {
    if (s === 'done') return 'text-green-700';
    if (s === 'active') return 'text-yellow-700 font-bold';
    if (s === 'rejected') return 'text-red-700 font-bold';
    return 'text-gray-400';
  };

  return (
    <div className="flex items-center gap-1 pt-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <span className="text-lg">{icon(step.state)}</span>
            <span className={`text-[10px] text-center mt-1 leading-tight ${labelColor(step.state)}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="h-px flex-1 bg-gray-200 mb-4 mx-1" />
          )}
        </div>
      ))}
    </div>
  );
}
