import { Col, Container, Row, Table, Button, Spinner } from "react-bootstrap";
import styles from "./styles.module.scss";
import API, { apiURLs } from "../../../API";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaInfoCircle, FaTrash } from "react-icons/fa";
const ModelSelectionJobsScreen = (props) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  var index = 0;

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
        console.log(response.data);
        console.log(typeof(response.data));
        // console.log("yo123");
        // console.log(response.data[1]);
        setInfo(response.data);
        
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getJobsList();
  }, []);

  return (
    <Container className={`${styles.screen} ${styles.inputDatasetScreen}  pt-3 pl-4 `}
    fluid>
      <Container className={`${styles.nav} pt-3 pl-4 pb-3`} fluid>
        <Row>
          <Col>
            <span>Model Selection Jobs</span>
          </Col>
        </Row>
      </Container>
      <Container className={styles.content} fluid>
        <Table striped bordered hover size="md">
          <thead>
            <tr>
              <th>No.</th>
              <th>Dataset Name</th>
              <th>Target Column</th>
              <th>Started At</th>
              <th>Status</th>
              <th>Job Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">
                  <Row style={{ alignItems: "center", flexDirection: "column" }}>
                    <Spinner animation="border" size="lg" />
                  </Row>
                </td>
              </tr>
            ) : (
              info &&
              info.map((column) => [
                <tr key={column.id}>
                  <td style={{ width: "10%" }}>{(index = index + 1)}</td>
                  <td style={{ width: "25%" }}>{column.dataset}</td>
                  <td style={{ width: "10%" }}>{column.target_col}</td>
                  <td style={{ width: "25%" }}>
                    {column.started_at.slice(0, -14).trim()}
                  </td>
                  <td>{column.status == 'completed'? "Completed": 
                        column.status == 'running'? "Running":
                        column.status == 'submitted'? "Submitted": 
                        column.status == 'aborted'? "Aborted": "Error"}</td>
                  <td style={{ width: "15%", textAlign: "center" }}>
                    <Link to={{ pathname: `` }}>
                      <Button
                        style={{ padding: "0.1em 0.5rem" }}
                        variant="primary"
                      >
                        <FaInfoCircle />
                      </Button>
                    </Link>
                  </td>
                </tr>,
              ])
            )}
          </tbody>
        </Table>
      </Container>
    </Container>
  );
};

export default ModelSelectionJobsScreen;
