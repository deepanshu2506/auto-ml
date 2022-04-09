import { Button, Form, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./Appbar.module.scss";
import { useState, } from "react";
import { connect } from 'react-redux';
import { userActions } from '../../../actions';

const Appbar = (props) => {
  const [isActive, setActive] = useState(true);
  //const { loggedIn,user } = useSelector(state => state.authentication);
  return (
    <Navbar bg="primary" className={styles.Appbar} variant="dark">
      <Link to="/">
        <Navbar.Brand>DATA GENIE</Navbar.Brand>
      </Link>
      <Nav className="mr-auto"></Nav>
      {props.loggedIn ?
        <Form inline>
          <Button variant="light" onClick={() => props.logout()}>
            Logout
          </Button>
        </Form> :
        <Form inline >
          <Link to="/login">
            <Button
              className={isActive ? styles.login : null}
              onClick={() => setActive(true)}>
              Login</Button>
          </Link>
          <Link to="/signup" className="ml-2">
            <Button
              className={isActive ? null : styles.login}
              onClick={() => setActive(false)}>Signup</Button>
          </Link>
        </Form>
      }
    </Navbar>
  );
};

function mapState(state) {
  const { loggedIn, user } = state.authentication;
  return { loggedIn }

}

const actionCreators = {
  logout: userActions.logout
}

const connectedAppbar = connect(mapState, actionCreators)(Appbar);
export { connectedAppbar as Appbar };
