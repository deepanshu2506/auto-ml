import React, { Component } from 'react'
import {
    Col, Container, Row, Spinner, Form, InputGroup, Card, Button
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { FaDownload, FaChartLine, FaTable } from "react-icons/fa";

import styles from "./styles.module.scss";
import API, { apiURLs } from "../../../API";
import Barchart from "./Barchart";
import Scatterchart from "./Scatterchart";
import Piechart from "./Piechart";
import Linechart from "./Linechart";
import Select from 'react-select';

const AutovisualizationScreen = (props) => {
    const [state, setState] = useState({});
    const [featuresLoading, setFeaturesLoading] = useState(true);
    const [resultsLoading, setResultsLoading] = useState(false);
    const [kValues, setKValues] = useState([]);
    const [visualizationResults, setVisualizationResults] = useState([]);
    const [topKVisualizationResults, setTopKVisualizationResults] = useState([]);
    const [dataset, setDataset] = useState({});
    const [dataList, setDataList] = useState([]);

    const params = props.rootParams.params;
    var index = 0;
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    const getFeatures = async () => {
        setFeaturesLoading(true);
        try {
            const { data } = await API.json.get(
                apiURLs.dataset.getDatasetDetails(params.datasetID)
            );
            setDataset(data);
            getSelectOptions(data);
            setFeaturesLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const getSelectOptions = async (data) => {
        try {
            var index = 1
            data.datasetFields.map((val) => {
                dataList.push({
                    value: index,
                    label: val.column_name,
                })
                index += 1;
            });
            setDataList(dataList);
        }
        catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        getFeatures();
        //getVisualizationResults();
    }, []);

    useEffect(() => {
        if (state.k) {
            filterTopKVisualizations();
        }
    }, [state.k]);

    const filterTopKVisualizations = async () => {
        setResultsLoading(true);
        await sleep(100);
        setTopKVisualizationResults(visualizationResults.slice(0, state.k))
        setResultsLoading(false);
    }

    const getVisualizationResults = async () => {
        setResultsLoading(true);
        var dropped = [];
        selectedValue.map((val) => {
            dropped.push(dataList[val - 1]['label']);
        });
        console.log(dropped);
        const payload = {
            count: 5,
            dropped_columns: dropped
        };
        try {
            const response = await API.json.post(
                apiURLs.dataset.performAutovisualization(params.datasetID),
                payload,
            );
            setVisualizationResults(response.data);
            var values = []
            for (var i = 2; i <= response.data.length / 5; i++) {
                values.push(5 * i)
            }
            //setKValues((prev) => [...prev, ...values]);
            setKValues(values);
            setTopKVisualizationResults(response.data.slice(0, 5))
            setResultsLoading(false);

        } catch (err) {
            console.log(err);
        }
    };

    const [selectedValue, setSelectedValue] = useState([]);
    const handleChange = (e) => {
        setSelectedValue(Array.isArray(e) ? e.map(x => x.value) : []);
    }

    return (
        <Container className={`${styles.screen} pt-3 pl-4 `} fluid>
            <Container className={styles.nav} fluid>
                <span>Auto visualization</span>
            </Container>
            <Container className={styles.content} fluid>
            {featuresLoading ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <Col>
                    
                        <h4 className={styles.datasetname}>
                            {dataset.dataset_name}
                        </h4>
                        <Row className=" mt-3 mb-0">
                            <Col>
                                <Form
                                    noValidate
                                >
                                    <Form.Group as={Col} controlId="col-name">
                                        <Form.Label>Select K for top visualization</Form.Label>
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
                            </Col>
                            <Col>
                                <Row>
                                    Select columns to be dropped
                                </Row>
                                <Row className="mt-2">
                                    <Select
                                        className={styles.dropdown}
                                        placeholder="Select Option"
                                        value={dataList.filter(obj => selectedValue.includes(obj.value))} // set selected values
                                        options={dataList}
                                        onChange={handleChange}
                                        isMulti
                                        isClearable
                                    />
                                </Row>

                            </Col>
                        </Row>
                        <Row>
                            <Col className="mx-3">
                                <Button
                                    block
                                    variant="primary"
                                    onClick={() => getVisualizationResults()}
                                >
                                    Visualize Result {"  "}
                                    <FaChartLine />
                                </Button>
                            </Col>
                        </Row>
                  

                    {topKVisualizationResults && !resultsLoading ? (
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
                        <Spinner animation="border" variant="primary" />
                    )}
                </Col>
                
            )}
            </Container>
            </Container>
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

