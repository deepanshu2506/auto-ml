import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { MODEL_TYPES } from "../../../utils/enums";
import { Link } from "react-router-dom";
import API, { apiURLs } from "../../../API";

const renderInference = (modelType, inference = {}) => {
  if (MODEL_TYPES[modelType] === MODEL_TYPES[2]) {
    return (
      <Table>
        <thead>
          <tr>
            <th></th>
            {Object.keys(inference).map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Probability</td>
            {Object.values(inference).map((value) => (
              <td>{(value * 100).toFixed(2)}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    );
  } else {
    console.log(inference);
    return <p>{inference[0]}</p>;
  }
};

const ModelInferenceScreen = (props) => {
  const [model, setModel] = useState({});
  const [loading, setLoading] = useState(true);
  const [inferenceLoading, setInferenceLoading] = useState(false);
  const [inferenceState, setInferenceState] = useState({});
  const [validated, setValidated] = useState(false);
  const [inference, setInference] = useState(null);
  const [invalidCols,setInvalidCols]=useState([]);
  const params = props.rootParams.params;

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      performInference();
    }
  };

  const performInference = async () => {
    try {
      setInferenceLoading(true);
      const payload = { input: inferenceState };
      const {
        data: { inference: prediction },
      } = await API.json.post(
        apiURLs.savedModels.infer(params.modelID),
        payload
      );
      setInference(prediction[0]);
    } catch (err) {
      console.log(err);
    }
    setInferenceLoading(false);
  };
  const isInvalidContinous=(v,minV,maxV,featureName)=>{
    if(v) {
      if(v<minV || v>maxV){
        if(invalidCols.indexOf(featureName)<=-1)
        {setInvalidCols(prev=>[...prev,featureName]);}
    } 
    else{
      setInvalidCols(invalidCols.filter(item=>item!==featureName))
    } 
  }
}

  const getModel = async (modelID) => {
    setLoading(true);
    try {
      const { data: modelDetails } = await API.json.get(
        apiURLs.savedModels.modelDetails(modelID)
      );
      console.log(modelDetails)
      setModel(modelDetails);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  useEffect(() => {
    getModel(params.modelID);
  }, [params.modelID]);
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
                    <p className={styles.target}>
                     Target Column: <span>{model.target_col} </span>
                    </p>
                    <p className={styles.modelCreationDate}>
                      {model.created_at}
                    </p>
                  </Col>
                  <Col className={styles.buttonContainer}>
                    <Link to={`/jobDetails/${model.model_selection_job_id}`}>
                      <Button block variant="outline-primary">
                        View Model Selection Job
                      </Button>
                    </Link>
                    <Link to={`/savedModels/${model.id}`}>
                      <Button block variant="outline-primary">
                        View Model Details
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
          <Card className="m-2">
            <Card.Body>
              {invalidCols.length>0 &&
              <div className={styles.warning}>
             Warning: Out of range values 
              <span>
                  {invalidCols.map((val)=>(
                    <span>{" "}{val}{" , "}</span>
                  ))}
                </span>
              </div>
                }
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  {model.features.map((feature) => (
                    <>
                    {feature.type === "discrete" ? (
                      <Form.Group as={Col} md="4" controlId={feature.name}>
                      <Form.Label>{feature.name}</Form.Label>
                      <InputGroup hasValidation>
                          <Form.Control
                            as="select"
                            value={inferenceState[feature.name]}
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
                          </InputGroup>
                      <Form.Control.Feedback type="invalid">
                        This field is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                        ) : (
                          <Form.Group as={Col} md="4" controlId={feature.name}>
                      <Form.Label style={{width: "100%"}}>{feature.name}<span style={{float: "right",fontSize: "13px"}}>({feature.minValue} - {feature.maxValue})</span></Form.Label>
                      <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder={`Enter ${feature.name}`}
                            value={inferenceState[feature.name]}
                            // isInvalid={(e)=>isInvalidContinous(e.target.value,feature.minValue,feature.maxValue)}
                            onChange={(e) => {
                              setInferenceState((prev) => ({
                                ...prev,
                                [feature.name]: e.target.value,
                              }));
                              isInvalidContinous(e.target.value,feature.minValue,feature.maxValue,feature.name);
                            }}
                            required
                          />
                          </InputGroup>
                      <Form.Control.Feedback type="invalid">
                        This field is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                        )
                        }
                        </>
                      
                  ))}
                  <Col md="12">
                    <Button
                      onClick={() => {
                        console.log("clicked");
                      }}
                      block
                      type="submit"
                    >
                      PREDICT
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
          <Card className="m-2">
            <Card.Header>Prediction</Card.Header>
            <Card.Body>
              {inferenceLoading ? (
                <Row>
                  <Col className="d-flex justify-content-center align-items-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="ml-2 mb-0">Crunching the numbers</p>
                  </Col>
                </Row>
              ) : inference ? (
                renderInference(model.type, inference)
              ) : (
                <Row>
                  <Col className="d-flex justify-content-center align-items-center">
                    <p className="m-0">Your inference will appear here</p>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default ModelInferenceScreen;
