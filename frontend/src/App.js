import "./App.scss";
import React from "react";
import Wrapper from "./components/Layout/Wrapper";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Wrapper />
    </BrowserRouter>
  );
}

export default App;
