import { Col, Container, Row, Table, Button, Spinner } from "react-bootstrap";
import styles from "./styles.module.scss";
import API, { apiURLs } from "../../../API";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaInfoCircle, FaTrash } from "react-icons/fa";
const ListDatasetScreen = (props) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  var index = 0;

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }  

  const getDatasetList = async () => {
    setLoading(true);
    try {
      await sleep(100);//wait till token is saved in local storage
      const pathname = await location.pathname;
      const response = await API.getRequest.get(pathname);
      setInfo(response.data.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDatasetList();
  }, []);

  const deleteDataset = async (datasetID) => {
    try {
      const response = await API.json.delete(apiURLs.dataset.deleteDataset(datasetID));
      if (response.status === 204) {
        var newinfo = info.filter((item) => item.id !== datasetID);
        setInfo(newinfo)
        alert("Selected dataset deleted successfully!")
      }

    }
    catch (err) {
      alert("SORRY!Try again!")
      console.log(err)
    }
  }

  return (
    <Container className={`${styles.screen} ${styles.inputDatasetScreen}  pt-3 pl-4 `}
    fluid>
      <Container className={`${styles.nav} pt-3 pl-4 pb-3`} fluid>
        <Row>
          <Col>
            <span>My Datasets</span>
          </Col>
          <Col>
            <Link to={{ pathname: `/dataset/create` }}>
              <Button
                style={{ padding: "0.1rem 0.5rem" }}
                className="float-right"
                variant="outline-success"
              >
                {" "}
                Create a dataset <i className="fa fa-plus" aria-hidden="true"></i>
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
      <Container className={styles.content} fluid>
        <Table striped bordered hover size="md">
          <thead>
            <tr>
              <th>No.</th>
              <th>Dataset Name</th>
              <th>Created At</th>
              <th>Import Type</th>
              <th>Dataset Details</th>
              <th>Delete Dataset</th>
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
                  <td style={{ width: "25%" }}>{column.dataset_name}</td>
                  <td style={{ width: "25%" }}>
                    {column.created_at.slice(0, -14).trim()}
                  </td>
                  <td style={{ width: "10%" }}>{column.type}</td>
                  <td style={{ width: "15%", textAlign: "center" }}>
                    <Link to={{ pathname: `/datasets/${column.id}` }}>
                      <Button
                        style={{ padding: "0.1em 0.5rem" }}
                        variant="primary"
                      >
                        <FaInfoCircle />
                      </Button>
                    </Link>
                  </td>
                  <td style={{ width: "15%", textAlign: "center" }}>
                    <Button onClick={() => deleteDataset(column.id)}
                      style={{ padding: "0.1em 0.5rem" }}
                      variant="danger"
                    >
                      <FaTrash />
                    </Button>
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

export default ListDatasetScreen;
