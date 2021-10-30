import { Button, Form, FormControl, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./Appbar.module.scss";
const Appbar = (props) => (
  <Navbar bg="primary" className={styles.Appbar} variant="dark">
    <Link to="/">
      <Navbar.Brand>AUTO ML</Navbar.Brand>
    </Link>
    <Nav className="mr-auto"></Nav>
    <Form inline>
      <Link to="/login">
        <Button variant="light">Login</Button>
      </Link>
      <Link to="/signup">
        <Button variant="outline-light" className="ml-2">
          Signup
        </Button>
      </Link>
    </Form>
  </Navbar>
);

export default Appbar;
