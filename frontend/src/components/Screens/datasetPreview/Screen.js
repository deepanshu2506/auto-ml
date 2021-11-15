import { useEffect, useState } from "react";
import { Col, Container, Row, Spinner, Table } from "react-bootstrap";
import API, { apiURLs } from "../../../API";
import styles from "./styles.module.scss";

const DatasetPreview = (props) => {
  const [datasetDetails, setDatasetDetails] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = props.rootParams.params;
  const fetchDataset = async () => {
    try {
      setLoading(true);
      const {data} =  await API.json.get(apiURLs.dataset.getDatasetPreview(params.datasetID));
      // console.log(data);
      setColumnNames(Object.keys(data[0]));
      setDatasetDetails(data);
      setLoading(false);

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
    useEffect(() => {
    console.log("useEffect called");
    fetchDataset();
  }, []);

  return (
        <Container className={styles.screen} fluid>
          <Container className={`${styles.nav} pt-3 pl-4 pb-3`} fluid>
            <span>Dataset Preview</span>
      </Container>
          {loading ? (
            <Row>
              <Spinner animation="border" variant="primary" />
            </Row>
          ) : (
            datasetDetails && columnNames && (
            <Container className={styles.content} fluid>
              <Row
                className={`${styles.previewDatasetTableContainer} flex-grow-1 `}
              >
                  <Table striped className={styles.table}>
                    <thead className="bg-primary">
                      <tr>
                        {columnNames.map((item, idx) => (
                          <th key={idx}>{item}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {datasetDetails.map((item, idx) => (
                        <tr key={idx}>
                          {Object.values(item).map((cell, idx) => (
                            <td key={idx}>
                              {cell && cell !== "" ? (
                                cell
                              ) : (
                                <span className="not-available">N/A</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
              </Row>
            </Container>
            )
          )}
        </Container>
 
  );
};

export default DatasetPreview;
