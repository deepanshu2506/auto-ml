import { Button, Form, FormControl, Nav, Navbar } from "react-bootstrap";
import "./Appbar.scss";
const Appbar = (props) => (
  <Navbar bg="primary" className="appbar" variant="dark">
    <Navbar.Brand href="#home">
      <img
        alt=""
        src="/ipl-logo.svg"
        width="100"
        className="d-inline-block align-top"
      />
    </Navbar.Brand>
    <Nav className="mr-auto"></Nav>
    <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <Button variant="outline-light">Search</Button>
    </Form>
  </Navbar>
);

export default Appbar;
