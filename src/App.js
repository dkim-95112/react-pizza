import React from 'react';
import './App.scss';
import workflow from './workflow.json';

console.log('workflow: %o', workflow);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepNumber: 0,
      stepValues: [],
    }
    // Flattening nested steps
    this.steps = [];
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
  }

  handleClick(stepNumber) {
    this.setState({
      stepNumber,
    })
  }

  handleChange(stepNumber, value) {
    // const input
    // this.setState({
    //   value:
    // })
  }

  render() {
    const steps = this.steps.map((step, index) => {
      return (
        <li key={index}
            onClick={() => this.handleClick(index)}
        >
          {step.step}
        </li>
      );
    });
    const input = (() => {
      const step = this.steps[this.state.stepNumber];
      const [
        // eslint-disable-next-line
        unused,
        stepName,
        inputType
      ] = /^(.*)\((.*)\)/.exec(step.step);
      // Assuming format 'stepName(inputType)'
      console.log(`name ${stepName}, type ${inputType}`)
      const lowercaseName = stepName.toLowerCase();
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
              <label htmlFor={lowercaseName}>{stepName}</label>
              <select id={lowercaseName}>
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
                  id={lowercaseOption}
                  value={lowercaseOption}
                />
                <label htmlFor={lowercaseOption}>
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
              <label htmlFor={lowercaseName}>{stepName}</label>
              <input id={lowercaseName}
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
        </div>
      </div>
    );
  }
}

export default App;

