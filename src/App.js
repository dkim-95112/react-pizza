import React from 'react';
import './App.scss';
import workflow from './workflow.json';
import {parseStepNameAndType, isStepActivated} from "./Common";
import {Input} from './Input'

console.log('workflow: %o', workflow);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.steps = [];
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
    workflow.forEach((step) => {
      this.steps.push(step)
      if (step.options) {
        let prevStringOption;
        step.options.forEach(option => {
          if (typeof option === 'string') {
            prevStringOption = option
          }
          if (typeof option === 'object') {
            // Assuming nested step object immediately follows string option
            this.steps.push({
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
    console.log('steps: ', this.steps)
    // Initializing step values
    const stepValues = this.steps.map(s => {
      const inputType = parseStepNameAndType(s.nameAndType).pop();
      switch (inputType) {
        case 'select':
        case 'radio':
        case 'text':
          return '';
        case 'checkbox':
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
    const currentStep = this.steps[this.state.stepNumber]
    const inputType = parseStepNameAndType(currentStep.nameAndType).pop();
    const nextStepsCompleted = this.state.stepsCompleted.slice();
    if (inputType === 'checkbox') {
      // Just viewing is considered completing
      nextStepsCompleted[this.state.stepNumber] = true;
    }
    this.setState({
      stepsCompleted: nextStepsCompleted,
      stepNumber,
    })
  }

  handleChange(event) {
    console.log(`handleChange: value ${event.target.value} stepNumber ${this.state.stepNumber}`)
    const nextStepValues = this.state.stepValues.slice();
    nextStepValues[this.state.stepNumber] = event.target.value;
    const nextStepsCompleted = this.state.stepsCompleted.slice();
    // Considering truthy values as completed
    nextStepsCompleted[this.state.stepNumber] = !!event.target.value;
    this.setState({
      stepValues: nextStepValues,
      stepsCompleted: nextStepsCompleted,
    })
  }

  handleCheckboxChange(e) {
    const nextStepValues = this.state.stepValues.slice();
    let nextStepValue = nextStepValues[this.state.stepNumber]
    const step = this.steps[this.state.stepNumber]
    const optionIndex = step.options.findIndex(
      o => o.toLowerCase() === e.target.value
    )
    nextStepValue[optionIndex] = e.target.checked ? e.target.value : ''
    nextStepValues[this.state.stepNumber] = nextStepValue
    const nextStepsCompleted = this.state.stepsCompleted.slice()
    nextStepsCompleted[this.state.stepNumber] = true;
    this.setState({
      stepValues: nextStepValues,
      stepsCompleted: nextStepsCompleted,
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
    const steps = this.steps.map((step, stepNumber) => {
      const getClassNames = () => {
        const r = []
        if (stepNumber === this.state.stepNumber) {
          r.push('selected')
        }
        if (!isStepActivated(stepNumber, this.steps, this.state.stepValues)) {
          r.push('hidden')
        }
        return r.join(' ');
      }
      const stepValue = this.state.stepValues[stepNumber]
      // String, otherwise assuming array of strings
      const displayValue = typeof stepValue === 'string' ? stepValue : stepValue.join(', ')
      return (
        <li key={parseStepNameAndType(step.nameAndType).shift()}
            className={getClassNames()}
            onClick={() => this.handleStepClick(stepNumber)}
        >
          <span className="checkbox-label">
            <input
              type="checkbox"
              readOnly
              checked={this.state.stepsCompleted[stepNumber]}
            />
            {parseStepNameAndType(step.nameAndType).shift()}
          </span>
          ({this.state.stepsCompleted[stepNumber] ? displayValue : 'select'})
        </li>
      );
    });
    return (
      <div className="App">
        <ol className="steps">
          {steps}
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

