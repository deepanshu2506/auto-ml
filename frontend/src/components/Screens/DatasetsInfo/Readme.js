import {
    Button,
    Col,
    Container,
    Form,
    InputGroup,
    Row,
  } from "react-bootstrap";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import API, { apiURLs } from "../../../API";
import { useLocation } from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import FormModal from "../../Content/FormModal/FormModal";
import remarkGfm from 'remark-gfm'

const ReadmeComponent = (props) => {

  const [info, setInfo] = useState(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ fileDetails, setfileDetails] = useState("");
  const {datasetId} = props;
  const openModal = (fileDetails) => {
    setfileDetails(fileDetails);
    setModalOpen(true);
  };

  const getReadmeFile = async () => {
    setLoading(true);
    try {
      const  {data} = await API.json.get(
        apiURLs.dataset.readmeFile(datasetId)
      );
      setInfo(data);
      } catch (err) {
        console.log(err);
        }
        setLoading(false);
  };
 
    useEffect(() => {
        getReadmeFile();
    },[]);

    return (
        <Container className={`${styles.content} mt-2`} fluid>
            <ReadmeModal
                modalOpen={modalOpen}
                datasetId={datasetId}
                fileDetails={fileDetails}
                onClose={() => setModalOpen(false)}
            />    
                <h4 className={`${styles.headtable} pb-1`}>
                  Dataset Description:
                  <span style={{ float: "right" }} className="pb-2">
                    {" "}
                    <Button
                      variant="outline-primary"
                      onClick={() => openModal(info)}>
                      Edit
                    </Button> 
                  </span>
                </h4>
              <Row>
              <Col>
              <Container className={`mt-2`} fluid>
                <ReactMarkdown  children={info} remarkPlugins={[remarkGfm]}/> 
              </Container>
              </Col>
              </Row>
        </Container>
    );
};


const ReadmeModal = ({ modalOpen, datasetId, fileDetails, ...props }) => {
    const [state, setState] = useState({});
    const [isEditting, setEditting] = useState(true);
    const onClose = () => {
    props.onClose();
    };

    const onSubmit = async () => {
    const data = {
        contents: state.input,
    };
    try {
        await API.json.post(
          apiURLs.dataset.readmeFile(datasetId),
        data
        );
        window.location.reload();
    } catch (err) {
        console.log(err);
    }
    };

    useEffect(() => {
        setEditting(!fileDetails);
        setState(prev=>({...prev,input:fileDetails}))
      },[fileDetails]);

    return (
      <Container>
        <FormModal
          show={modalOpen}
          onClose={onClose}
          onSubmit={onSubmit}
          ModalTitle={"Edit the readme file"}
          animation={false}
          closeOnSubmit={true}
          submitText={"Save"}
          showSubmit={true}
        >
            <Row className="mt-2">
              <Form.Group as={Col} controlId="method">
                <InputGroup hasValidation>
                  <Form.Control
                    value={state.input}
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
        </FormModal>
        </Container>
      );
};

export default ReadmeComponent;