import "./App.scss";
import React, {Component,useEffect } from "react";
import { Router } from "react-router-dom";
import Layout from "./components/Layout";

import { history } from './helpers';
import { connect } from 'react-redux';
import { alertActions } from './actions';

import CanvasJSReact from "./assets/canvasjs.react";

class App extends Component {
  constructor(props) {
    super(props);

    history.listen((location, action) => {
      // clear alert on location change
      this.props.clearAlerts();
    });

    useEffect(() => {
      CanvasJSReact.CanvasJS.addColorSet("appTheme", ["#007bff"]);
    }, []);
  }

  render() {
    const { alert } = this.props;
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



