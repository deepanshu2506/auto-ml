import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Link, useHistory } from "react-router-dom";
import API, { apiURLs } from "../../../API";
import ArchitectureDiagram from "../../Content/ArchitectureDiagram";
import FormModal from "../../Content/FormModal/FormModal";
import ModelParaInfoGuideScreen from "./hints";

const JobDetailsScreen = (props) => {
  const [jobDetails, setJobDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [modelSelectedId, setModelSelectedId] = useState(null);
  const history = useHistory();
  // const [exportModel,setExportModel]=useState(null);
  // const [exportModelState,setExportModelState]=useState({});

  const [exportModelLoading, setExportModelLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const params = props.rootParams.params;

  const getModelSelectionDetails = async (modelSelectionJobID) => {
    setLoading(true);
    try {
      const { data: jobDetails } = await API.json.get(
        apiURLs.modelSelectionJob.jobDetails(modelSelectionJobID)
      );
      console.log(jobDetails);
      setJobDetails(jobDetails);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const onExportButton = (state) => {
    if (modelSelectedId === null) {
      alert("Select a model to export");
      return;
    }
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };
  const performExportModel = async (state) => {
    try {
      setExportModelLoading(true);
      const payload = { epochs: state.epochs, model_name: state.name };
      const { data } = await API.json.post(
        apiURLs.modelSelectionJob.exportModel(params.jobID, modelSelectedId),
        payload
      );
      console.log(data);
      history.push(`/savedModels/${data.id}`);
      // setExportModel(prediction[0]);
    } catch (err) {
      console.log(err);
    }
    setExportModelLoading(false);
  };

  useEffect(() => {
    getModelSelectionDetails(params.jobID);
  }, []);
  console.log(modelSelectedId);
  return (
    <Container className={`${styles.screen}   pt-3 pl-4 `} fluid>
       <Container className={styles.nav} fluid>
        <span>Model job details screen</span>
        <div className={styles.hintbtns}>
          <ModelParaInfoGuideScreen />
        </div>
      </Container>
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
                    <h3 className={styles.modelName}>
                      {jobDetails.dataset_name}
                    </h3>
                    <p className={styles.modelState}>{jobDetails.state}</p>
                    <p className={styles.modelType}>{jobDetails.target_col}</p>
                    <Row>
                      <Col md={6}>
                        <p className={styles.modelCreationDate}>
                          {jobDetails.started_at}
                        </p>
                      </Col>
                      <Col md={6}>
                        <p className={styles.modelCreationDate}>
                          {jobDetails.jobEndTime}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col className={styles.buttonContainer}>
                    <Link to={`/datasets/${jobDetails.dataset_id}`}>
                      <Button block variant="outline-primary">
                        View Dataset
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>

          <Row className="m-2">
            <Col className="px-0">
              <Card.Header>Generated models</Card.Header>
              <Card>
                <Card.Body className={styles.modelCard}>
                  {jobDetails.results.models.map((model, idx) => (
                    <ModelDetails
                      idx={idx}
                      isSelected={modelSelectedId === model.model_id}
                      key={model.model_id}
                      model={model}
                      problemType={jobDetails.problemType}
                      onChange={setModelSelectedId}
                    />
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div style={{ textAlign: "center" }}>
            {exportModelLoading ? (
              <Row>
                <Col className="d-flex justify-content-center align-items-center">
                  <Spinner animation="border" variant="primary" />
                  <p className="ml-2 mb-0">Exporting selected model</p>
                </Col>
              </Row>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  onExportButton();
                }}
              >
                Export Selected Model
              </Button>
            )}
            <AddExportModelDialog
              show={showDialog}
              onClose={() => {
                closeDialog();
              }}
              onAdd={performExportModel}
            />
          </div>
        </>
      )}
    </Container>
  );
};

const ModelDetails = ({
  model,
  problemType,
  isSelected,
  onChange,
  ...props
}) => {
  const selectModel = () => {
    onChange(model.model_id);
  };
  return (
    <Card
      className={`${styles.genModelCard} ${
        isSelected && styles.genModelCardSelected
      }`}
      onClick={selectModel}
    >
      <Card.Header className={isSelected && styles.genModelCardSelectedHeader}>
        Model {props.idx + 1}
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Card>
              <Card.Header>Architecture Diagram</Card.Header>
              <Card.Body className={styles.modelCard}>
                <ArchitectureDiagram architecture={model.model_arch} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card style={{ width: "100%", height: "100%" }}>
              <Card.Header>Model Parameters</Card.Header>
              <Card.Body className={styles.modelCard}>
                {problemType === 1 ? (
                  <div>
                    <h6>
                      <b>Error</b> - {Number(model.error).toFixed(2)}
                    </h6>
                  </div>
                ) : (
                  <div>
                    <h6>
                      <b>Accuracy</b> - {Number(model.accuracy).toFixed(2)}
                    </h6>
                    <h6>
                      <b>Precision</b> - {Number(model.precision).toFixed(2)}
                    </h6>
                    <h6>
                      <b>Recall</b> - {Number(model.recall).toFixed(2)}
                    </h6>
                    <h6>
                      <b>Fitness Score</b> -{" "}
                      {Number(model.fitness_score).toFixed(2)}
                    </h6>
                  </div>
                )}
                <h6>
                  <b>Trainable Parameters</b> - {model.trainable_params}
                </h6>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export const AddExportModelDialog = ({ show, onClose, onAdd }) => {
  const [state, setState] = useState({
    name: null,
    epochs: null,
  });
  const onSubmit = () => onAdd(state);

  return (
    <FormModal
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
      ModalTitle="Export Model"
      animation={true}
      closeOnSubmit={true}
    >
      <Row className={styles.rowStyle}>
        <Col>
          <Form.Group as={Col} md="12" controlId="name">
            <Form.Label>Model Name</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Model Name"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
              />
              <Form.Control.Feedback type="invalid">
                "Enter Model Name"
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Col} md="12" controlId="name">
            <Form.Label>Epochs</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="10"
                aria-describedby="inputGroupPrepend"
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    epochs: e.target.value,
                  }));
                }}
              />
              <Form.Control.Feedback type="invalid">
                "Enter No. of epochs"
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
    </FormModal>
  );
};

export default JobDetailsScreen;
