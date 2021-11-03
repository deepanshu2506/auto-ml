import "./App.scss";
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import CanvasJSReact from "./assets/canvasjs.react";
function App() {
  useEffect(() => {
    localStorage.setItem(
      "auth_token",
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYzNTQ4NzQ4MiwianRpIjoiNjBlMjNkZmEtZmE3Ni00NmNjLWFlODctZGRlODhkZGMxYTY0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjYwZjkxOGVjYTU3MTRkZmY3YjdmN2VjOCIsIm5iZiI6MTYzNTQ4NzQ4MiwiZXhwIjoxNjM2MDkyMjgyfQ.nfFr3RKElOusDsvlrlSJL7keIFgPBHz68wsBGRVXee8"
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
