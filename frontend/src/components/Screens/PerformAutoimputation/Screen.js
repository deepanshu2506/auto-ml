import { Col, Container, Row, Spinner, Table, Button, Form, InputGroup, } from "react-bootstrap";
import { useState, useEffect } from "react";

import styles from "./styles.module.scss";
import API, { apiURLs } from "../../../API";
import MissingValuesBarchart from "./missingValuesBarchart";
import ImputedValuesTable from "./imputedValuesTable";

export const AutoimputeScreen = (props) => {
    const [state, setState] = useState({});
    const [validated, setValidated] = useState(false);
    const [featuresLoading, setFeaturesLoading] = useState(true);
    const [dataset, setDataset] = useState({});
    const [datasetPreview, setDatasetPreview] = useState(null);
    const [result, setResult] = useState(null);
    const params = props.rootParams.params;

    var index = 0;
    const getFeatures = async () => {
        setFeaturesLoading(true);

        try {
            const { data } = await API.json.get(
                apiURLs.dataset.getDatasetDetails(params.datasetID)
            );
            setDataset(data);
            setFeaturesLoading(false);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getFeatures();
    }, []);

    const getAutoimputationResult = async (exportToFile = false) => {
        const payload = {
            target_col_name: state.col,
            export_to_file: exportToFile,
        };

        const reqConfig = exportToFile ? { responseType: "blob" } : {};

        const response = await API.json.post(
            apiURLs.dataset.performAutoimputation(params.datasetID),
            payload,
            reqConfig
        );
        return response;
    };

    const performAutoimputation = async () => {
        if (!state.col) {
            setValidated(true);
        } else {
            try {
                const {
                    data
                } = await getAutoimputationResult();
                setResult(data);
                try {
                    const { data } = await getDatasetPreview();
                    setDatasetPreview(data);
                }
                catch (err) {
                    console.log(err);
                }

            } catch (err) {
                console.log(err);
            }
        }
    };

    const getDatasetPreview = async (exportToFile = false) => {
        try {
            const response = await API.json.get(apiURLs.dataset.getDatasetPreview(params.datasetID),{
                params: {
                  exportToFile:exportToFile
                }});
            return response;
        }
        catch (err) {
            console.log(err)
        }
    }

    const downloadAutoimputation = async () => {
        try {
            const response = await getDatasetPreview(true);
            const fileNameHeader = "x-suggested-filename";
            const suggestedFileName = response.headers[fileNameHeader];
            const effectiveFileName =
                suggestedFileName === undefined ? "result.csv" : suggestedFileName;
            console.log(
                `Received header [${fileNameHeader}]: ${suggestedFileName}, effective fileName: ${effectiveFileName}`
            );

            // Let the user save the file.
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", effectiveFileName); //or any other extension
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Container className={`${styles.screen} pt-3 pl-4 `} fluid>
            <Container className={styles.nav} fluid>
                <span>Auto imputation</span>
            </Container>
            {featuresLoading ? (
                <Spinner animation="border" variant="primary" />
            ) : (

                <Col>
                    <Container className={styles.content} fluid>
                        <Row className="my-2">
                            <Form
                                noValidate
                                validated={validated}
                            >
                                <Form.Group as={Col} controlId="col-name">
                                    <Form.Label>Target Column Name</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            onChange={(e) => {
                                                setState((prev) => ({
                                                    ...prev,
                                                    col: e.target.value,
                                                }));
                                            }}
                                            as="select"
                                            required
                                        >
                                            <option value="">Select target Column</option>
                                            {dataset.datasetFields.map((column) => (
                                                <option key={column.column_name} value={column.column_name}>{column.column_name}</option>
                                            ))}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            Please select Column
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </Row>
                        <Row className="my-3">
                            <Col>
                                <Button
                                    disabled={!state.col}
                                    block
                                    variant="primary"
                                    onClick={performAutoimputation}
                                >
                                    Perform Auto Imputation
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    disabled={!result}
                                    block
                                    variant="primary"
                                    onClick={downloadAutoimputation}
                                >
                                    Download imputed dataset
                                </Button>
                            </Col>
                        </Row>
                    </Container>

                    {result && result['Imputer selected'] === 'Null' ? (
                        <Container className={styles.linecontent} fluid>
                            <Row style={{ justifyContent: "center" }}>
                                {result['data']}
                            </Row>
                        </Container>
                    ) : (<></>)
                    }

                    {dataset && result && result['Imputer selected'] !== 'Null' ? (
                        <Col>
                            <Container className={styles.content} fluid>
                                <h4 style={{ padding: "0 5%" }} className={styles.datasetname}>
                                    Imputation method selected :<span>  {result['Imputer selected']}</span>
                                </h4>
                                <Row style={{ padding: "0 5%" }}>
                                    <MissingValuesBarchart result={result} tuple_count={dataset.tuple_count} columns={dataset.datasetFields} />
                                </Row>
                            </Container>
                            <Container className={styles.content} fluid>
                                <ImputedValuesTable result={result} tuple_count={dataset.tuple_count} />
                            </Container>
                            <Container className={styles.content} fluid>
                                {datasetPreview && (
                                    <>
                                        <h4 className={styles.datasetname}>
                                            Imputed dataset :
                                        </h4>
                                        {
                                            dataset.tuple_count < 100 ? (
                                                <p
                                                    className={styles.legend}
                                                >{`(showing ${dataset.tuple_count} of ${dataset.tuple_count})`}</p>
                                            ) : (
                                                <p
                                                    className={styles.legend}
                                                >{`(showing 100 of ${dataset.tuple_count})`}</p>
                                            )
                                        }

                                        <Row className={`${styles.tablecontainer} flex-grow-1 `}>
                                            <Col className=" table-containepx-0">
                                                <Table hover className={styles.table}>
                                                    <thead className="bg-primary">
                                                        <tr>
                                                            {datasetPreview.headers.map((header) => (
                                                                <th key={header}>{header}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {datasetPreview.values.map((row) => (
                                                            <tr key={(index = index + 1)}>
                                                                {row.map((val) => (
                                                                    <td key={(index = index + 1)}>{val}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </Container>
                        </Col>
                    ) : (<></>)
                    }

                </Col>
            )
            }
        </Container >
    )
}



export default AutoimputeScreen;
