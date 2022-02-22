import React, { Component } from 'react'
import {
    Col, Container, Row, Spinner, Table, Button, Form, InputGroup, Card,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import styles from "./styles.module.scss";
import API, { apiURLs } from "../../../API";
import Barchart from "./Barchart";
import Scatterchart from "./Scatterchart";
import Piechart from "./Piechart";
import Linechart from "./Linechart";

const AutovisualizationScreen = (props) => {
    // const [state, setState] = useState({});
    // const [validated, setValidated] = useState(false);
    const [featuresLoading, setFeaturesLoading] = useState(true);
    const [visualizationResults, setVisualizationResults] = useState({});
    const params = props.rootParams.params;

    var index = 0;
    const getVisualizationResults = async () => {
        setFeaturesLoading(true);
        const payload = {
            count: 10,
        };
        try {
            const response = await API.json.post(
                apiURLs.dataset.performAutovisualization(params.datasetID),
                payload,
            );
            setVisualizationResults(response.data);
            console.log(response);
            setFeaturesLoading(false);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getVisualizationResults();
    }, []);

    return (
        <Container className={`${styles.screen} pt-3 pl-4 `} fluid>
            <Container className={styles.nav} fluid>
                <span>Auto visualization</span>
            </Container>
            {featuresLoading ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <Col>
                    {visualizationResults ? (
                        <Container>
                            <Row>
                                {visualizationResults.map((graphData) => (
                                    <Col xs={12} lg={6} className='mt-3'key={(index = index + 1)}>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title tag="h5">A {graphData['chart']} chart with the x-axis <b>{graphData['x_name']}</b> and y-axis <b>{graphData['y_name']}</b></Card.Title>
                                                <hr/>
                                                <Card.Subtitle tag="h6" className="mb-2 text-muted">
                                                This {graphData['chart']} chart shows the change of {graphData['y_name']} over {graphData['x_name']}
                                                <br/>
                                                <div>{graphData['describe'].length ? <p>Operation : {graphData['describe']}</p> :null}</div>
                                                </Card.Subtitle>
                                                <Card.Text>
                                                    <GraphType menu={graphData['chart']} graphData={graphData} />
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Container>

                    ) : (
                        <Col>
                        </Col>)}
                </Col>
            )
            }
        </Container >
    )
}

function GraphType({ menu, graphData }) {
    switch (menu) {
        case 'bar':
            return <Barchart graphData={graphData}>{graphData['chart']}</Barchart>;
        case 'scatter':
            return <Scatterchart graphData={graphData}>{graphData['chart']}</Scatterchart>;
        case 'pie':
            return <Piechart graphData={graphData}>{graphData['chart']}</Piechart>;
        case 'line':
            return <Linechart graphData={graphData}>{graphData['chart']}</Linechart>;
        default:
            return null;
    }
}

export default AutovisualizationScreen;

