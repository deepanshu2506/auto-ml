import { Container } from "react-bootstrap";
import styles from "./styles.module.scss";

const DatasetInfoScreen = (props) => {
  return (
    <Container className={`${styles.screen} pt-3 pl-4 `} fluid>
      Dataset info screen
    </Container>
  );
};

export default DatasetInfoScreen;
