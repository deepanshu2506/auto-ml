import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { useRef, useState } from "react";
import styles from "./styles.module.scss";
import papa from "papaparse";
import API, { apiURLs } from "../../../API";
import { useHistory } from "react-router";

const CSVUploadForm = () => {
  const history = useHistory();
  const [state, setState] = useState({});
  const [datasetDetails, setDatasetDetails] = useState({});
  const [validated, setValidated] = useState(false);
  const fileRef = useRef(null);

  const createDataset = async () => {
    try {
      const formData = new FormData();
      formData.append("dataset_name", state.dataset_name);
      formData.append("file", state.file);
      if (state.null_placeholder && state.null_placeholder.length > 0) {
        formData.append("null_placeholder", state.null_placeholder);
      }
      const { data } = await API.formData.post(
        apiURLs.dataset.create,
        formData
      );
      history.push(`/datasets/${data.datasetId}`);
      alert("dataset created");
    } catch (err) {
      console.log(err);
    }
  };

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
      createDataset();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    papa.parse(file, {
      preview: 20,
      header: true,
      complete: (results, file) => {
        console.log(results);
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
      <Container fluid className="h-100 d-flex flex-column">
        <Row>
          <Form.Group as={Col} md="6" controlId="dataset-name">
            <Form.Label>Dataset Name</Form.Label>
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
          <Form.Group as={Col} md="6" controlId="null-placeholder">
            <Form.Label>Null Placeholder</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder="Optional"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    null_placeholder: e.target.value,
                  }));
                }}
              />
            </InputGroup>
          </Form.Group>
        </Row>
        {!state.file && (
          <Row className="flex-grow-1">
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
        <Row>
          <Col>
            <Button block type="submit">
              CREATE DATASET
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default CSVUploadForm;
