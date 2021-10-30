import { useState, useRef } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import styles from "./styles.module.scss";
const DatabaseConnectionForm = (props) => {
  const [state, setState] = useState({});
  const databaseConnectionFormRef = useRef(null);
  const datasetFormRef = useRef(null);
  const [dbFormValidate, setDbFormValidate] = useState(false);
  const [dsFormValidate, setDsFormValidate] = useState(false);
  const [dbConnCheckLoading, setDbConnCheckLoading] = useState(false);
  const validateForm = (form, validator) => {
    if (form.current.checkValidity() === false) {
      validator(true);
      return false;
    } else {
      return true;
    }
  };

  const checkDbConnection = () => {
    const isValid = validateForm(databaseConnectionFormRef, setDbFormValidate);
    if (isValid) {
      try {
        setDbConnCheckLoading(true);
      } catch (err) {}
      setDbConnCheckLoading(false);
    }
  };
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
        </Row>
        <Row>
          <Col>
            <Button onClick={checkDbConnection}>Check Connection</Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default DatabaseConnectionForm;
