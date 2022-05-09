import { useEffect, useState} from "react";
import { Container, Row, Spinner,Col } from "react-bootstrap";
import API, { apiURLs } from "../../../API";
import styles from "./styles.module.scss";
import CustomTable from "./CustomTable";
const DatasetPreview = (props) => {
  const [datasetDetails, setDatasetDetails] = useState([]);
  // const [columnNames, setColumnNames] = useState([]);
  const [columnFinal, setColumnFinal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataset, setDataset] = useState({});
  const params = props.rootParams.params;


  const fetchDataset = async () => {
    try {
      setLoading(true);
      const { data } = await API.json.get(apiURLs.dataset.getDatasetPreview(params.datasetID), {
        params: {
          fullDatasetPreview: true
        }
      });
      console.log(data);
      const columnList = Object.keys(data[0]);
      const columnObjList = []; 
      for (let column of columnList) {
        var x = {
          Header: column,
          Footer: column,
          accessor: column
        };
        columnObjList.push(x);
      }
      setColumnFinal(columnObjList);
      setDatasetDetails(data);
      setLoading(false);

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getFeatures = async () => {
    try {
        const { data } = await API.json.get(
            apiURLs.dataset.getDatasetDetails(params.datasetID)
        );
        setDataset(data);
      
    } catch (err) {
        console.log(err);
    }
};

  useEffect(() => {
    getFeatures();
    fetchDataset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className={`${styles.screen}  pt-3 pl-4 `} fluid>
      <Container className={`${styles.nav} pt-3 pl-4 `} fluid>
        <span>Dataset Preview</span>
      </Container>
      <Container className={`${styles.content}`} fluid>
        {loading ? (
          <Row>
            <Spinner animation="border" variant="primary" />
          </Row>
        ) : (
          datasetDetails && columnFinal && (
        <Col>
          <Row className=" mt-2 mb-0">
            <h4 className={styles.datasetname}>
              {dataset.dataset_name}
            </h4>
          </Row>

          <Row 
            className={`${styles.previewDatasetTableContainer} flex-grow-1 mt-4 mb-0`}
          >

            <CustomTable
              columns={columnFinal}
              data={datasetDetails} />
          </Row>
        </Col>

        )
        )}
      </Container>

    </Container>
 
  );
};

export default DatasetPreview;
