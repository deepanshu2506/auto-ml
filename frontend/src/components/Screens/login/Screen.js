import { Container } from "react-bootstrap";
import styles from "./styles.module.scss";

const LoginScreen = (props) => {
  return (
    <Container className={`${styles.screen}   pt-3 pl-4 `} fluid>
      Login Screen
    </Container>
  );
};

export default LoginScreen;
