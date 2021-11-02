import { useEffect, useState } from "react";
import { Col, Container, Modal, Row, Spinner, Table } from "react-bootstrap";
import API, { apiURLs } from "../../../API";
import styles from "./styles.module.scss";
import papa from "papaparse";

const PreviewDialogBox = ({ open, onClose, datasetProps, ...props }) => {
  const [datasetDetails, setDatasetDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const fetchDataset = async () => {
    try {
      setLoading(true);
      const { data } = await API.json.post(
        apiURLs.misc.previewDataFromDb,
        datasetProps
      );
      papa.parse(data, {
        header: true,
        complete: (results, file) => {
          setDatasetDetails({
            fields: results.meta.fields,
            preview: results.data,
          });
          setLoading(false);
        },
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      fetchDataset();
    }
  }, [open]);

  return (
    <Modal show={open} onHide={onClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>{datasetProps.dataset_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          {loading ? (
            <Row>
              <Spinner animation="border" variant="primary" />
            </Row>
          ) : (
            datasetDetails.preview && (
              <Row
                className={`${styles.tablecontainer} ${styles.previewDatasetTableContainer} flex-grow-1 `}
              >
                <Col className=" table-containepx-0">
                  <Table hover className={styles.table}>
                    <thead className="bg-primary">
                      <tr>
                        {datasetDetails.fields.map((item, idx) => (
                          <th key={idx}>{item}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {datasetDetails.preview.map((item, idx) => (
                        <tr key={idx}>
                          {Object.values(item).map((cell, idx) => (
                            <td key={idx}>
                              {cell && cell !== "" ? (
                                cell
                              ) : (
                                <span className="not-available">N/A</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            )
          )}
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default PreviewDialogBox;
