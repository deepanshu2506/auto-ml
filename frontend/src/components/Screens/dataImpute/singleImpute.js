import {
  Button,
  Container,
  Form,
  Modal,
} from "react-bootstrap";
import styles from "./impute.module.scss";
import {useState,useRef,useEffect } from "react";


const validateForm = (form, validator) => {
  if (form.current.checkValidity() === false) {
    validator(true);
    return false;
  } else {
    return true;
  }
};
const ImputeModal = (props) => {
    const [lgShow, setLgShow] = useState(props.modalOpen);
    const [validate, setValidated] = useState(false);
    const formRef = useRef(null);
    // console.log(props);
    const onClose=()=>{
      setLgShow(false);
    }
    const onSubmit=()=>{
      setLgShow(false);
    }
    const onAdd = () => {
      const isValid = validateForm(formRef, setValidated);
      if (isValid) {
        onSubmit();
        // onClose();
        try {
        } catch (err) {}
      }
    };
    return (
    <Modal
    animation={false}
    size="lg"
    show={lgShow}
    onHide={onClose}
    aria-labelledby="example-modal-sizes-title-lg"
  >
    <Modal.Header closeButton>
      <Modal.Title>
        Single Imputation- {props.columnName}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Container fluid>
        <Form noValidate validated={validate} ref={formRef}>
          
        </Form>
      </Container>
      <Button onClick={onAdd}>Impute</Button>
    </Modal.Body>
  </Modal>
  
  );
};

export default ImputeModal;
