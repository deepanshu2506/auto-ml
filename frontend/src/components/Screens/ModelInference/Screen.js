import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { useState } from "react";
import styles from "./styles.module.scss";
import { dummyModel } from "./dummy";
import { MODEL_TYPES } from "../../../utils/enums";
import { Link } from "react-router-dom";

const ModelInferenceScreen = (props) => {
  const [model, setModel] = useState(dummyModel);
  const [loading, setLoading] = useState(false);
  const [inferenceState, setInferenceState] = useState({});
  return (
    <Container className={`${styles.screen}   pt-3 pl-4 `} fluid>
      {loading ? (
        <Row>
          <Spinner animation="border" size="lg" />
        </Row>
      ) : (
        <>
          <Row className="m-2">
            <Card as={Col}>
              <Card.Body className={styles.modelCard}>
                <Row>
                  <Col md={9}>
                    <h3 className={styles.modelName}>{model.name}</h3>
                    <p className={styles.modelState}>{model.state}</p>
                    <p className={styles.modelType}>
                      {MODEL_TYPES[model.type]} Model
                    </p>
                    <p className={styles.modelCreationDate}>
                      {model.created_at}
                    </p>
                  </Col>
                  <Col className={styles.buttonContainer}>
                    <Link
                      to={`/model_selection/${model.model_selection_job_id}`}
                    >
                      <Button block variant="outline-primary">
                        View Model Selection Job
                      </Button>
                    </Link>
                    <Link to={`/datasets/${model.dataset_id}`}>
                      <Button block variant="outline-primary">
                        View Dataset
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>
          <Card>
            <Card.Body>
              <Form as={Row}>
                {model.features.map((feature) => (
                  <Form.Group as={Col} md="4" controlId={feature.name}>
                    <Form.Label>{feature.name}</Form.Label>
                    <InputGroup hasValidation>
                      {feature.type === "discrete" ? (
                        <Form.Control
                          as="select"
                          placeholder={`Enter ${feature.name}`}
                          onChange={(e) => {
                            setInferenceState((prev) => ({
                              ...prev,
                              [feature.name]: e.target.value,
                            }));
                          }}
                          required
                        >
                          <option>{`Select ${feature.name}`}</option>
                          {feature.allowed_Values.map((value) => (
                            <option value={value}>{value}</option>
                          ))}
                        </Form.Control>
                      ) : (
                        <Form.Control
                          type="text"
                          placeholder={`Enter ${feature.name}`}
                          onChange={(e) => {
                            setInferenceState((prev) => ({
                              ...prev,
                              [feature.name]: e.target.value,
                            }));
                          }}
                          required
                        />
                      )}
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      This field is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                ))}
              </Form>
              <Row>
                <Col>
                  <Button type="submit" block>
                    PREDICT
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default ModelInferenceScreen;
