import { Steps, Hints } from 'intro.js-react';

import React, { Component } from 'react'
export default class Tour extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stepsEnabled: true,
      initialStep: 0,
      steps: [
        {
          element: ".hello",
          intro: "Hello step"
        },
        {
          element: ".world",
          intro: "World step"
        }
      ],
      hintsEnabled: true,
      hints: [
        {
          element: ".hello",
          hint: "Hello hint",
          hintPosition: "middle-right"
        }
      ]
    };
  }

  render() {
    const {
      stepsEnabled,
      steps,
      initialStep,
      hintsEnabled,
      hints
    } = this.state;

    return (
      <div>
        <Steps
          enabled={stepsEnabled}
          steps={steps}
          initialStep={initialStep}
          onExit={this.onExit}
        />
        <Hints enabled={hintsEnabled} hints={hints} />

        <div className="controls">
          <div>
            <button onClick={this.toggleSteps}>Toggle Steps</button>
            <button onClick={this.addStep}>Add Step</button>
          </div>
          <div>
            <button onClick={this.toggleHints}>Toggle Hints</button>
            <button onClick={this.addHint}>Add Hint</button>
          </div>
        </div>

        <h1 className="hello">Hello,</h1>
        <hr />
        <h1 className="world">World!</h1>
        <hr />
        <h1 className="alive">It's alive!</h1>
      </div>
    );
  }

  onExit = () => {
    this.setState(() => ({ stepsEnabled: false }));
  };

  toggleSteps = () => {
    this.setState(prevState => ({ stepsEnabled: !prevState.stepsEnabled }));
  };

  addStep = () => {
    const newStep = {
      element: ".alive",
      intro: "Alive step"
    };

    this.setState(prevState => ({ steps: [...prevState.steps, newStep] }));
  };

  toggleHints = () => {
    this.setState(prevState => ({ hintsEnabled: !prevState.hintsEnabled }));
  };

  addHint = () => {
    const newHint = {
      element: ".alive",
      hint: "Alive hint",
      hintPosition: "middle-right"
    };

    this.setState(prevState => ({ hints: [...prevState.hints, newHint] }));
  };
}


