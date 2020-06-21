import React from "react";
import {parseStepNameAndType} from "./Common";

export function Input(props) {
  const step = props.steps[props.stepNumber];
  const [stepName, inputType] = parseStepNameAndType(step.nameAndType);
  console.log(`name ${stepName}, type ${inputType}`)
  const lowercaseStepName = stepName.toLowerCase();
  const stepValue = props.stepValues[props.stepNumber]
  const stepOptions = step.options && step.options.filter(
    // Using only the string type options
    stepOption => typeof stepOption === 'string'
  )
  switch (inputType) {
    case 'select': {
      return (
        <div>
          <label htmlFor={stepName}>
            <h1>{stepName}</h1>
          </label>
          <select
            id={stepName}
            value={stepValue}
            onChange={props.handleChange}
          >
            <option value="">--Make selection</option>
            {
              stepOptions.map(stepOption => {
                const lowercaseStepOption = stepOption.toLowerCase();
                return (
                  <option
                    key={stepOption}
                    value={lowercaseStepOption}
                  >{stepOption}</option>
                )
              })
            }
          </select>
        </div>
      )
    }
    case 'radio': {
      return (
        <div>
          <h1>{stepName}</h1>
          {
            stepOptions.map(stepOption => {
              const lowercaseStepOption = stepOption.toLowerCase();
              return (
                <div key={lowercaseStepOption}>
                  <input
                    type="radio"
                    id={stepOption}
                    name={lowercaseStepName}
                    value={lowercaseStepOption}
                    checked={lowercaseStepOption === stepValue}
                    onChange={props.handleChange}
                  />
                  <label htmlFor={stepOption}>
                    {stepOption}
                  </label>
                </div>
              )
            })
          }
        </div>
      )
    }
    case 'checkbox':
      return (
        <div>
          <h1>{stepName}</h1>
          {
            stepOptions.map((stepOption, optionIndex) => {
              const lowercaseStepOption = stepOption.toLowerCase();
              return (
                <div key={stepOption}>
                  <input
                    type="checkbox"
                    id={stepOption}
                    value={lowercaseStepOption}
                    name={lowercaseStepName}
                    checked={stepValue[optionIndex]} // Assuming 'option' or false
                    onChange={props.handleCheckboxChange}
                  />
                  <label htmlFor={stepOption}>{stepOption}</label>
                </div>
              );
            })
          }
        </div>
      );
    case 'text':
      return (
        <div>
          <h1>{stepName}</h1>
          <input
            type="text"
            value={stepValue}
            onChange={props.handleChange}
          />
        </div>
      );
    default:
      console.error('Shouldn\'t get here')
  }
}
