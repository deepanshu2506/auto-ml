import { useEffect, useState} from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import API, { apiURLs } from "../../../API";
import styles from "./styles.module.scss";
import CustomTable from "./CustomTable";
const DatasetPreview = (props) => {
  const [datasetDetails, setDatasetDetails] = useState([]);
  // const [columnNames, setColumnNames] = useState([]);
  const [columnFinal, setColumnFinal] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = props.rootParams.params;


  const fetchDataset = async () => {
    try {
      setLoading(true);
      const {data} =  await API.json.get(apiURLs.dataset.getDatasetPreview(params.datasetID),{
      params: {
        fullDatasetPreview:true
      }});
      const columnList=Object.keys(data[0]);
      const columnObjList=[];
      for(let column of columnList){
        var x= {
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
    useEffect(() => {
    console.log("useEffect called");
    fetchDataset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  return (
    <Container className={`${styles.screen}  pt-3 pl-4 `} fluid>
      <Container className={`${styles.nav} pt-3 pl-4 `} fluid>
        <span>Dataset Preview</span>
      </Container>
      <Container className={`${styles.content}`}  fluid>
          {loading ? (
            <Row>
              <Spinner animation="border" variant="primary" />
            </Row>
          ) : (
            datasetDetails && columnFinal && (
              <Row
                className={`${styles.previewDatasetTableContainer} flex-grow-1 `}
              >
             
              <CustomTable
               columns={columnFinal} 
               data={datasetDetails}/>
              </Row>
            )
          )}
          </Container>

        </Container>
 
  );
};

export default DatasetPreview;
