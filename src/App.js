import React from 'react';
import './App.scss';
import workflow from './workflow.json';

console.log('workflow: %o', workflow);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.steps = [];
    this.state = {
      stepNumber: 0,
      stepValues: [],
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    // Flattening nested steps
    workflow.forEach((step) => {
      this.steps.push(step)
      if (step.options) {
        step.options.forEach(option => {
          if (typeof option === 'object') {
            this.steps.push(option)
          }
        })
      }
    })
    console.log('steps: ', this.steps)
    const stepValues = this.steps.map(
      s => s.options ? s.options[0].toLowerCase() : ''
    )
    console.log('stepValues: ', stepValues)
    this.setState({
      stepValues,
    })
  }

  handleClick(stepNumber) {
    this.setState({
      stepNumber,
    })
  }

  handleChange(event) {
    console.log(`handleChange: value ${event.target.value} stepNumber ${this.state.stepNumber}`)
    const stepValues = this.state.stepValues.slice();
    stepValues[this.state.stepNumber] = event.target.value;
    this.setState({
      stepValues,
    })
  }

  handleSubmit() {
    alert(this.state.stepValues)
  }

  render() {
    const steps = this.steps.map((step, stepNumber) => {
      return (
        <li key={stepNumber}
            className={stepNumber === this.state.stepNumber ? 'selected' : ''}
            onClick={() => this.handleClick(stepNumber)}
        >
          {step.step}
        </li>
      );
    });
    const input = (() => {
      if (this.state.stepNumber >= this.steps.length) {
        console.log('stepNumber too big')
        return;
      }
      const step = this.steps[this.state.stepNumber];
      const stepValue = this.state.stepValues[this.state.stepNumber]
      const [
        // eslint-disable-next-line
        unused,
        stepName,
        inputType
      ] = /^(.*)\((.*)\)/.exec(step.step);
      // Assuming format 'stepName(inputType)'
      console.log(`name ${stepName}, type ${inputType}`)
      const lowercaseStepName = stepName.toLowerCase();
      const stepOptions = step.options && step.options.filter(
        stepOption => typeof stepOption === 'string'
      )
      switch (inputType) {
        case 'select': {
          const options = stepOptions.map(stepOption => {
            const lowercaseOption = stepOption.toLowerCase();
            return (
              <option
                key={lowercaseOption}
                value={lowercaseOption}
              >{stepOption}</option>
            )
          })
          return (
            <div className="input">
              <label htmlFor={lowercaseStepName}>{stepName}</label>
              <select
                id={lowercaseStepName}
                value={stepValue}
                onChange={this.handleChange}
              >
                {options}
              </select>
            </div>
          )
        }
        case 'radio': {
          const options = stepOptions.map(stepOption => {
            const lowercaseOption = stepOption.toLowerCase();
            return (
              <div key={lowercaseOption}>
                <input
                  type="radio"
                  id={stepOption}
                  name={lowercaseStepName}
                  value={lowercaseOption}
                  checked={lowercaseOption === stepValue}
                  onChange={this.handleChange}
                />
                <label htmlFor={stepOption}>
                  {stepOption}
                </label>
              </div>
            )
          })
          return (
            <div>
              {options}
            </div>
          )
        }
        case 'checkbox':
          return (
            <div>
              <label htmlFor={lowercaseStepName}>{stepName}</label>
              <input
                id={lowercaseStepName}
                type={inputType}/>
            </div>
          );
        case 'text':
          return (
            <div>
              {stepName}
            </div>
          );
        default:
          console.error('Shouldn\'t get here')
      }
    })();
    return (
      <div className="App">
        <ol className="steps">
          {steps}
        </ol>
        <div className="input">
          {input}
          <button onClick={this.handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default App;

