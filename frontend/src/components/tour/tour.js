import { Steps, Hints } from 'intro.js-react';
import {useState } from "react";

import React from 'react'

const GuideScreen = () => {
  const [guide,setGuide]=useState({
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
  });
  const onExit = () => {
   

    setGuide(() => ({...guide, stepsEnabled: false }));
  

  };

  const toggleSteps = () => {
    setGuide(prevState => ({...guide, stepsEnabled: !prevState.stepsEnabled }));
  };

  const addStep = () => {
    const newStep = {
      element: ".alive",
      intro: "Alive step"
    };

    setGuide(prevState => ({...guide,  steps: [...prevState.steps, newStep] }));
  };

  const toggleHints = () => {
    setGuide(prevState =>({...guide,  hintsEnabled: !prevState.hintsEnabled }));
  };

  const addHint = () => {
    const newHint = {
      element: ".alive",
      hint: "Alive hint",
      hintPosition: "middle-right"
    };

    setGuide(prevState => ({...guide,  hints: [...prevState.hints, newHint] }));
  };
  return (
    <div>
      <Steps
        enabled={guide.stepsEnabled}
        steps={guide.steps}
        initialStep={guide.initialStep}
        onExit={onExit}
      />
      <Hints enabled={guide.hintsEnabled} hints={guide.hints} />

      <div className="controls">
        <div>
          <button onClick={toggleSteps}>Toggle Steps</button>
          <button onClick={addStep}>Add Step</button>
        </div>
        <div>
          <button onClick={toggleHints}>Toggle Hints</button>
          <button onClick={addHint}>Add Hint</button>
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
export default GuideScreen;