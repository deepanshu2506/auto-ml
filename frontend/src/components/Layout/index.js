import React from "react";
import { Container, Row } from "react-bootstrap";
import Appbar from "./AppBar/Appbar";
import DataContainer from "./DataContainer/DataContainer";
import SideBar from "./SideBar/SideBar";

const Layout = (props) => {
  return (
    <React.Fragment>
      <Appbar />
      <Container fluid>
        <Row>
          <SideBar />
          <DataContainer />
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Layout;
