import { Col, Container, Row, Spinner, Table, Button, Form, InputGroup, } from "react-bootstrap";
import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import API, { apiURLs } from "../../../API";

export const ModelSelectionScreen = (props) => {
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
            console.log(data);
            setDataset(data);
            setFeaturesLoading(false);
        } catch (err) {
            console.log(err);
        }
    };
    
    useEffect(() => {
        getFeatures();
    }, []);

    const getResult = async () => {
        const payload = {
            dataset_id: params.datasetID,
            target_col: state.col,
        };


        const response = await API.json.post(
            apiURLs.modelSelectionJob.modelSelection(params.datasetID),
            payload,
        );
        return response;
    };

    const performModelSelection = async () => {
        if (!state.col) {
            setValidated(true);
        } else {
            try {
                const {
                    data
                } = await getResult();
                setResult(data);

            } catch (err) {
                console.log(err);
            }
        }
    };


    return (
        <Container className={`${styles.screen} pt-3 pl-4 `} fluid>
            <Container className={styles.nav} fluid>
                <span>Model Selection</span>
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
                                            Please select the target column
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
                                    onClick={performModelSelection}
                                >
                                    Perform Automatic Model Selection
                                </Button>
                            </Col>
                        </Row>
                    </Container>

                </Col>
            )
            }
        </Container >
    )
}



export default ModelSelectionScreen;
