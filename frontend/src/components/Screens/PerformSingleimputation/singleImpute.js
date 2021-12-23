import {
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import styles from "./impute.module.scss";
import {useState} from "react";
import FormModal from "../../Content/FormModal/FormModal";
import API, { apiURLs } from "../../../API";

const ImputeModal = (props) => {
  const [show, setShow] = useState(props.modalOpen);
  const columnDetail = props.columnDetail;
  const methods=["mean","median","value","knn","max_freq"];
  const methodsString=["value","knn","max_freq"];
  const [state, setState] = useState({});
  const [method,setMethod]=useState("");
  const [result, setResult] = useState(null);

  const performSingleImputation = async () => {
    try {
      const body={
        col_name:columnDetail.column_name,
        impute_type:state.impute_type,
        value:state.value
      }
      const {
        data: { data },
      } = await API.json.post(
        apiURLs.dataset.singleColImputation(props.datasetId),
        body
      );
      console.log(data);
      setResult(data);
      console.log("data imputed"+ data.imputed);
      props.passIsImputed(data.imputed);
      console.log(data.imputed);
    } catch (err) {
      console.log(err);
    }
  };
  
  const onClose=()=>{
    setShow(false);
  }
  const onSubmit=()=>{
    // console.log(state);
    performSingleImputation();

  }
  return (
  <FormModal
  show={show}
  onClose={onClose}
  onSubmit={onSubmit}
  ModalTitle={"Single column imputation - "+columnDetail.column_name}
  animation={false}
  closeOnSubmit={false}
>
  <Row>
    <Form.Group as={Col} md="7" controlId="method">
      <Form.Label>Imputation method</Form.Label>
      <InputGroup hasValidation>
        <Form.Control
          onChange={(e) => {
            setMethod(e.target.value);
            setState((prev) => ({
              ...prev,
              impute_type: e.target.value,
            }));
          }}
          as="select"
          required
        >
          <option value="">Select Column</option>
          {columnDetail.datatype==="NUMBER"?
          methods.map((method) => (
            <option key={method} value={method}>{method}</option>
          )):
          methodsString.map((method) => (
            <option key={method} value={method}>{method}</option>
          ))
          }
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          Please select Column
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
    {method==="value"?
    <Form.Group as={Col} md="5" controlId="value">
    <Form.Label>Value</Form.Label>
    <InputGroup hasValidation>
      <Form.Control
        required
        type="text"
        placeholder="Value"
        onChange={(e) => {
          setState((prev) => ({
            ...prev,
            value: e.target.value,
          }));
        }}
      />
      <Form.Control.Feedback type="invalid">Please add value!</Form.Control.Feedback>
    </InputGroup>
  </Form.Group>
    :null}
  </Row>
  <Row>
    <Container>
      {result?
      <Container className={styles.result}>
        {!result.imputed?
         <h5>{result.result}</h5>
        :
          <h5>Succesfully Imputed  {result.result.imputed_count} values of column {result.result.col_name} !</h5>
        }
      </Container>
      :null}
    </Container>
    </Row>
</FormModal>
  );
};

export default ImputeModal;
