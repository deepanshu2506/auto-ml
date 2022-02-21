import React, { Component } from 'react'
import { Col, Container, Row, Spinner, Table, Button, Form, InputGroup, } from "react-bootstrap";
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
                        <Col>
                            {visualizationResults.map((graphData) => (
                                <GraphType menu={graphData['chart']} graphData={graphData} key={(index = index + 1)} />

                            ))}
                        </Col>) : (
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

