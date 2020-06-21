import React from 'react';
import './App.scss';
import workflow from './workflow.json';
import {
  parseStepNameAndType,
  isStepActivated,
  getNextStep,
} from "./common";
import {Input} from './Input'
import {StepList} from "./StepList";

console.log('workflow: %o', workflow);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.steps = []; // Reading only after init
    this.state = {
      stepNumber: 0,
      stepValues: [],
      stepsCompleted: [],
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.handleStepClick = this.handleStepClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    // Flattening nested steps
    const steps = [];
    workflow.forEach(function pushStep(step) {
      steps.push(step)
      if (step.options) {
        let prevStringOption;
        step.options.forEach(option => {
          if (typeof option === 'string') {
            prevStringOption = option
          }
          if (typeof option === 'object') {
            // Assuming nested step object immediately follows targeted option value
            // Ie.  {options: ['option1', 'targeted option', nestedStepForPreviousValue]}
            pushStep({
              ...option,
              activatedBy: {
                nameAndType: step.nameAndType,
                value: prevStringOption.toLowerCase(),
              }
            })
          }
        })
      }
    })
    console.log('steps: ', this.steps = steps)
    // Initializing step values
    const stepValues = this.steps.map(s => {
      const inputType = parseStepNameAndType(s.nameAndType).pop();
      switch (inputType) {
        case 'select':
        case 'radio':
        case 'text':
          return '';
        case 'checkbox':
          // Providing initial value for all checkboxes (controlled)
          return Array(s.options.length).fill('');
        default:
          console.error('shouldn\'t get here')
          return '';
      }
    });
    console.log('stepValues: ', stepValues)
    this.setState({
      stepValues,
      stepsCompleted: Array(stepValues.length).fill(false)
    })
  }

  handleStepClick(stepNumber) {
    // Updating step number and completed status
    const currentStep = this.steps[this.state.stepNumber]
    const inputType = parseStepNameAndType(currentStep.nameAndType).pop();
    const stepsCompleted = this.state.stepsCompleted.slice();
    if (inputType === 'checkbox') {
      // Considering just viewing as completed
      stepsCompleted[this.state.stepNumber] = true;
    }
    this.setState({
      stepsCompleted,
      stepNumber,
    })
  }

  handleChange(event) {
    // Handling select/radio/text input types
    console.log(`handleChange: value ${event.target.value} stepNumber ${this.state.stepNumber}`)
    const stepValues = this.state.stepValues.slice();
    stepValues[this.state.stepNumber] = event.target.value;
    const stepsCompleted = this.state.stepsCompleted.slice();
    // Considering truthy values as completed
    stepsCompleted[this.state.stepNumber] = !!event.target.value;
    this.setState({
      stepValues,
      stepsCompleted,
      stepNumber: getNextStep( // Automatically advancing step
        this.state.stepNumber, this.steps, stepValues
      )
    })
  }

  handleCheckboxChange(e) {
    const stepValues = this.state.stepValues.slice();
    const stepValue = stepValues[this.state.stepNumber]
    const step = this.steps[this.state.stepNumber]
    const optionIndex = step.options.findIndex(
      o => o.toLowerCase() === e.target.value
    )
    stepValue[optionIndex] = e.target.checked ?
      e.target.value : ''
    stepValues[this.state.stepNumber] = stepValue
    const stepsCompleted = this.state.stepsCompleted.slice()
    // Do not automatically advance step
    stepsCompleted[this.state.stepNumber] = true;
    this.setState({
      stepValues,
      stepsCompleted,
    })
  }

  handleSubmit() {
    alert(
      JSON.stringify(this.state.stepValues)
    )
  }

  render() {
    if (this.state.stepNumber >= this.steps.length) {
      console.log('stepNumber too big')
      return null;
    }
    return (
      <div className="App">
        <ol className="steps">
          <StepList
            steps={this.steps}
            stepNumber={this.state.stepNumber}
            stepValues={this.state.stepValues}
            stepsCompleted={this.state.stepsCompleted}
            handleStepClick={this.handleStepClick}
          />
        </ol>
        <div className="input">
          <Input
            steps={this.steps}
            stepNumber={this.state.stepNumber}
            stepValues={this.state.stepValues}
            handleChange={this.handleChange}
            handleCheckboxChange={this.handleCheckboxChange}
          />
          <button
            onClick={this.handleSubmit}
            // Disable unless all steps complete
            disabled={
              this.state.stepsCompleted.findIndex(
                (isCompleted, stepNumber) => (
                  isCompleted === false &&
                  isStepActivated(stepNumber, this.steps, this.state.stepValues)
                )
              ) !== -1
            }
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default App;

