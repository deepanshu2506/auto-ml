import React from "react";
import { Container, Row } from "react-bootstrap";
import { Redirect, useHistory, useLocation } from "react-router";
import Appbar from "./AppBar/Appbar";
import DataContainer from "./DataContainer";
import SideBar from "./SideBar";

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
