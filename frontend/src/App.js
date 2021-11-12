import "./App.scss";
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import CanvasJSReact from "./assets/canvasjs.react";
function App() {
  useEffect(() => {
    localStorage.setItem(
      "auth_token",
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYzNjQ3MDM2NCwianRpIjoiNThlMmI1NGEtYWM4NC00MWRmLWJlOGUtZWUzOTJkNDViYjVmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjYwZjkxOGVjYTU3MTRkZmY3YjdmN2VjOCIsIm5iZiI6MTYzNjQ3MDM2NCwiZXhwIjoxNjM3MDc1MTY0fQ.XtZjB_XtE2FPHLXddncJWVQuUp11OBpXaVL-WYsXphA"
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
