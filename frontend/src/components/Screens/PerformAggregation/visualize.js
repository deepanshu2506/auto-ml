import React,{useState,useEffect} from 'react';
import CanvasJSReact from "../../../assets/canvasjs.react";
import FormModal from "../../Content/FormModal/FormModal";
import {
    Col,
    Form,
    InputGroup,
    Row,
    Spinner
  } from "react-bootstrap";

const VisualizeChart = ({data,showChart,chartState}) => {
  console.log(data);
  const {headers,values}=data;
  const [options,setOptions]=useState(null)
  const[loading,setLoading]=useState(true);
  const [chartProp,setChartProp]=useState(chartState)
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;
  
 useEffect(() => {
     console.log("hereeeee");
  console.log(chartState)
  setChartProp(chartState)
  defineChart(headers,chartProp)
 },[chartState,chartProp])
 
function defineChart(headers,chartState){
  setLoading(true);
  let dp=[]
  console.log(chartState)
  var i=headers.indexOf(chartState.field1)
  var j=headers.indexOf(chartState.field2)
  console.log("Selected fieldsssssss")
  console.log(headers[i])
  console.log(headers[j]);
  var chart_type=chartState.chart_type

  values.map((tuple) => {
    return dp.push({ label: tuple[i],  y: tuple[j]});
  });
  const chart=chart_type.charAt(0).toUpperCase() + chart_type.slice(1);
  // const chart="Bar";
  const optionDefine = {
      title: {
          text: chart +" Chart"
      },
      axisX:{
          title:headers[i],
          interval: 1
       },
      axisY: {
          title: headers[j],
          //minimum: 0,
      maximum: 100
      },
      exportEnabled: true,
      animationEnabled: true,
      showInLegend: true, 
      legendMarkerColor: "grey",
      legendText: "Column names",
          data: [
          {
              type: chart_type,
              dataPoints: dp
          }
          ]
      };
      console.log("options")
      console.log(optionDefine)
      setOptions(optionDefine)
      setLoading(false);
}
 
    return (
        <> 
        {loading ? (
           <Row>
           <Spinner animation="border" variant="primary" />
         </Row>
        ):
         (
        <div style={{width:"100%"}}>
            <CanvasJSChart options={options}
            />
        </div>
        )
         }  
    </>   
  );
}

export const AddVisualizationDialog = ({ show,onClose, onAdd, columns }) => {
  
    const [state, setState] = useState({
      field1:null,
      field2:null,
      chart_type:null
    });
   
    useEffect(()=>{
      if (columns.length===2){
        setState({field1:columns[0],
        field2:columns[1]})
      }
    },[columns])
    const onSubmit = () => onAdd(state);
    const charts=[
        {"name":"Line Chart", "value":"line"},
        {"name":"Bar Chart", "value":"bar"},
        {"name":"Scatter Chart", "value":"scatter"},
        {"name":"Pie Chart", "value":"pie"},
      ]
    return (
      <FormModal
        show={show}
        onClose={onClose}
        onSubmit={onSubmit}
        ModalTitle="Add Visualization"
        animation={true}
        closeOnSubmit={true}
      >
        <Row>
          <Form.Group as={Col} md="4" controlId="col-name">
            <Form.Label>Field 1</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    field1: e.target.value,
                  }));
                }}
                as="select"
                required
              >
                <option value="">Select Field1</option>
                {columns
                  // .filter((column) => column.dataType !== "string")
                  .map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Please select X-axis
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="col-name">
            <Form.Label>Field 2</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    field2: e.target.value,
                  }));
                }}
                as="select"
                required
              >
                <option value="">Select Field2</option>
                {columns
                  // .filter((column) => column.dataType !== "string")
                  .map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Please select Y-axis
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="aggregation-name">
            <Form.Label>Chart Type</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    chart_type: e.target.value,
                  }));
                }}
                as="select"
                required
              >
                <option value="">Select Chart</option>
              {charts.map((chart) => (
                <option key={chart.value} value={chart.value}>{chart.name}</option>
              ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Please select chart type
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
      </FormModal>
    );
  };
  
export default VisualizeChart;

