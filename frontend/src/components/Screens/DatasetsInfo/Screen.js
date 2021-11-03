import {
  Col,
  Container,
  Row,
  Table,
} from "react-bootstrap";
import styles from "./styles.module.scss";
import API from "../../../API";
import {useState,useEffect } from "react";
import {useLocation} from "react-router-dom";
import CanvasJSReact from '../../../assets/canvasjs.react';
// import Clone from "rfdc";

const DatasetInfoScreen = (props) => {
  // const Clone = require('rfdc')()
  const [info, setInfo] = useState(null);
  const location = useLocation();
  console.log(location.pathname);
  const [chartData,setChartData]=useState({});
  const [expandedRows, setExpandedRows] = useState([]);
  // State variable to keep track which row is currently expanded.
  // var CanvasJS = CanvasJSReact.CanvasJS;
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
    try { 
      const pathname=await location.pathname;
      const response = await API.getRequest.get(
        pathname
      );
      setInfo(response.data);
      console.log("dataaa");
      console.log(response.data);
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
      console.log(pieChartData);
      setChartData(pieChartData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() =>{
    console.log("useEffect called");
    getDatasetInfo();
  }, []);

  return (
    <Container >
      <Container className={`${styles.screen} pt-3 pl-4 `} fluid>
        Dataset info screen
      </Container>
     
     {info && <Container className={styles.subtitles}>
      <h1>{ info.dataset_name}</h1>
      <Row>
        
        <Col>
          <div className= {`${styles.cardcounter} ${styles.primary}`}>
            <i className="fa fa-clock-o"></i>
            <span className={styles.countnum}>Created on:</span>
            <span className={styles.countname}>{info.created_at}</span>
          </div>
        </Col>
        <Col>
        <div className= {`${styles.cardcounter} ${styles.danger}`}>
            <i className="fa fa-ticket"></i>
            <span className={`${styles.countnum}`}>File Size:</span>
            <span className={styles.countname}>{info.file_size}</span>
        </div>
      </Col>
      </Row>
      <Row>
        <Col>
          <div className= {`${styles.cardcounter} ${styles.success}`}>
              <i className="fa fa-database"></i>
              <span className={`${styles.countnum}`}>Tuple count:</span>
              <span className={styles.countname}>{info.tuple_count}</span>
          </div>
        </Col>
        <Col>
          <div className= {`${styles.cardcounter} ${styles.info}`}>
              <i className="fa fa-file"></i>
              <span className={`${styles.countnum}`}>File type:</span>
              <span className={styles.countname}>{info.type}</span>
          </div>
        </Col>
      </Row>
      </Container>
      }
      <h3>Datasets Fields description: </h3>
      <Table striped bordered hover size="md" trStyle={rowStyleFormat}>
      <thead>
        <tr>
          <th>No.</th>
          <th>Column Name</th>
          <th>Datatype</th>
          <th>Column type</th>
        </tr>
      </thead>
      <tbody>
      {
      info && info.datasetFields.map(column=>
 
     [ <tr 
      onClick={event => handleExpandRow(event, column.column_order)}
      key={column.column_order}>
        <td>{column.column_order}</td>
        <td>{column.column_name}</td>
        <td>{column.datatype}</td>
        <td>{column.column_Type}</td>
        </tr>,
        <>{
          expandedRows.includes(column.column_order) ?
          <tr  key={column.column_name}>
            <td colSpan="2">
              <div>
                <h4>Metrics </h4>
                <ul>
                  <li>
                    <span><b>Missing count:</b></span> {' '}
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
              <td colSpan="2">
                <h4>{}</h4>
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
              <td colSpan="2">
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
  );
};

export default DatasetInfoScreen;
