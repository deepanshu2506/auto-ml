import "./App.scss";
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import CanvasJSReact from "./assets/canvasjs.react";
function App() {
  useEffect(() => {
    localStorage.setItem(
      "auth_token",
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYzNTY1NjgxMSwianRpIjoiMWRkMTdiOTAtNjI3NS00ODdjLWJlYTEtZTE1YjQwYWJhZDE5IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjYxN2UyNDVmMTczMmI5YWVjZThmNGVjZSIsIm5iZiI6MTYzNTY1NjgxMSwiZXhwIjoxNjM2MjYxNjExfQ.nuM1kQ3lacmfOXoNRUYiDuuyxxCvTPbg1Qz4g-JMBLE"
    );
  }, []);

  useEffect(() => {
    CanvasJSReact.CanvasJS.addColorSet("appTheme", ["#007bff"]);
  }, []);
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
