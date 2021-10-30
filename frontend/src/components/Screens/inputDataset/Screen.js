import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Nav,
  Row,
  Table,
} from "react-bootstrap";
import { useRef, useState } from "react";
import styles from "./styles.module.scss";
import papa from "papaparse";

const DATASET_INPUT_TYPES = {
  CSV: "CSV",
  DB: "DB",
};
const CSVUploadForm = () => {
  const [state, setState] = useState({});
  const [datasetDetails, setDatasetDetails] = useState({});
  const [validated, setValidated] = useState(false);
  const fileRef = useRef(null);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false || !state.file) {
      if (!state.file) {
        alert("Upload a CSV dataset file");
      }
      setValidated(true);
    } else {
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    papa.parse(file, {
      preview: 20,
      header: true,
      complete: (results, file) => {
        console.log(file);
        setDatasetDetails({
          fileName: file.name,
          rowCount: results.meta.cursor,
          fields: results.meta.fields,
          preview: results.data,
        });
        setState((prev) => ({ ...prev, file }));
      },
    });
  };

  const triggerFileUpload = () => {
    fileRef.current.click();
  };
  return (
    <Form
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
      className={`w-100`}
    >
      <Container fluid>
        <Row>
          <Form.Group as={Col} md="6" controlId="dataset-name">
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder="Dataset Name"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    dataset_name: e.target.value,
                  }));
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter a dataset name.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          {/* <Col className={styles.submitButton}> */}
          <Form.Group as={Col} md="6" controlId="dataset-name">
            <InputGroup hasValidation>
              <Button block type="submit">
                CREATE DATASET
              </Button>
              <Form.Control.Feedback type="invalid">
                Please enter a dataset name.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          {/* </Col> */}
        </Row>
        {!state.file && (
          <Row>
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e)}
              ref={fileRef}
              autoFocus
              multiple={false}
            />

            <Col md={12}>
              <div onClick={triggerFileUpload} className={styles.fileUpload}>
                <h2>Click Here to Upload CSV File</h2>
              </div>
            </Col>
          </Row>
        )}
        {state.file && datasetDetails.fields && (
          <>
            <p
              className={styles.legend}
            >{`${datasetDetails.fileName} (showing 20 of ${datasetDetails.rowCount})`}</p>
            <Row className={`${styles.tablecontainer} flex-grow-1 `}>
              <Col className=" table-containepx-0">
                <Table hover className={styles.table}>
                  <thead className="bg-primary">
                    <tr>
                      {datasetDetails.fields.map((item, idx) => (
                        <th key={idx}>{item}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {datasetDetails.preview.map((item, idx) => (
                      <tr key={idx}>
                        {Object.values(item).map((cell, idx) => (
                          <td key={idx}>
                            {cell && cell !== "" ? (
                              cell
                            ) : (
                              <span className="not-available">N/A</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </Form>
  );
};
const InputDatasetScreen = (props) => {
  const [inputType, setInputType] = useState(DATASET_INPUT_TYPES.CSV);
  return (
    <Container
      className={`${styles.screen} ${styles.inputDatasetScreen}  pt-3 pl-4 `}
      fluid
    >
      <Row className={styles.nav}>
        <Nav variant="pills" defaultActiveKey={DATASET_INPUT_TYPES.CSV}>
          <Nav.Item>
            <Nav.Link eventKey={DATASET_INPUT_TYPES.CSV}>CSV</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={DATASET_INPUT_TYPES.DB}>Database</Nav.Link>
          </Nav.Item>
        </Nav>
      </Row>
      <Row className={styles.content}>
        <CSVUploadForm />
      </Row>
    </Container>
  );
};

export default InputDatasetScreen;
