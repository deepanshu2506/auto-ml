import React from "react";
import { Switch, Route, Redirect } from "react-router";
import { withRouter } from "react-router";
import items from "./Routes";
const DataContainer = (props) => {
  const genPaths = (item) => {
    const Component = withRouter(item.component);
    const routes = [];

    routes.push(
      <Route key={item.title} exact={item.exact} path={item.path}>
        <Component />
      </Route>
    );

    if (item.subRoutes) {
      for (const route of item.subRoutes) {
        routes.push(
          <Route key={route.title} path={item.path + route.path}>
            <route.component />
          </Route>
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
      <Route path="/" component={() => <Redirect to="/teams" />} />
    </Switch>
  );
};

export default React.memo(DataContainer);
