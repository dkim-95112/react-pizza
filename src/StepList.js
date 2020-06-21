import React from "react";
import {isStepActivated, parseStepNameAndType} from "./Common";

export function StepList(props) {
  return props.steps.map((step, stepNumber) => {
    const getClassNames = () => {
      const r = []
      if (stepNumber === props.stepNumber) {
        r.push('selected')
      }
      if (!isStepActivated(
        stepNumber, props.steps, props.stepValues,
      )) {
        r.push('hidden')
      }
      return r.join(' ');
    }
    const stepName = parseStepNameAndType(step.nameAndType).shift()
    const stepValue = props.stepValues[stepNumber]
    // String, otherwise assuming array of strings
    const displayValue = typeof stepValue === 'string' ?
      stepValue : stepValue.join(', ')
    return (
      <li key={stepName}
          className={getClassNames()}
          onClick={() => props.handleStepClick(stepNumber)}
      >
          <span className="checkbox-label">
            <input
              type="checkbox"
              readOnly
              checked={props.stepsCompleted[stepNumber]}
            />
            {stepName}
          </span>
        ({props.stepsCompleted[stepNumber] ? displayValue : 'select'})
      </li>
    );
  });
}
