import "./App.scss";
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import CanvasJSReact from "./assets/canvasjs.react";
function App() {
  useEffect(() => {
    localStorage.setItem(
      "auth_token",
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYzNjM0ODcyNiwianRpIjoiMzAzOGNmNzQtNGY3YS00YmIyLWI5ZjItNDZjM2UyMmY3M2U5IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjYxN2UyNDVmMTczMmI5YWVjZThmNGVjZSIsIm5iZiI6MTYzNjM0ODcyNiwiZXhwIjoxNjM2OTUzNTI2fQ.KO4tHn18jGtNPgtjVX7-dfmf8HBmUMUU7F0hy0muULE"
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
