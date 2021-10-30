import { Col, Container, Row } from "react-bootstrap";
import { Redirect, withRouter } from "react-router";
import SideBar from "../Layout/SideBar";
import styles from "./styles.module.scss";
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = true;
  return isAuthenticated ? (
    <>
      <Container fluid className={styles.content}>
        <Row className={styles.datacontainer} style={{ flex: "auto" }}>
          <Col md={2} className={styles.sidebar}>
            <SideBar />
          </Col>
          <Col className={styles.datadiv} md={10}>
            <Component {...rest} rootParams={rest.computedMatch} />
          </Col>
        </Row>
      </Container>
    </>
  ) : (
    <Redirect to="/login" />
  );
};

export default withRouter(ProtectedRoute);
