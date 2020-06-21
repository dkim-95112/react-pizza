// Some helpers
export const parseStepNameAndType = (nameAndType) => {
  // Assuming format 'stepName(inputType)'
  const result = /^(.*)\((.*)\)/.exec(nameAndType);
  if (result === null) {
    console.error('Step format should be "stepName(inputType)". Got: ', nameAndType)
  }
  return result.slice(1); // Returns ['stepName', 'inputType']
}
export const isStepActivated = (stepNumber, steps, stepValues) => {
  const step = steps[stepNumber]
  if (step.activatedBy) {
    // Conditionally active
    const targetStepNumber = steps.findIndex(
      s => s.nameAndType === step.activatedBy.nameAndType
    )
    // By step, value & isActivated (recursive)
    return stepValues[targetStepNumber] === step.activatedBy.value &&
      isStepActivated(targetStepNumber, steps, stepValues)
  }
  return true; // Otherwise active
}

export const getNextStep = (stepNumber, steps, stepValues) => {
  if (stepNumber === steps.length - 1) {
    // Already at end
    return stepNumber;
  }
  let nextStepNumber = stepNumber;
  do {
    // Keep advancing to next activated step
    nextStepNumber++;
    if (isStepActivated(nextStepNumber, steps, stepValues)) {
      break;
    }
  } while (nextStepNumber < steps.length - 1);
  return nextStepNumber;
}
