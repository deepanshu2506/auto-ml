import { Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import QueryBuilder from "./QueryBuilder";
import styles from "./styles.module.scss";
import API, { apiURLs } from "../../../API";

const AggregationScreen = (props) => {
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

  const performAggregation = async () => {
    const payload = {
      aggregate_method: query.aggregate?.method,
      aggregate_by_field: query.aggregate?.col,
      groupby_field: query.groupBy,
      filter: query.filters,
    };
    try {
      const {
        data: { data },
      } = await API.json.post(
        apiURLs.dataset.performAggregation(params.datasetID),
        payload
      );
      setResult(data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Container className={`${styles.screen} pt-3 pl-4 `} fluid>
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
                disabled={
                  query?.filters?.length === 0 &&
                  query?.groupBy === null &&
                  query?.aggregate === null
                }
                block
                variant="primary"
                onClick={performAggregation}
              >
                View Result
              </Button>
            </Col>
          </Row>

          {result && (
            <>
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
  );
};

export default AggregationScreen;
