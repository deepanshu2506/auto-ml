import React from "react";
import { Switch, Route, Redirect } from "react-router";
import { withRouter } from "react-router";
import ProtectedRoute from "../router/ProtectedRoute";
import UnprotectedRoute from "../router/UnprotectedRoute";
import items from "./Routes";
const DataContainer = (props) => {
  const genPaths = (item) => {
    const Component = withRouter(item.component);
    const routes = [];
    props = { ...item, key: item.title };
    routes.push(
      item.auth ? (
        <ProtectedRoute {...props} component={Component} />
      ) : (
        <UnprotectedRoute {...props} component={Component} />
      )
    );

    if (item.subRoutes) {
      for (const route of item.subRoutes) {
        props = { ...item, key: item.title, path: item.path + route.path };
        routes.push(
          item.auth ? (
            <ProtectedRoute {...props} component={Component} />
          ) : (
            <UnprotectedRoute {...props} component={Component} />
          )
        );
      }
    }
    return routes;
  };

  const routes = items.reduce(
    (routes, currRoutes) => [...routes, ...genPaths(currRoutes)],
    []
  );

  return (
    <Switch>
      {routes}
      <Route path="/" component={() => <Redirect to="/datasets/" />} />
    </Switch>
  );
};

export default React.memo(DataContainer);
