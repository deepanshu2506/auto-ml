import { Steps, Hints } from 'intro.js-react';
import {useState } from "react";
import React from 'react'
import styles from "./styles.module.scss";
import {  Button,Container, Modal, Row ,ListGroup,Col} from "react-bootstrap";
import { HiLightBulb } from "react-icons/hi";
import { FaInfoCircle, FaQuestionCircle } from "react-icons/fa";
import modalbg from "../../../assets/DataInfo.jpg";


const DatasetInfoGuideScreen = () => {
    const [guide,setGuide]=useState({
        stepsEnabled: false,
        initialStep: 0,
        steps: [
          {
            element: ".aggbtn",
            intro: "Group and visualize your data"
          },
          {
            element: ".visualizebtn",
            intro: "Get you top visualization charts and analyze"
          },
          {
            element: ".modelbtn",
            intro: "Genarate model automatically and predict data "
          },
          {
            element: ".previewbtn",
            intro: "Preview, search and sort data"
          }
        ],
        hintsEnabled: false,
        hints: [
          {
            element: ".aggbtn",
            hint: "Hint Group and visualize your data",
            hintPosition: "middle-right"
          }
        ]
      });
  const onExit = () => {
    setGuide(() => ({...guide, stepsEnabled: false }));
  };
  const toggleSteps = () => {
    setGuide(prevState => ({...guide, stepsEnabled: !prevState.stepsEnabled }));
  };
  const toggleHints = () => {
      console.log("toggle hints")
    setGuide(prevState =>({...guide,  hintsEnabled: !prevState.hintsEnabled }));
  };
  const [infoModal,setInfoModal]=useState(false);
  const openInfoModal=()=>setInfoModal(true)
  const closeInfoModal=()=>setInfoModal(false)

  return (
    <div>
      <Steps
        enabled={guide.stepsEnabled}
        steps={guide.steps}
        initialStep={guide.initialStep}
        onExit={onExit}
      />
      <Hints enabled={guide.hintsEnabled} hints={guide.hints} />

    <div className="controls" style={{display:"flex"}}>
        <div className="px-1">
            <Button variant="outline-primary" onClick={toggleSteps}>Steps <FaQuestionCircle/></Button>
        </div>
        {/* <div className="px-1">
            <Button variant="outline-primary" onClick={toggleHints}>Hints <HiLightBulb/></Button>
        </div> */}
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
        <Modal.Title>Dataset Info Screen Helper</Modal.Title>
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
            <p>This screen will give us various operations to perform on data and 
              statistics of each column.</p>
          </Row>
          <Row>
            <h5>Metrics info</h5>
          </Row>
          <Row>
            <Col md={6}>
              <ListGroup  variant="flush" ol numered>
                <ListGroup.Item as="li" >
                  <div>
                    <div className={styles.bold}>Missing count</div>
                    Count of values having null data in a column.
                  </div>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <div>
                    <div className={styles.bold}>Outlier count</div>
                    Count of values that lies an abnormal distance from other values in a column.
                  </div>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <div>
                    <div className={styles.bold}>Unique values</div>
                    Count of unique (distinct) values in a column.
                  </div>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <div>
                    <div className={styles.bold}>Samples</div>
                    Samples of that column
                  </div>
                </ListGroup.Item>
              </ListGroup>           
              </Col>
              <Col md={6}>
              <ListGroup  variant="flush" ol numered>            
                <ListGroup.Item as="li">
                  <div>
                    <div className={styles.bold}>Min</div>
                    Minimum value in a column.
                  </div>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <div>
                    <div className={styles.bold}>Mean</div>
                    Average value in a column.
                  </div>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <div>
                    <div className={styles.bold}>Max</div>
                    Maximum value in a column.
                  </div>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <div>
                    <div className={styles.bold}>Median</div>
                    Value separating the higher half from the lower half of a data sample
                  </div>
                </ListGroup.Item>
                <ListGroup.Item as="li">
                  <div>
                    <div className={styles.bold}>Pie chart</div>
                    It shows distribution of total amount divided between levels of a categorical variable as a circle divided into radial slices.
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
export default DatasetInfoGuideScreen;