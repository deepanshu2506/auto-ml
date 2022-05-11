import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import API, { apiURLs } from "../../../API";
import { Link } from "react-router-dom";

const MODEL_TYPES = { 1: "Regression", 2: "Classification" };
const SavedModelScreen = (props) => {
  const [savedModels, setSavedModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  function sortFunction(a,b){ 
    var dateA = new Date(a.created_at.slice(0, -5).trim()).getTime();
    var dateB = new Date(b.created_at.slice(0, -5).trim()).getTime();
    return dateA < dateB ? 1 : -1;  
  }; 

  const fetchSavedModels = async () => {
    try {
      setLoading(true);
      const { data: models } = await API.json.get(
        apiURLs.savedModels.getModels
      );
      models.sort(sortFunction);
      setSavedModels(models);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSavedModels();
  }, []);
  return (
    <Container
      className={`${styles.screen} ${styles.savedModelsScreen} py-2 `}
      fluid>
      <Container className={`${styles.nav} pt-3 pl-4 pb-3`} fluid>
        <Row>
          <Col>
            <span>Saved Models</span>
          </Col>
          <Col>
          <span className={styles.search}>
            <input placeholder=" Search by the Dataset Name " onChange={event => setQuery(event.target.value)}/>
          </span>
          </Col>
        </Row>
      </Container>
      {loading ? (
        <Row>
          <Spinner animation="border" variant="primary" />
        </Row>
      ) : (
        savedModels && savedModels.filter(model => {
          if (query === '') {
            return model;
          }
          else if (model.dataset_name.toLowerCase().includes(query.toLowerCase())) {
            return model;
          }
        }).map((model) => (
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
                    <Link to={`/savedModels/${model.id}`}>
                      <Button block>Details</Button>
                    </Link>
                    <Link to={`/savedModels/${model.id}/inference`}>
                      <Button
                        disabled={model.state !== "completed"}
                        block
                        variant="outline-primary"
                      >
                        Inference
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>
        ))
      )}
    </Container>
  );
};

export default SavedModelScreen;
