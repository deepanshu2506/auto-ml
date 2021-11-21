import { Col, Container, Row, Table, Button, Spinner } from "react-bootstrap";
import styles from "./styles.module.scss";
import API from "../../../API";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaInfoCircle, FaTrash } from "react-icons/fa";
const ListDatasetScreen = (props) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  var index = 0;
  const getDatasetList = async () => {
    setLoading(true);
    try {
      const pathname = await location.pathname;
      const response = await API.getRequest.get(pathname);
      setInfo(response.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("useEffect called");
    getDatasetList();
  }, []);

  return (
    <Container>
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
              <Row style={{ alignItems: "center", flexDirection: "column" }}>
                <Spinner animation="border" size="lg" />
              </Row>
            ) : (
              info &&
              info.data.map((column) => [
                <tr>
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
                    <Link to={{ pathname: `/datasets/${column.id}` }}>
                      <Button
                        style={{ padding: "0.1em 0.5rem" }}
                        variant="danger"
                      >
                        <FaTrash />
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

export default ListDatasetScreen;
