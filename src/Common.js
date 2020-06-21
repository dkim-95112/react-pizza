export const parseStepNameAndType = (nameAndType) => {
  // Assuming format 'stepName(inputType)'
  const result = /^(.*)\((.*)\)/.exec(nameAndType);
  if (result === null) {
    console.error('Step format should be "stepName(inputType)". Got: ', nameAndType)
  }
  return result.slice(1);
}
export const isStepActivated = (stepNumber, steps, stepValues) => {
  const step = steps[stepNumber]
  if (step.activatedBy) {
    // Conditionally active
    const targetIndex = steps.findIndex(
      s => s.nameAndType === step.activatedBy.nameAndType
    )
    return stepValues[targetIndex] === step.activatedBy.value
  }
  return true; // Otherwise active
}

export const getNextStep = (stepNumber, steps, stepValues) => {
  if (stepNumber === steps.length - 1) {
    return stepNumber;
  }
  let nextStepNumber = stepNumber;
  do {
    nextStepNumber++;
    if (isStepActivated(nextStepNumber, steps, stepValues)) {
      break;
    }
  } while (nextStepNumber < steps.length - 1);
  return nextStepNumber;
}
