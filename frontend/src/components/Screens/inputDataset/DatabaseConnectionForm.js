import { useState, useRef } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { BsCheck } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { useHistory } from "react-router";
import API, { apiURLs } from "../../../API";
import PreviewDialogBox from "./previewDialogBox";
import styles from "./styles.module.scss";

const DatabaseConnectionForm = (props) => {
  const history = useHistory();
  const [state, setState] = useState({});
  const databaseConnectionFormRef = useRef(null);
  const datasetFormRef = useRef(null);
  const [dbFormValidate, setDbFormValidate] = useState(false);
  const [dsFormValidate, setDsFormValidate] = useState(false);
  const [dbConnCheckLoading, setDbConnCheckLoading] = useState(false);
  const [connectionState, setConnectionState] = useState(0);
  const [connDesc, setConnDesc] = useState("");
  const [previewDialogState, setPreviewDialogState] = useState(false);
  const validateForm = (form, validator) => {
    if (form.current.checkValidity() === false) {
      validator(true);
      return false;
    } else {
      return true;
    }
  };
  const buildConnectionPayload = () => {
    const payload = {
      host: state.host,
      password: state.password || "",
      port: state.port,
      user: state.user,
      type: state.type,
      database: state.database,
    };
    return payload;
  };

  const buildDatasetPayload = () => {
    const payload = {
      ...buildConnectionPayload(),
      query: state.query,
      dataset_name: state.dataset_name,
      null_placeholder: state.null_placeholder,
    };
    return payload;
  };

  const getDbConnectionState = async () => {
    try {
      const payload = buildConnectionPayload();
      const { data: connectionState } = await API.json.post(
        apiURLs.misc.checkDbConn,
        payload
      );
      setConnectionState(connectionState.connected ? 1 : 2);
      setConnDesc(connectionState.error || "Connected!");
    } catch (err) {
      console.log(err);
    }
  };

  const checkDbConnection = () => {
    const isValid = validateForm(databaseConnectionFormRef, setDbFormValidate);
    if (isValid) {
      try {
        setDbConnCheckLoading(true);
        getDbConnectionState();
      } catch (err) {}
      setDbConnCheckLoading(false);
    }
  };
  const createDataset = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isValid =
      validateForm(datasetFormRef, setDsFormValidate) && connectionState === 1;
    if (isValid) {
      const payload = buildDatasetPayload();
      const { data } = await API.json.post(apiURLs.dataset.create, payload);
      history.push(`/datasets/${data.datasetId}`);
    } else {
    }
  };

  const openPreviewDialog = () => setPreviewDialogState(true);
  const closePreviewDialog = () => setPreviewDialogState(false);
  return (
    <Container
      fluid
      className={`${styles.scrollableContainer} h-100 d-flex flex-column`}
    >
      <Form
        noValidate
        validated={dbFormValidate}
        ref={databaseConnectionFormRef}
      >
        <Row>
          <Form.Group as={Col} md="4" controlId="dataset-name">
            <Form.Label>Database Engine</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }));
                }}
                as="select"
                required
              >
                <option>Select database</option>
                <option value="mysql">MySQL</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Please select database engine
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="dataset-name">
            <Form.Label>Host Address</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder="Host"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    host: e.target.value,
                  }));
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter host
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="dataset-name">
            <Form.Label>Port</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="number"
                placeholder="Port"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    port: e.target.value,
                  }));
                }}
                min={1}
                max={65536}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid port
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} md="4" controlId="dataset-name">
            <Form.Label>Username</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder="Database User name"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    user: e.target.value,
                  }));
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter database username
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="dataset-name">
            <Form.Label>Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="password"
                placeholder="Database Password"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
              />
              <Form.Control.Feedback type="invalid">
                Password is required.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="dataset-name">
            <Form.Label>Database</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="password"
                placeholder="Enter Database name"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    database: e.target.value,
                  }));
                }}
              />
              <Form.Control.Feedback type="invalid">
                Database name is required.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row>
          <Col md="4" className={styles.checkConnectionDiv}>
            <Button block onClick={checkDbConnection}>
              Check Connection
            </Button>
          </Col>
          {!dbConnCheckLoading ? (
            connectionState !== 0 && (
              <>
                <Col md="1" className={styles.connState}>
                  {connectionState === 1 && <BsCheck color="green" size="30" />}
                  {connectionState === 2 && <MdClose color="red" size="30" />}
                </Col>
                <Col md="7" className={styles.connectionError}>
                  <p>{connDesc}</p>
                </Col>
              </>
            )
          ) : (
            <Spinner animation="border" variant="primary" />
          )}
        </Row>
      </Form>
      <Form
        noValidate
        validated={dsFormValidate}
        ref={datasetFormRef}
        onSubmit={createDataset}
      >
        <Row className="mt-4">
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
        <Row>
          <Form.Group as={Col} md="12" controlId="dataset-name">
            <Form.Label>Query</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                as="textarea"
                rows="5"
                placeholder="Enter the query that will select the dataset from the database"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    query: e.target.value,
                  }));
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter query
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row>
          <Col>
            <Button
              variant="outline-primary"
              block
              disabled={connectionState !== 1}
              onClick={openPreviewDialog}
            >
              Preview Dataset
            </Button>
          </Col>
          <Col>
            <Button type="submit" block disabled={connectionState !== 1}>
              Create Dataset
            </Button>
          </Col>
        </Row>
      </Form>
      <PreviewDialogBox
        onClose={closePreviewDialog}
        open={previewDialogState}
        datasetProps={buildDatasetPayload()}
      />
    </Container>
  );
};

export default DatabaseConnectionForm;
