import { Col, Container, Row, Table, Spinner, Button } from "react-bootstrap";
import styles from "./styles.module.scss";
import API from "../../../API";
import {useState,useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import CanvasJSReact from '../../../assets/canvasjs.react';
import ImputeModal from "../PerformSingleimputation/singleImpute";
import DatasetInfoGuideScreen from "./hints";

const DatasetInfoScreen = (props) => {
  const [info, setInfo] = useState(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [errMsg,setErrMsg]=useState("")
  const [chartData,setChartData]=useState({});
  const [expandedRows, setExpandedRows] = useState([]);
  const [modalOpen,setModalOpen] = useState(false);
  const [datasetId,setDatasetId] = useState("");
  const [columnDetail,setcolumnDetail] = useState({});
  const [isImputed, setIsImputed] = useState(false);

  var CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const handleExpandRow = (event, columnId) => {
    const currentExpandedRows = expandedRows;
    const isRowExpanded = currentExpandedRows.includes(columnId);
    let obj = {};
    isRowExpanded ? (obj[columnId] = false) : (obj[columnId] = true);
    // If the row is expanded, we are here to hide it. Hence remove
    // it from the state variable. Otherwise add to it.
    const newExpandedRows = isRowExpanded
      ? currentExpandedRows.filter((id) => id !== columnId)
      : currentExpandedRows.concat(columnId);

    setExpandedRows(newExpandedRows);
  }
  const openModal=(datasetId,columnDetail)=>{
    setIsImputed(false);
    setcolumnDetail(columnDetail);
    setModalOpen(true);
  }

 const getDatasetInfo=async()=>{
  setLoading(true);
    try { 
      const pathname=await location.pathname;
      console.log("pathname",pathname);
      setDatasetId(pathname.substring(10));
      const response = await API.getRequest.get(
        pathname
      );
      setInfo(response.data);
      // console.log(response.data);
      var data=response.data;
      var percentages={},columnData={},valPercent={},pieChartData={};
      var valPercentList=[];
      const threshold=15;
      var yPercent;
      var initiateOptions = {
        exportEnabled: true,
        animationEnabled: true,
        height: 300,
        title: {
          text: "",
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
        if(columnData.column_Type==="discrete"){
          options=JSON.parse(JSON.stringify(initiateOptions));
          valPercentList=[];
          sum=0;
          var t=0;
          for(var p in percentages)
          {
            t+=1
            sum+=percentages[p];
            yPercent=Math.round(percentages[p] * 100) / 100
            valPercent={
              y:yPercent,
              label:p
            };
            valPercentList.push(valPercent);
            if(t>threshold){break;}
          }
          if(t>threshold){continue;}
          if(sum<100){
            valPercent={y:100-sum,
            label:"NA"};
            valPercentList.push(valPercent);
          }
          options.title.text = columnData.column_name;
          options.data[0].dataPoints = valPercentList;
          pieChartData[columnData.column_name] = options;
        }
      }
      setChartData(pieChartData);
    } 
    catch(err){
      setErr(true);
      if(err.response)
    {  if (err.response.status === 404) {
        console.log(err.response.data.error);
        setErrMsg(err.response.data.error);
      } else if(err.response.status === 422 || err.response.status===401) 
      {
        console.log(err.response.data.error);
        setErrMsg("Not authorised user");
      }else{
        setErrMsg(err.message);
      }
    }
    else{
      setErrMsg("Sever not running!");
    }
    }
    setLoading(false);
  };

  useEffect(() => {
    getDatasetInfo();
    setIsImputed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImputed]);

  return (
    <Container className={`${styles.screen}  pt-3 pl-4 `} fluid>
    <ImputeModal key={columnDetail.column_name} passIsImputed={setIsImputed} modalOpen={modalOpen} datasetId={datasetId} columnDetail={columnDetail}></ImputeModal>
      <Container className={styles.nav} fluid>
        <span>Dataset info screen</span>
        <div className={styles.hintbtns}>
          <DatasetInfoGuideScreen />
        </div>
      </Container>
      {err?
      <Container className={`${styles.content} my-1`} fluid>
        <Container className={styles.err}>
        <h5>{errMsg} !</h5>
        </Container>
     </Container>
     :(
       <>
      {loading ? (
        <Row style={{ alignItems: "center", flexDirection: "column" }}>
          <Spinner animation="border" size="lg" />
        </Row>
      ) : (
        <>
          <Container className={`${styles.content} mb-2`} fluid>
            <h4 className={styles.datasetname}>
              Dataset name :<span> {info.dataset_name}</span>
            </h4>
            <Row>
              <Col sm={6} lg={3}>
                <div className={`${styles.cardcounter} ${styles.primary}`}>
                  <i className="fa fa-clock-o"></i>
                  <span className={styles.countnum}>Created on :</span>
                  <span className={styles.countname}>
                    {info.created_at.slice(0, -14).trim()}
                  </span>
                  <br />
                  <span className={`${styles.countname} ${styles.countname2}`}>
                    {info.created_at.slice(-14, -6).trim()}
                  </span>
                </div>
              </Col>
              <Col sm={6} lg={3}>
                <div className={`${styles.cardcounter} ${styles.danger}`}>
                  <i className="fa fa-ticket"></i>
                  <span className={styles.countnum}>File Size :</span>
                  <span className={styles.countname}>{info.file_size}</span>
                </div>
              </Col>
              <Col sm={6} lg={3}>
                <div className={`${styles.cardcounter} ${styles.success}`}>
                  <i className="fa fa-database"></i>
                  <span className={styles.countnum}>Tuple count :</span>
                  <span className={styles.countname}>{info.tuple_count}</span>
                </div>
              </Col>
              <Col sm={6} lg={3}>
                <div className={`${styles.cardcounter} ${styles.info}`}>
                  <i className="fa fa-file"></i>
                  <span className={styles.countnum}>File type :</span>
                  <span className={styles.countname}>{info.type}</span>
                </div>
              </Col>
            </Row>
          </Container>
          <Row className={styles.functions}>
            <Col md={3}>
              <Link to={`${location.pathname}/aggregation`}>
                <Button className="aggbtn" block>Aggregation</Button>
              </Link>
            </Col>
            <Col md={3}>
              <Link to={`${location.pathname}/visualization`}>
                <Button className="visualizebtn" block>Visualization</Button>
              </Link>
            </Col>
            <Col md={3}>
              <Link to={`/dataset/model_selection/${info.id}`}>
                <Button className="modelbtn" block>Create Model</Button>
              </Link>
            </Col>
            <Col md={3}>
              <Link to={`${location.pathname}/preview`}>
                <Button className="previewbtn" block>Dataset Preview</Button>
              </Link>
            </Col>
          </Row>
          <Container className={`${styles.content} mt-2`} fluid>
            <h4 className={`${styles.headtable} pb-1`}>
              Datasets Fields description :
              <span style={{ float: "right" }} className="pb-2">
                {" "}
                <Link to={`${location.pathname}/auto_impute`}>
                  <Button variant="outline-primary">Auto Impute</Button>{" "}
                </Link>
              </span>
            </h4>

            <Table
              striped
              bordered
              hover
              size="md"
              className={styles.infotable}
            >
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
                {info &&
                  info.datasetFields.map((column,i) => [
                    <tr key={i} >
                      <td style={{ width: "10%" }}>{column.column_order +i}</td>
                      <td  
                      onClick={(event) =>
                        handleExpandRow(event, column.column_order)
                      }
                      style={{ width: "30%" }}>{column.column_name}</td>
                      <td style={{ width: "23%" }}>{column.datatype.toLowerCase()}</td>
                      <td style={{ width: "23%" }}>{column.column_Type}</td>
                      <td style={{width:'24%',textAlign:'center'}}>
                        <Button style={{padding:"0.1em 0.5rem"}} variant="primary" onClick={()=>openModal(datasetId,column)} >
                          <i className="fa fa-pencil-square-o" aria-hidden="true">
                          </i>
                        </Button>
                      </td>
                    </tr>,
                    <>
                      {expandedRows.includes(column.column_order) ? (
                        <tr className={styles.metrics} key={i*10}>
                          <td colSpan="2">
                            <div>
                              <h4 className={styles.datasetname}>Metrics : </h4>
                              <ul>
                                <li key={i*10+1}>
                                  <span>
                                    <b> Missing count:</b>
                                  </span>{" "}
                                  <span> {column.metrics.missing_values} </span>
                                </li>
                                <li key={i*10+2}>
                                  <span>
                                    <b>Outlier count:</b>
                                  </span>{" "}
                                  <span> {column.metrics.outlier_count} </span>
                                </li>
                                <li key={i*10+3}>
                                  <span>
                                    <b>Unique values:</b>
                                  </span>{" "}
                                  <span> {column.metrics.unique_values} </span>
                                </li>
                                <li key={i*10+4}>
                                  <span>
                                    <b>Samples:</b>
                                  </span>{" "}
                                  {column.metrics.samples.map((sample) => (
                                    <span key={sample}>{sample}, </span>
                                  ))}
                                </li>
                                <li key={i*10+5}>
                                  <span>
                                    <b>Column description:</b>
                                  </span>{" "}
                                  <span> {column.column_description} </span>
                                </li>
                              </ul>
                            </div>
                          </td>
                          <>
                            {column.column_Type  === "continous" ? (
                              <td colSpan="3">
                                <h4 className={styles.space}>{}</h4>
                                <ul>
                                  <li key={i*10+6}>
                                    <span>
                                      <b>Min:</b>
                                    </span>{" "}
                                    <span> {column.metrics.min} </span>
                                  </li>
                                  <li key={i*10+7}>
                                    <span>
                                      <b>Mean:</b>
                                    </span>{" "}
                                    <span> { Math.round(column.metrics.mean * 100) / 100} </span>
                                  </li>
                                  <li key={i*10+8}>
                                    <span>
                                      <b>Max:</b>
                                    </span>{" "}
                                    <span> {column.metrics.max} </span>
                                  </li>
                                  <li key={i*10+9}>
                                    <span>
                                      <b>Median:</b>
                                    </span>{" "}
                                    <span> {column.metrics.median} </span>
                                  </li>
                                </ul>
                              </td>
                            ) : (
                              <td colSpan="3">
                                {column.metrics.unique_values<15?
                                <CanvasJSChart options = {chartData[column.column_name]}/>:
                                <h6>More than 15 unique values to show in graph</h6>
                                }
                              </td>
                            )}
                          </>
                        </tr>
                      ) : null}
                    </>,
                  ])}
              </tbody>
            </Table>
          </Container>
      </>)}{" "}
    </>
    )}
     
   </Container>
  );
};

export default DatasetInfoScreen;
