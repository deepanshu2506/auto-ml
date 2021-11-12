import "./App.scss";
import React, { useEffect } from "react";
import { Router } from "react-router-dom";
import Layout from "./components/Layout";

import { history } from './helpers';
import { connect } from 'react-redux';
import { alertActions } from './actions';

import CanvasJSReact from "./assets/canvasjs.react";

const App = (props) => {
  if(props){
    history.listen((location, action) => {
      // clear alert on location change
      props.clearAlerts();
    });
  }
  useEffect(() => {
    CanvasJSReact.CanvasJS.addColorSet("appTheme", ["#007bff"]);
  }, []);

  const { alert } = props;
  return (
    <div>
      {alert.message &&
        <div className={`alert mb-0 ${alert.type}`}>{alert.message}</div>
      }
      <Router history={history}>
        <Layout />
      </Router>
    </div>
  );
}
function mapState(state) {
  const { alert } = state;
  return { alert };
}

const actionCreators = {
  clearAlerts: alertActions.clear
};

const connectedApp = connect(mapState, actionCreators)(App);
export { connectedApp as App };



