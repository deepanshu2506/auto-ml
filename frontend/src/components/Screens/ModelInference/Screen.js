import { Container } from "react-bootstrap";
import styles from "./styles.module.scss";

const ModelInferenceScreen = (props) => {
  return (
    <Container className={`${styles.screen}   pt-3 pl-4 `} fluid>
      ModelInference Screen
    </Container>
  );
};

export default ModelInferenceScreen;
