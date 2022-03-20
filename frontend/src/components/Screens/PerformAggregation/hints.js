import { Steps, Hints } from 'intro.js-react';
import {useState } from "react";
import React from 'react'
import styles from "./styles.module.scss";
import {  Button,Container, Modal, Row ,ListGroup, Col} from "react-bootstrap";
import { FaInfoCircle, FaQuestionCircle } from "react-icons/fa";

import modalbg from "../../../assets/DataInfo.jpg";
const DatasetAggGuideScreen = () => {
    const [guide,setGuide]=useState({
        stepsEnabled: false,
        initialStep: 0,
        steps: [
          {
            element: ".filterbtn",
            // position:"right",
            intro: "Filter data with operation like greater than, equal to, less than, etc."
          },
          {
            element: ".groupbybtn",
            intro: "Group by discrete column"
          },
          {
            element: ".aggfnbtn",
            intro: "Aggregate data by fuctions like mean,sum,max,count,etc."
          },
        ],
       
      });
  const onExit = () => {
    setGuide(() => ({...guide, stepsEnabled: false }));
  };
  const toggleSteps = () => {
    setGuide(prevState => ({...guide, stepsEnabled: !prevState.stepsEnabled }));
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
        <Modal.Title >Dataset Aggregation Screen Helper</Modal.Title>
      </Modal.Header>
      <Modal.Body >
      <div className={styles.wrap}>
        <img
          className={styles.bg}
          src={modalbg}
          alt=""
        />
        <div >
        <Container  fluid>
          <Row>
            <p>This screen will perform filter, groupby and aggregation operations on data,
               visualize and give option to download csv of result.</p>
          </Row>
          <Row>
            <Col md={4}>
              <ListGroup  variant="flush" ol numered>
                <h5>Filters</h5>
                <h6>It provides a set of comparisons that must be true in order for a data item to be returned.</h6>
                <ListGroup.Item as="li">{"<"} Less than</ListGroup.Item>
                <ListGroup.Item as="li">{">"} Greater than</ListGroup.Item>
                <ListGroup.Item as="li">{"<="} Less than equal to</ListGroup.Item>
                <ListGroup.Item as="li">{">="} Greater than equal to</ListGroup.Item>
                <ListGroup.Item as="li">{"="} Equal to</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md ={4}>
              <h5>Grouping</h5>
              <h6>The GROUP BY function groups rows that have the same values into summary rows, like "find the number of customers in each country".</h6>
            </Col>
            <Col md={4}>
              <ListGroup  variant="flush" ol numered>
                <h5>Aggregation functions</h5>
                <h6>Performs a calculation on a set of values, and returns a single value.</h6>
                <ListGroup.Item as="li">Min - Minimum value</ListGroup.Item>
                <ListGroup.Item as="li">Max - Maximum value</ListGroup.Item>
                <ListGroup.Item as="li">Sum - Sum of values</ListGroup.Item>
                <ListGroup.Item as="li">Count - Frquency</ListGroup.Item>
                <ListGroup.Item as="li">Mean - Mean of values</ListGroup.Item>
                <ListGroup.Item as="li">Unique values </ListGroup.Item>
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
export default DatasetAggGuideScreen;