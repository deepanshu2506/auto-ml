import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Form,InputGroup
} from "react-bootstrap";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import {Link,useHistory } from 'react-router-dom'
import API, { apiURLs } from "../../../API";
import ArchitectureDiagram from "../../Content/ArchitectureDiagram";
import FormModal from "../../Content/FormModal/FormModal";

const JobDetailsScreen = (props) => {
  const [jobDetails, setJobDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [modelSelectedId,setModelSelectedId]=useState(null);
  const [modelSelectedIdx,setModelSelectedIdx]=useState(null);
  const history = useHistory();
  // const [exportModel,setExportModel]=useState(null);
  // const [exportModelState,setExportModelState]=useState({});

  const [exportModelLoading,setExportModelLoading]=useState(false)
  const [showDialog, setShowDialog] = useState(false);

  const params = props.rootParams.params;

  const getModelSelectionDetails = async (modelSelectionJobID) => {
    setLoading(true);
    try {
      const { data: jobDetails } = await API.json.get(
        apiURLs.modelSelectionJob.jobDetails(modelSelectionJobID)
      );
      console.log(jobDetails)
      setJobDetails(jobDetails);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const onExportButton=(state)=>{
    setShowDialog(true);
    }


  const closeDialog=()=>{
    setShowDialog(false);
}
  const performExportModel = async (state) => {
    try {
      setExportModelLoading(true);
      const payload = { state};
      const { data} = await API.json.post(
        apiURLs.modelSelectionJob.exportModel(params.jobID,modelSelectedId),
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
                  <h3 className={styles.modelName}>Dataset Name</h3>
                  <p className={styles.modelState}>{jobDetails.state}</p>
                  <p className={styles.modelType}>
                      {jobDetails.target_col}
                  </p>
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
            <Card as={Col}>
              <Card.Header>Generated models</Card.Header>
              <Card.Body className={styles.modelCard}>
                <div>

                

                {jobDetails.results.models.map((model,idx)=>
                <div className={styles.models}>
                <input
                type="radio"
                name="models"
                id={`Model ${idx}`}
                value={`Model ${idx}`}
                label={`Model ${idx}`}
                checked={modelSelectedIdx ===idx}
                onChange={()=>{setModelSelectedIdx(idx);
                  setModelSelectedId(model.model_id);
                }}/>
              <label htmlFor={`Model ${idx}`}>{`Model ${idx}`}</label>
                <ModelDetails key={idx} model={model} problemType={jobDetails.problemType} />
                </div>
                )}
            
                </div>
              </Card.Body>
            </Card>
          </Row>
          <div style={{textAlign:"center"}}>
          {exportModelLoading?
          <Row>
            <Col className="d-flex justify-content-center align-items-center">
              <Spinner animation="border" variant="primary" />
              <p className="ml-2 mb-0">Exporting selected model</p>
            </Col>
          </Row>
          :<Button  variant="primary" onClick={()=>{onExportButton()}}>
              Export Selected Model
          </Button>
          }
          <AddExportModelDialog show={showDialog} onClose={()=>{closeDialog()}} 
          onAdd={performExportModel} modelSelectedIdx={modelSelectedIdx}/>
          </div>
        </>
      )}
    </Container>
  );
};

const ModelDetails=({model,problemType})=>{
  return(
    
      <Container>
      <p>Model Id: {model.model_id}</p>

        <Row pt={2} mt={2}>
          <Col md={6}>
          <Card >
            <Card.Header>Architecture Diagram</Card.Header>
            <Card.Body className={styles.modelCard}>
              <ArchitectureDiagram architecture={model.model_arch} />
            </Card.Body>
          </Card>
          </Col>
          <Col md={6}>
          <Card style={{width:"100%",height:"100%"}}>
            <Card.Header>Model Parameters</Card.Header>
            <Card.Body className={styles.modelCard}>
              {problemType===1?
              <div>
                <h6><b>Error</b> - {model.error}</h6>
              </div>:
              <div>
                <h6><b>Accuracy</b> - {model.accuracy}</h6>
                <h6><b>Pprecision</b> - {model.precision}</h6>
                <h6><b>Recall</b> - {model.recall}</h6>
                <h6><b>Fitness Score</b> - {model.fitness_score}</h6>
                <h6><b>Accuracy dev</b> - {model.accuracy_dev}</h6>
              </div>}
              <h6><b>Trainable Parameters</b> - {model.trainable_params}</h6>
            </Card.Body>
          </Card>
          </Col>
          </Row>

      </Container>
   
  )
}


export const AddExportModelDialog = ({ show,onClose, onAdd,modelSelectedIdx}) => {
  
  const [state, setState] = useState({
    name:null,
    epochs:null,
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
        <p>Model No. selected: {modelSelectedIdx}</p>
      <Col>
        <Form.Group as={Col} md="12" controlId="name">
            <Form.Label>Model Name</Form.Label>
            <InputGroup >
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
                <Form.Control.Feedback type='invalid'>
                    "Enter Model Name"
                </Form.Control.Feedback>
            </InputGroup>
        </Form.Group>
        <Form.Group as={Col} md="12" controlId="name">
            <Form.Label>Epochs</Form.Label>
            <InputGroup >
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
                <Form.Control.Feedback type='invalid'>
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
