import React from "react";
import { Container, Row } from "react-bootstrap";
import {Appbar} from "./AppBar/Appbar";
import DataContainer from "./DataContainer";

const Layout = (props) => {
  return (
    <React.Fragment>
      <Appbar />
      <Container fluid>
        <Row>
          <DataContainer />
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Layout;
