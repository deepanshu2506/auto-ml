import React, { Component } from 'react'
import {
    Col, Container, Row, Spinner, Form, InputGroup, Card,
} from "react-bootstrap";
import { useState, useEffect } from "react";

import styles from "./styles.module.scss";
import API, { apiURLs } from "../../../API";
import Barchart from "./Barchart";
import Scatterchart from "./Scatterchart";
import Piechart from "./Piechart";
import Linechart from "./Linechart";

const AutovisualizationScreen = (props) => {
    const [state, setState] = useState({});
    const [featuresLoading, setFeaturesLoading] = useState(true);
    const [kValues, setKValues] = useState([]);
    const [visualizationResults, setVisualizationResults] = useState([]);
    const [topKVisualizationResults, setTopKVisualizationResults] = useState([]);
    const params = props.rootParams.params;

    var index = 0;

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    const getVisualizationResults = async () => {
        setFeaturesLoading(true);
        const payload = {
            count: 5,
        };
        try {
            const response = await API.json.post(
                apiURLs.dataset.performAutovisualization(params.datasetID),
                payload,
            );
            setVisualizationResults(response.data);
            for (var i = 2; i <= response.data.length / 5; i++) {
                kValues.push(5 * i)
            }
            await sleep(200);
            setTopKVisualizationResults(response.data.slice(0, 5))
            setFeaturesLoading(false);

        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getVisualizationResults();
    }, []);

    useEffect(() => {
        filterTopKVisualizations();
    }, [state.k]);

    const filterTopKVisualizations = async () => {
        setFeaturesLoading(true);
        await sleep(100);
        setTopKVisualizationResults(visualizationResults.slice(0, state.k))
        setFeaturesLoading(false);
    }

    return (
        <Container className={`${styles.screen} pt-3 pl-4 `} fluid>
            <Container className={styles.nav} fluid>
                <span>Auto visualization</span>
            </Container>
            <Container className={styles.content} fluid>
                <Row className="my-2">
                    <Form
                        noValidate
                    >
                        <Form.Group as={Col} controlId="col-name">
                            <Form.Label>Select k for top visualization</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    onChange={(e) => {
                                        setState((prev) => ({
                                            ...prev,
                                            k: e.target.value,

                                        }));
                                    }}
                                    as="select"
                                    required
                                >
                                    <option value="5">5</option>
                                    {kValues.map((k) => (
                                        <option key={k} value={k}>{k}</option>
                                    ))}
                                </Form.Control>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Row>
            </Container>
            {featuresLoading ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <Col>
                    {visualizationResults ? (
                        <Col>
                            <Container>
                                <Row>
                                    {topKVisualizationResults.map((graphData) => (
                                        <Col xs={12} lg={6} className='mt-3' key={(index = index + 1)}>
                                            <Card>
                                                <Card.Body>
                                                    <Card.Title tag="h5">A {graphData['chart']} chart with the x-axis <b>{graphData['x_name']}</b> and y-axis <b>{graphData['y_name']}</b></Card.Title>
                                                    <hr />
                                                    <Card.Subtitle tag="h6" className="mb-2 text-muted">
                                                        This {graphData['chart']} chart shows the change of {graphData['y_name']} over {graphData['x_name']}
                                                        <br />
                                                        <div>{graphData['describe'].length > 0 ? <div>Operation : {graphData['describe']}</div> : <div></div>}</div>
                                                    </Card.Subtitle>
                                                    <GraphType menu={graphData['chart']} graphData={graphData} />
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Container>
                        </Col>
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

