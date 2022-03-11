import { Col, Container, Row, Table, Button, Spinner, Card } from "react-bootstrap";
import styles from "./styles.module.scss";
import API, { apiURLs } from "../../../API";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaInfoCircle, FaTrash } from "react-icons/fa";
const ModelSelectionJobsScreen = (props) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const location = useLocation();
  var index = 0;
  var temp;
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }  

  const getJobsList = async () => {
    setLoading(true);
    try {
        await sleep(100);
        const pathname=await location.pathname;
        console.log("pathname123",pathname);
        // setDatasetId(pathname.substring(10));
        const response = await API.getRequest.get(
          pathname
        );
        // const {response} = await API.json.get(
        //     apiURLs.modelSelectionJob.getJobs,
        //     // payload,
        // );
        console.log(response);
        console.log("yo");
        temp = response.data;
        console.log(response.data);
        console.log(typeof(temp));
        // temp.sort((a, b)=>a-b);
        temp.sort();
        console.log(temp);
        // console.log("yo123");
        // console.log(response.data[5].jobEndtime);
        setInfo(temp);
        
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getJobsList();
  }, []);

  return (
    <Container className={`${styles.screen} ${styles.savedModelsScreen}  pt-3 pl-4 `}
    fluid>
    <Container className={`${styles.nav} pt-3 pl-4 pb-3`} fluid>
      <Row>
        <Col>
          <span>Model Selection Jobs</span>
        </Col>
        <Col>
        <span className={styles.search}>
          <input placeholder="Search by the Dataset Name" onChange={event => setQuery(event.target.value)}/>
        </span>
        </Col>
      </Row>
    </Container>
      <Container
        className={`${styles.screen} ${styles.savedModelsScreen} py-2 `}
        fluid
      >
            {loading ? (
              <Row>
              <Spinner animation="border" variant="primary" />
            </Row>
            ) : (
              info.filter(column => {
                if (query === '') {
                  return column;
                }
                else if (column.dataset_name.toLowerCase().includes(query.toLowerCase())) {
                  return column;
                }
              }).map((column) =>(
                <Row className="m-2">
                <Card as={Col}>
                  <Card.Body className={styles.modelCard}>
                    <Row>
                      <Col md={9}>
                        <h3 className={styles.modelName}>{column.dataset_name}</h3>
                        <p className={styles.modelState}>Status: {column.state}</p>
                        <p className={styles.modelState}>Target Column: {column.target_col}</p>
                        {/* <p className={styles.modelType}>
                          {MODEL_TYPES[column.type]} Model
                        </p> */}
                        <p className={styles.modelCreationDate}>
                          Job started at: {column.startedAt.slice(0, -14).trim()}
                        </p>
                        <p className={styles.modelCreationDate}>
                          Job ended at: {column.jobEndtime!=undefined?column.jobEndtime.slice(0, -14).trim():"Job not completed yet"}
                        </p>
                      </Col>
                      <Col className={styles.buttonContainer}>
                        <Link to={`/jobDetails/${column.job_id}`}>
                          <Button 
                            disabled={column.state !== "completed"}
                            block>Details</Button>
                        </Link>
                        {/* <Link to={`/savedModels/${column.id}/inference`}>
                          <Button
                            disabled={column.state !== "completed"}
                            block
                            variant="outline-primary"
                          >
                            Details
                          </Button>
                        </Link> */}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Row>
              ))
            )}
      </Container>
    </Container>
  );
};

export default ModelSelectionJobsScreen;
