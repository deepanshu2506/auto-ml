import { Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import QueryBuilder from "./QueryBuilder";
import styles from "./styles.module.scss";
import API, { apiURLs } from "../../../API";
import VisualizeChart from "./visualize";
const AdvanceVisualizationScreen = (props) => {
  const [featuresLoading, setFeaturesLoading] = useState(true);
  const [dataset, setDataset] = useState({});
  const [query, setQuery] = useState(null);

  const [result, setResult] = useState(null);
  const params = props.rootParams.params;

  const getFeatures = async () => {
    setFeaturesLoading(true);

    try {
      const { data } = await API.json.get(
        apiURLs.dataset.getDatasetDetails(params.datasetID)
      );
      const { data: discreteColsData } = await API.json.get(
        apiURLs.dataset.getFeatures(params.datasetID)
      );
      setDataset({ ...data, discreteCols: discreteColsData.data });
      setFeaturesLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getFeatures();
  }, []);
  const onQueryChange = (query) => setQuery(query);
  console.log(query);

  const getVisualizationResult = async (exportToFile = false) => {
    const payload = {
      aggregate_method: query.aggregate?.method,
      aggregate_by_field: query.aggregate?.col,
      groupby_field: query.groupBy,
      filter: query.filters,
      export_to_file: exportToFile,
      chart_type:query.chart_type,
      field1:query.field1,
      field2:query.field2
    };

    const reqConfig = exportToFile ? { responseType: "blob" } : {};

    const response = await API.json.post(
      apiURLs.visualize.performAdvanceVisualization(params.datasetID),
      payload,
      reqConfig
    );
    return response;
  };

  const performVisualization = async () => {
    try {
      const {
        data: { data },
      } = await getVisualizationResult();
      setResult(data);
    } catch (err) {
      console.log(err);
    }
  };

  const downloadVisualization = async () => {
    try {
      const response = await getVisualizationResult(true);
      const fileNameHeader = "x-suggested-filename";
      const suggestedFileName = response.headers[fileNameHeader];
      const effectiveFileName =
        suggestedFileName === undefined ? "result.csv" : suggestedFileName;
      console.log(
        `Received header [${fileNameHeader}]: ${suggestedFileName}, effective fileName: ${effectiveFileName}`
      );

      // Let the user save the file.
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", effectiveFileName); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.log(err);
    }
  };
  const isValidQuery = () =>
    query?.filters?.length === 0 &&
    query?.groupBy === null &&
    query?.aggregate === null;
  return (
    <Container className={`${styles.screen} pt-3 pl-4 `} fluid>
      <Container className={styles.nav} fluid>
        <span>Dataset Advance Visualization</span>
      </Container>
      <Container className={styles.content} fluid>
      {featuresLoading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <>
          <QueryBuilder
            features={dataset.datasetFields}
            discreteCols={dataset.discreteCols}
            onChange={onQueryChange}
          />
          <Row className="my-2">
            <Col>
              <Button
                disabled={isValidQuery()}
                block
                variant="primary"
                onClick={performVisualization}
              >
                View Result
              </Button>
            </Col>
            <Col>
              <Button
                disabled={isValidQuery()}
                block
                variant="primary"
                onClick={downloadVisualization}
              >
                download Result
              </Button>
            </Col>
          </Row>

          {result && (
            <>
             <Row style={{ padding: "0 5%" }}>
                <VisualizeChart
                chart data={result} />
              </Row>
              <p
                className={styles.legend}
              >{`(showing ${result.meta.returned_records} of ${result.meta.total_records})`}</p>
              <Row className={`${styles.tablecontainer} flex-grow-1 `}>
                <Col className=" table-containepx-0">
                  <Table hover className={styles.table}>
                    <thead className="bg-primary">
                      {result.headers.map((header) => (
                        <th>{header}</th>
                      ))}
                    </thead>
                    <tbody>
                      {result.values.map((row) => (
                        <tr>
                          {row.map((val) => (
                            <td>{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </>
          )}
        </>
      )}
      
    </Container>
    </Container>

  );
};

export default AdvanceVisualizationScreen;
