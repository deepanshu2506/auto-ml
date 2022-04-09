import {
    Button,
    Col,
    Container,
    Form,
    InputGroup,
    Row,
    Spinner,
  } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import API, { apiURLs } from "../../../API";
import { useHistory } from "react-router";
import { Link, useLocation } from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import FormModal from "../../Content/FormModal/FormModal";


const ReadmeComponent = () => {

  const [info, setInfo] = useState(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [datasetId, setDatasetId] = useState("");
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ fileDetails, setfileDetails] = useState("");
    
  const openModal = (datasetId, fileDetails) => {
    console.log(fileDetails);
    setfileDetails(fileDetails);
    setModalOpen(true);
  };

  const getReadmeFile = async () => {
    setLoading(true);
    try {
      const pathname = await location.pathname;
      console.log("pathname", pathname);
      setDatasetId(pathname.substring(10));
    //   const response = await API.getRequest.get(pathname+"/readme");
    //   setInfo(response.data);
      const  data = await API.json.get(
        apiURLs.dataset.readmeFile(datasetId)
      );
      setInfo(data);
      console.log("readme value",data);
    //   var data = response.data;
      } catch (err) {
        console.log(err);
        }
        setLoading(false);
  };

    // const onSubmit = async () => {
    // const data = {
    //     data: [
    //     {
    //         input: state.input,
    //     },
    //     ],
    // };
    // try {
    //     await API.json.post(
    //     apiURLs.dataset.readme(datasetId),
    //     data
    //     );
    //     window.location.reload();
    // } catch (err) {
    //     console.log(err);
    // }
    // };
 
    useEffect(() => {
        getReadmeFile();
    },[]);

    return (
        <Container>
            <ReadmeModal
                modalOpen={modalOpen}
                datasetId={datasetId}
                fileDetails={fileDetails}
                onClose={() => setModalOpen(false)}
            />    
            <Container>
              <Row>

              <Col>
                <Button
                    style={{ padding: "0.1em 0.5rem" }}
                    variant="primary"
                    onClick={() => openModal(datasetId, info)}
                >
                    <i
                    className="fa fa-pencil-square-o"
                    aria-hidden="true"
                    ></i>
                </Button>
                </Col>
                <Col>
                {
                  info ? (
                    <ReactMarkdown className='cfe-markdown' source={info}/>) : (
                    <Col style={{ fontStyle: "italic", color: "#aaa" }}>
                    No Readme file created for this dataset.
                    </Col>
                      )
                }
                </Col>
              </Row>
            </Container>
        </Container>

    );
};


const ReadmeModal = ({ modalOpen, datasetId, fileDetails, ...props }) => {
    const [state, setState] = useState({});

    const [isEditting, setEditting] = useState(!fileDetails);

    const onClose = () => {
    props.onClose();
    };

    const onSubmit = async () => {
    // const data = {
    //     data: [
    //     {
    //         input: state.input,
    //     },
    //     ],
    // };
    // try {
    //     await API.json.post(
    //     apiURLs.dataset.readme(datasetId),
    //     data
    //     );
    //     window.location.reload();
    // } catch (err) {
    //     console.log(err);
    // }
    };

    const onEdit = () => {
        setEditting(true);
        if (fileDetails) {
          setState((prev) => ({
            ...prev,
            input: fileDetails,
          }));
        }
    };

    useEffect(() => {
        setEditting(!fileDetails);
      });

    return (
        <FormModal
          show={modalOpen}
          onClose={onClose}
          onSubmit={onSubmit}
          ModalTitle={"Edit the readme file"}
          animation={false}
          closeOnSubmit={true}
          submitText={"Save"}
          showSubmit={isEditting}
        >
          <Row>
            {fileDetails ? (
              <Col>{fileDetails}</Col>
            ) : (
              <Col style={{ fontStyle: "italic", color: "#aaa" }}>
                No Readme file created for this dataset.
              </Col>
            )}
          </Row>
          {fileDetails && (
            <Row className="mt-2">
              <Col>
                <Button onClick={onEdit}>Edit</Button>
              </Col>
            </Row>
          )}
          {isEditting && (
            <Row className="mt-2">
              <Form.Group as={Col} controlId="method">
                <InputGroup hasValidation>
                  <Form.Control
                    onChange={(e) => {
                      setState((prev) => ({
                        ...prev,
                        input: e.target.value,
                      }));
                    }}
                    required
                    as="textarea"
                  />
                </InputGroup>
              </Form.Group>
            </Row>
          )}
        </FormModal>
      );


};

export default ReadmeComponent;