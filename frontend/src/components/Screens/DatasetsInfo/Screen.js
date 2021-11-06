import {
  Col,
  Container,
  Row,
  Table,
  Spinner,
  Button
} from "react-bootstrap";
import styles from "./styles.module.scss";
import API from "../../../API";
import {useState,useEffect } from "react";
import {useLocation} from "react-router-dom";
import CanvasJSReact from '../../../assets/canvasjs.react';

const DatasetInfoScreen = (props) => {
  const [info, setInfo] = useState(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [chartData,setChartData]=useState({});
  const [expandedRows, setExpandedRows] = useState([]);
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;
  function rowStyleFormat(row, rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? 'red' : 'blue' };
  }
  const handleExpandRow = (event, columnId) => {
    const currentExpandedRows = expandedRows;
    const isRowExpanded = currentExpandedRows.includes(columnId);
    let obj = {};
    isRowExpanded ? (obj[columnId] = false) :  (obj[columnId] = true);
    // If the row is expanded, we are here to hide it. Hence remove
    // it from the state variable. Otherwise add to it.
    const newExpandedRows = isRowExpanded ?
          currentExpandedRows.filter(id => id !== columnId) :
          currentExpandedRows.concat(columnId);

    setExpandedRows(newExpandedRows);
  }
 const getDatasetInfo=async()=>{
  setLoading(true);
    try { 
      const pathname=await location.pathname;
      const response = await API.getRequest.get(
        pathname
      );
      setInfo(response.data);
      var data=response.data;
      var percentages={}
      var columnData={};
      var valPercent={}
      var valPercentList=[];
      var pieChartData={};
      var initiateOptions = {
        exportEnabled: true,
        animationEnabled: true,
        height:300,
        title: {
          text: ""
        },
        data: [{
          type: "pie",
          startAngle: 75,
          toolTipContent: "<b>{label}</b>: {y}%",
          showInLegend: "true",
          legendText: "{label}",
          indexLabelFontSize: 16,
          indexLabel: "{label} - {y}%",
          dataPoints: [ ]
        }]
      }
      var options={};
      let sum=0;
      for (let i=0;i<data.datasetFields.length;i++)
      {
        columnData=data.datasetFields[i];
        percentages=columnData.metrics.value_percentage;  
        if(columnData.datatype==="STRING"){
          options=JSON.parse(JSON.stringify(initiateOptions));
          valPercentList=[];
          sum=0;
          for(var p in percentages)
          {
            sum+=percentages[p];
            valPercent={
              y:percentages[p],
              label:p
            };
            valPercentList.push(valPercent);
          }
          if(sum<100){
            valPercent={y:100-sum,
            label:"NA"};
            valPercentList.push(valPercent);
          }
          options.title.text=columnData.column_name;
          options.data[0].dataPoints=valPercentList;
          pieChartData[columnData.column_name]=options;
        }
      }
      setChartData(pieChartData);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() =>{
    console.log("useEffect called");
    getDatasetInfo();
  }, []);

  return (
    <Container
      className={`${styles.screen}  pt-3 pl-4 `}
      fluid
    >
      <Container className={styles.nav} fluid>
        <span>Dataset info screen</span>
      </Container>
     
      {loading ? (
      <Row style={{alignItems:'center',flexDirection:'column'}}>
        <Spinner animation="border" size="lg" />
      </Row>
      ) : ( 
      <>
     <Container className={styles.content} fluid>
      <h4 className={styles.datasetname}>
       Dataset name : 
      <span >  { info.dataset_name}</span></h4>
      <Row>
        
        <Col sm={6} lg={3}>
          <div className= {`${styles.cardcounter} ${styles.primary}`}>
            <i className="fa fa-clock-o"></i>
            <span className={styles.countnum} >Created on :</span>
            <span className={styles.countname}>{info.created_at.slice(0,-14).trim()}</span>
            <br/>
            <span className={`${styles.countname} ${styles.countname2}`}>{info.created_at.slice(-14,-6).trim()}</span>

          </div>
        </Col>
        <Col sm={6} lg={3}>
          <div className= {`${styles.cardcounter} ${styles.danger}`}>
              <i className="fa fa-ticket"></i>
              <span className={styles.countnum}>File Size :</span>
              <span className={styles.countname}>{info.file_size}</span>
          </div>
        </Col>
        <Col sm={6} lg={3}>
          <div className= {`${styles.cardcounter} ${styles.success}`}>
                <i className="fa fa-database"></i>
                <span className={styles.countnum}>Tuple count :</span>
                <span className={styles.countname}>{info.tuple_count}</span>
          </div>
        </Col>
        <Col sm={6} lg={3}>
          <div className= {`${styles.cardcounter} ${styles.info}`}>
                <i className="fa fa-file"></i>
                <span className={styles.countnum}>File type :</span>
                <span className={styles.countname}>{info.type}</span>
          </div>
        </Col>
      </Row>
      </Container>
      
      <Container className={styles.content} fluid>
      <h4 className={`${styles.datasetname} pb-1`}>Datasets Fields description :
      <span style={{float:"right"}} className="pb-2"> <Button variant="outline-primary" >
      Auto Impute
    </Button>{' '}</span>
      </h4>
     
      <Table striped bordered hover size="md" className={styles.table}  trStyle={rowStyleFormat}>
      <thead>
        <tr>
          <th>No.</th>
          <th>Column Name</th>
          <th>Datatype</th>
          <th>Column type</th>
          <th>Data Imputation</th>
        </tr>
      </thead>
      <tbody>
      {
      info && info.datasetFields.map(column=>
 
     [ <tr 
      onClick={event => handleExpandRow(event, column.column_order)}
      key={column.column_order}>
        <td style={{width:'10%'}}>{column.column_order}</td>
        <td style={{width:'30%'}}>{column.column_name}</td>
        <td style={{width:'25%'}}>{column.datatype}</td>
        <td style={{width:'25%'}}>{column.column_Type}</td>
        <td style={{width:'10%',textAlign:'center'}}><Button style={{padding:"0.1em 0.5rem"}} variant="primary"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></Button></td>
        </tr>,
        <>{
          expandedRows.includes(column.column_order) ?
          <tr  key={column.column_name}>
            <td colSpan="2">
              <div>
                <h4 className={styles.datasetname}>Metrics : </h4>
                <ul>
                  <li>
                    <span><b> Missing count:</b></span> {' '}
                    <span> { column.metrics.missing_values} </span>
                  </li>
                  <li>
                    <span><b>Outlier count:</b></span> {' '}
                    <span> { column.metrics.outlier_count} </span>
                  </li>
                  <li>
                    <span><b>Unique values:</b></span> {' '}
                    <span> { column.metrics.unique_values} </span>
                  </li>
                  <li>
                    <span><b>Samples:</b></span> {' '}
                    {
                      column.metrics.samples.map(sample=>
                        <span>{sample}, </span> 
                      )}
                  </li>
                  <li>
                    <span><b>Column description:</b></span> {' '}
                    <span> { column.column_description} </span>
                  </li>
                </ul>
                </div>
            </td>
            <>{column.datatype==="NUMBER"?
              <td colSpan="3">
                <h4 className={styles.space}>{}</h4>
                <ul>
                  <li>
                    <span><b>Min:</b></span> {' '}
                    <span> { column.metrics.min} </span>
                  </li>
                  <li>
                    <span><b>Mean:</b></span> {' '}
                    <span> { column.metrics.mean} </span>
                  </li>
                  <li>
                    <span><b>Max:</b></span> {' '}
                    <span> {column.metrics.max } </span>
                  </li>
                  <li>
                    <span><b>Median:</b></span> {' '}
                    <span> { column.metrics.median} </span>
                  </li>
                </ul>
              </td>
              :
              <td colSpan="3">
                <CanvasJSChart options = {chartData[column.column_name]}/>
              </td>
            }
            </>
          </tr>
          :null
        }</>
      ]
      )  
    }
      </tbody>
    </Table>
    </Container>
  </>)}{" "}
   </Container>

      
  
  );
};

export default DatasetInfoScreen;
