import { Button, Form, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./Appbar.module.scss";

import { userService } from '../../../services';
import { connect } from 'react-redux';
import { userActions } from '../../../actions';

const Appbar = (props) => (
  <Navbar bg="primary" className={styles.Appbar} variant="dark">
    <Link to="/">
      <Navbar.Brand>AUTO ML</Navbar.Brand>
    </Link>
    <Nav className="mr-auto"></Nav>
    {localStorage.getItem('user') ?
      <Form inline>
        <Link to="/login">
          <Button variant="light">Logout</Button>
        </Link>
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

//export default Appbar;
function mapState(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return { user, users };
}

const actionCreators = {
  getUsers: userActions.getAll,
  deleteUser: userActions.delete
}

const connectedAppbar = connect(mapState, actionCreators)(Appbar);
export { connectedAppbar as Appbar };
