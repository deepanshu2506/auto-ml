import { withRouter } from "react-router";

const UnprotectedRoute = ({ component: Component, ...rest }) => {
  return <Component rootParams={rest.computedMatch} {...rest} />;
};

export default withRouter(UnprotectedRoute);
