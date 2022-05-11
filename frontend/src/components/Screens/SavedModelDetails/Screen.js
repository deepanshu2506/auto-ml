import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import CanvasJSReact from "../../../assets/canvasjs.react";
import ArchitectureDiagram from "../../Content/ArchitectureDiagram";
import { useEffect, useState } from "react";
import API, { apiURLs } from "../../../API";
import { useLocation, useParams } from "react-router";
import { MODEL_TYPES } from "../../../utils/enums";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const SavedModelDetailsScreen = (props) => {
  const [model, setModel] = useState({});
  const [loading, setLoading] = useState(true);
  const [targetCol,setTargetCol]=useState({})
  const params = props.rootParams.params;

  const getModel = async (modelID) => {
    setLoading(true);
    try {
      const { data: modelDetails } = await API.json.get(
        apiURLs.savedModels.modelDetails(modelID)
      );
      setModel(modelDetails);
      getFeatures(modelDetails.dataset_id,modelDetails.target_col).then(()=>{
        setLoading(false);
      })
    } catch (err) {}
    
  };
  const getFeatures = async (datasetID,target_col) => {
    try {
        const { data } = await API.json.get(
            apiURLs.dataset.getDatasetDetails(datasetID)
        );
        const target_details=data.datasetFields.filter((col)=>col.column_name===target_col)[0]
        console.log(target_details)
        setTargetCol(target_details)
        if(target_details.metrics.mean)
        {
          if(model.type==1){
            const normalErr=model.metrics.error/target_details.metrics.mean
            setModel({...model,metrics:{
              ...model.metrics,
              "Normalised error":normalErr
            }})
          }
        }
    } catch (err) {
        console.log(err);
    }
};

  useEffect(() => {
    getModel(params.modelID);
    // getFeatures(model.dataset_id);

  }, [params.modelID]);
  const totalImportance =
    model.feature_importance &&
    Object.values(model.feature_importance).reduce(
      (acc, curr) => acc + curr,
      0
    );

  const downloadModelWeights = async () => {
    try {
      const response = await API.json.get(
        apiURLs.savedModels.export(params.modelID),
        { responseType: "arraybuffer" }
      );
      const fileNameHeader = "x-suggested-filename";
      const suggestedFileName = response.headers[fileNameHeader];
      const effectiveFileName =
        suggestedFileName === undefined ? "model.zip" : suggestedFileName;
      console.log(
        `Received header [${fileNameHeader}]: ${suggestedFileName}, effective fileName: ${effectiveFileName}`
      );
      console.log(response);
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/zip" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", effectiveFileName);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.log(err);
    }
  };

  const percentageImportance =
    model.feature_importance &&
    Object.keys(model.feature_importance)
      .map((key) => ({
        y: ((model.feature_importance[key] / totalImportance)*100),
        label: key,
      }))
      .sort((a, b) => a.y - b.y);
  const featureImportanceChartOptions = model.feature_importance && {
    colorSet: "appTheme",
    height: 25 * Object.keys(model.feature_importance).length,
    axisY: {
      gridThickness: 0,
      minimum: 0,
      labelFontSize: 10,
    },
    axisX: { interval: 1, labelFontSize: 15 },
    data: [
      {
        type: "bar",
        color: "#1769aa",
        dataPoints: percentageImportance,
      },
    ],
  };
  return (
    <Container
      className={`${styles.screen}  ${styles.savedModelScreen} pt-3 pl-4 `}
      fluid
    >
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
                    <p className={styles.modelType}>Target Column : {model.target_col}</p>
                    <p className={styles.modelState}>{targetCol.column_descriptio}</p>
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
                    <Link to={`/datasets/${model.dataset_id}`}>
                      <Button block variant="outline-primary">
                        View Dataset
                      </Button>
                    </Link>
                    <Button
                      block
                      variant="outline-primary"
                      onClick={() => downloadModelWeights()}
                    >
                      Download weights
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>

          <Row className="m-2">
            <Card as={Col}>
              <Card.Header>Metrics</Card.Header>
              <Card.Body className={styles.modelCard}>
                <Row>
                  <Col>
                    {model.state === "completed" ? (
                      <Table>
                        <thead>
                          <tr>
                            {Object.keys(model.metrics).map((key) => (
                              <th>{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {Object.values(model.metrics).map((val) => (
                              <td>{val && val.toFixed(2)}</td>
                            ))}
                          </tr>
                        </tbody>
                      </Table>
                    ) : (
                      <p>Please wait for the Model to complete training</p>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>
          <Row className="m-2">
            <Card as={Col}>
              <Card.Header>Architecture</Card.Header>
              <Card.Body className={styles.modelCard}>
                <Row>
                  <Col>
                    <ArchitectureDiagram architecture={model.architecture} />
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-end">
                <Link to={`/savedModels/${model.id}/inference`}>
                  <Button
                    disabled={model.state !== "completed"}
                    variant="outline-primary"
                  >
                    Perform Prediction
                  </Button>
                </Link>
                <Button
                  disabled={model.state !== "completed"}
                  className="ml-2"
                  variant="outline-primary"
                >
                  Export
                </Button>
              </Card.Footer>
            </Card>
          </Row>
          <Row className="m-2">
            <Card as={Col}>
              <Card.Header>Features</Card.Header>
              <Card.Body className={styles.modelCard}>
                <Row className={`${styles.tablecontainer} flex-grow-1 `}>
                  <Col className=" table-containepx-0">
                    <Table hover className={styles.table}>
                      <thead className="bg-primary">
                        <tr>
                          {Object.keys(model.features[0]).map((key) => (
                            <th>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {model.features.map((feature) => (
                          <tr>
                            {Object.values(feature).map((val) => (
                              <td>
                                {Array.isArray(val) && val.length > 0
                                  ? JSON.stringify(val)
                                  : val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>
          <Row className="m-2">
            <Card as={Col}>
              <Card.Header>Feature Importance</Card.Header>
              <Card.Body className={styles.modelCard}>
                <Row>
                  <Col>
                    {model.state === "completed" ? (
                      <CanvasJSChart options={featureImportanceChartOptions} />
                    ) : (
                      <p>Please wait for the Model to complete training</p>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>
        </>
      )}{" "}
    </Container>
  );
};

export default SavedModelDetailsScreen;
