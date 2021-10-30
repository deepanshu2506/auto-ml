import { Container, Nav, Row } from "react-bootstrap";
import { useState } from "react";
import styles from "./styles.module.scss";
import CSVUploadForm from "./csvUploaodForm";
import DatabaseConnectionForm from "./DatabaseConnectionForm";

const DATASET_INPUT_TYPES = {
  CSV: "CSV",
  DB: "DB",
};

const InputDatasetScreen = (props) => {
  const [inputType, setInputType] = useState(DATASET_INPUT_TYPES.DB);
  const changeUploadType = (eventKey) => setInputType(eventKey);
  return (
    <Container
      className={`${styles.screen} ${styles.inputDatasetScreen}  pt-3 pl-4 `}
      fluid
    >
      <Row className={styles.nav}>
        <Nav
          onSelect={changeUploadType}
          variant="pills"
          defaultActiveKey={DATASET_INPUT_TYPES.DB}
        >
          <Nav.Item>
            <Nav.Link eventKey={DATASET_INPUT_TYPES.CSV}>CSV</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={DATASET_INPUT_TYPES.DB}>Database</Nav.Link>
          </Nav.Item>
        </Nav>
      </Row>
      <Row className={styles.content}>
        {inputType === DATASET_INPUT_TYPES.CSV && <CSVUploadForm />}
        {inputType === DATASET_INPUT_TYPES.DB && <DatabaseConnectionForm />}
      </Row>
    </Container>
  );
};

export default InputDatasetScreen;
