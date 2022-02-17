import { Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import QueryBuilder from "./QueryBuilder";
import styles from "./styles.module.scss";
import API, { apiURLs } from "../../../API";
import VisualizeChart,{AddVisualizationDialog} from "./visualize";

const AggregationScreen = (props) => {
  const [featuresLoading, setFeaturesLoading] = useState(true);
  const [dataset, setDataset] = useState({});
  const [query, setQuery] = useState(null);

  const [result, setResult] = useState(null);
  const params = props.rootParams.params;

  const clearAggregation=()=>{
    setQuery(null)
    setResult(null)
    setShowChart(false)
  }
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

  const getAggregationResult = async (exportToFile = false) => {
    const payload = {
      aggregate_method: query.aggregate?.method,
      aggregate_by_field: query.aggregate?.col,
      groupby_field: query.groupBy,
      filter: query.filters,
      export_to_file: exportToFile,
    };

    const reqConfig = exportToFile ? { responseType: "blob" } : {};

    const response = await API.json.post(
      apiURLs.dataset.performAggregation(params.datasetID),
      payload,
      reqConfig
    );
    return response;
  };

  const performAggregation = async () => {
    try {
      const {
        data: { data },
      } = await getAggregationResult();
      setResult(data);
    } catch (err) {
      console.log(err);
    }
  };

  const downloadAggregation = async () => {
    try {
      const response = await getAggregationResult(true);
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
  const [showDialog, setShowDialog] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [chartState, setChartState] = useState({
    field1:null,
    field2:null,
    chart_type:null
  });

  const visualize=()=>{
    setShowDialog(true);
  }
  const closeDialog=()=>{
    setShowDialog(false);
}
const onVisualizationAdd=(state)=>{
  console.log("options");
  console.log(state)
  setShowDialog(false);
  setChartState(state)
  setShowChart(true);
  // VisualizeChart.defineChart(state);
  }
  const isValidQuery = () =>
    query?.filters?.length === 0 &&
    query?.groupBy === null &&
    query?.aggregate === null;
  return (
    <Container className={`${styles.screen} pt-3 pl-4 `} fluid>
      <Container className={styles.nav} fluid>
        <span>Dataset Aggregation</span>
        
        {result &&
        <div className={styles.clear}>
        <Button
                block
                variant="primary"
                onClick={clearAggregation}
              >
                Clear 
        </Button>
        </div>
        
        }
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
                onClick={performAggregation}
              >
                View Result
              </Button>
            </Col>
            <Col>
              <Button
                disabled={!result}
                block
                variant="primary"
                onClick={()=>visualize()}
              >
                Visualize Result
              </Button>
            </Col>
            <Col>
              <Button
                disabled={isValidQuery()}
                block
                variant="primary"
                onClick={downloadAggregation}
              >
                download Result
              </Button>
            </Col>
          </Row>

          {result && (
            <>
            <AddVisualizationDialog
            show={showDialog}
            onClose={closeDialog}
            onAdd={onVisualizationAdd}
            columns={result.headers}
          />
            <Row style={{ padding: "0 5%" }}>
              {showChart && 
                  <VisualizeChart
                  chart chartState={chartState} data={result} showChart={showChart} />
              }
              </Row>
              <p
                className={styles.legend}
              >{`(showing ${result.meta.returned_records} of ${result.meta.total_records})`}</p>
              <Row className={`${styles.tablecontainer} flex-grow-1 `}>
                <Col className=" table-containepx-0">
                  <Table hover className={styles.table}>
                    <thead className="bg-primary">
                      <tr>
                      {result.headers.map((header) => (
                        <td key={header}>{header}</td>
                      ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.values.map((row,i) => (
                        <tr key={i}>
                          {row.map((val,j) => (
                            <td key={i*10+j}>{val}</td>
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

export default AggregationScreen;
