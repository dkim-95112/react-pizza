import React from "react";
import {parseStepNameAndType} from "./common";

export function Input(props) {
  const step = props.steps[props.stepNumber];
  const [stepName, inputType] = parseStepNameAndType(step.nameAndType);
  // Ie. ['Sauce', 'select']
  console.log(`Input: name ${stepName}, type ${inputType}`)
  const stepValue = props.stepValues[props.stepNumber]
  const stepOptions = step.options && step.options.filter(
    // Using only the string type options
    // Ie. ['Red sauce', 'White sauce']
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
              stepOptions.map(stepOption => { // Ie. 'Red sauce'
                return (
                  <option
                    key={stepOption}
                    value={stepOption.toLowerCase()}
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
              return (
                <div key={stepOption}>
                  <input
                    type="radio"
                    id={stepOption}
                    name={stepName.toLowerCase()}
                    value={stepOption.toLowerCase()}
                    checked={stepOption.toLowerCase() === stepValue}
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
              return (
                <div key={stepOption}>
                  <input
                    type="checkbox"
                    id={stepOption}
                    value={stepOption.toLowerCase()}
                    name={stepName.toLowerCase()}
                    checked={stepValue[optionIndex]} // Assuming 'option' or ''
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
