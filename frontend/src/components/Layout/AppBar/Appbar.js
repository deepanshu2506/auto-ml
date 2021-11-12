import { Button, Form, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./Appbar.module.scss";

import { useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { userActions } from '../../../actions';

const Appbar = (props) => {
  //const { loggedIn,user } = useSelector(state => state.authentication);
  return (
  <Navbar bg="primary" className={styles.Appbar} variant="dark">
    <Link to="/">
      <Navbar.Brand>AUTO ML</Navbar.Brand>
    </Link>
    <Nav className="mr-auto"></Nav>
    {props.loggedIn ?
      <Form inline>
          <Button variant="light" onClick={()=>props.logout()}>
            Logout
          </Button>
      </Form> :
      <Form inline>
        <Link to="/login">
          <Button variant="light">Login</Button>
        </Link>
        <Link to="/signup">
          <Button variant="outline-light" className="ml-2">Signup</Button>
        </Link>
      </Form>
    }
  </Navbar>
  );
};

function mapState(state) {
  const { loggedIn,user } =  state.authentication;
  return {loggedIn}
 
}

const actionCreators = {
  logout: userActions.logout
}

const connectedAppbar = connect(mapState, actionCreators)(Appbar);
export { connectedAppbar as Appbar };
