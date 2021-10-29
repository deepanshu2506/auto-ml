import React from "react";

import { Container, Col, Row } from "react-bootstrap";
import "./Wrapper.scss";
import DataContainer from "./DataContainer";
import SideBar from "./SideBar";
import Appbar from "./AppBar/Appbar";

const Wrapper = (props) => {
  return (
    <React.Fragment>
      <Appbar />
      <Container fluid className="content">
        <Row className="data-container" style={{ flex: "auto" }}>
          <Col md={2} className="sidebar">
            <SideBar />
          </Col>
          <Col className="data-div" md={10}>
            <DataContainer />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Wrapper;
