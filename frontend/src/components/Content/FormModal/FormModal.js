import { Modal, Form,Container,Button } from "react-bootstrap";
import { useState, useRef } from "react";
import styles from "./styles.module.scss";

const validateForm = (form, validator) => {
    if (form.current.checkValidity() === false) {
      validator(true);
      return false;
    } else {
      return true;
    }
  };
  
const FormModal = ({ children, show, onClose, onSubmit,animation,closeOnSubmit, ...props }) => {
    const [validate, setValidated] = useState(false);
    const formRef = useRef(null);
  
    const onAdd = () => {
      const isValid = validateForm(formRef, setValidated);
      if (isValid) {
        onSubmit();
      if(closeOnSubmit){
        onClose();
      }
        try {
        } catch (err) {}
      }
    };
    return (
      <Modal show={show} animation={animation} onHide={onClose} centered >
        <Modal.Header closeButton>
          <Modal.Title className={styles.header}>{props.ModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Form noValidate validated={validate} ref={formRef}>
              {children}
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onAdd}>Add</Button>
        </Modal.Footer>
      </Modal>
    );
  };

export default FormModal;

  