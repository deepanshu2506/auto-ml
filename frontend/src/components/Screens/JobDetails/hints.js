import {useState } from "react";
import React from 'react'
import styles from "./styles.module.scss";
import {  Button,Container, Modal, Row ,ListGroup,Col} from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import modalbg from "../../../assets/DataInfo.jpg";

const ModelParaInfoGuideScreen = () => {
  const [infoModal,setInfoModal]=useState(false);
  const openInfoModal=()=>setInfoModal(true)
  const closeInfoModal=()=>setInfoModal(false)

  return (
    <div>
        <div className="controls" style={{display:"flex"}}>
            <div className="px-1">
                <Button variant="outline-primary" onClick={openInfoModal}>Info <FaInfoCircle/></Button>
            </div>
        </div>
        <InfoModal show={infoModal} handleClose={closeInfoModal}/>
    </div>
  );
}

const InfoModal=({show,handleClose})=>{
  return (
    <Modal size="lg" animation={true}
    show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Model Job Details helper</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className={styles.wrap}>
        <img
          className={styles.bg}
          src={modalbg}
          alt=""/>
        <div >
        <Container fluid>
          <Row>
            <p>This screen will allow you to inspect the specifics of the models generated as well as export them.</p>
          </Row>
          <Row>
            <h5>Model Parameters info</h5>
          </Row>
          <Row>
            <Col >
              <ListGroup  variant="flush" ol numered>
                <ListGroup.Item as="li" >
                  <div>
                    <div className={styles.bold}>Accuracy</div>
                    Ratio between the no. of correct predictions to the total no. of predictions
                  </div>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <div>
                    <div className={styles.bold}>Precision</div>
                    Ratio between the no. of Positive samples correctly classified to the total no. of samples classified as Positive (either correctly or incorrectly)
                  </div>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <div>
                    <div className={styles.bold}>Recall</div>
                    Ratio between the no. of Positive samples correctly classified as Positive to the total no. of Positive samples
                  </div>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <div>
                    <div className={styles.bold}>Fitness score</div>
                    = 2*((precision*recall)/(precision+recall))   .    
                    It combines the precision and recall of a classifier into a single metric by taking their harmonic mean
                  </div>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <div>
                    <div className={styles.bold}>Error</div>
                    a measure of how well the model predicts the target variable.Helps to indicate the uncertainty in the model
                  </div>
                </ListGroup.Item>
              </ListGroup>           
              </Col>
          </Row>
        </Container>
        </div>
      </div>
      </Modal.Body>
    </Modal>
  )

}
export default ModelParaInfoGuideScreen;