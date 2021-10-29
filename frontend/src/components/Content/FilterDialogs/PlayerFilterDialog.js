import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import PlayerRepository from "../../../data/PlayerRepository";
import MultiSelect from "../../MultiSelect/MultiSelect";
import "./styles.scss";
const initFilterState = {
  dob: { from: undefined, to: undefined },
  Batting_Hand: [],
  Bowling_Skill: [],
  Country: [],
};

const PlayerFilterPoints = PlayerRepository.getFilterPoints([
  "Batting_Hand",
  "Bowling_Skill",
  "Country",
]);

const PlayerFilterDialog = ({
  show,
  handleClose,
  applyFilters,
  existingFilters,
  ...props
}) => {
  const [filters, modifyFilters] = useState(initFilterState);
  useEffect(() => {
    modifyFilters({ ...initFilterState, ...existingFilters });
  }, [modifyFilters, existingFilters]);
  const onFilterChange = (filterName) => (event) => {
    modifyFilters({ ...filters, [filterName]: event.map((e) => e.value) });
  };

  const filterData = () => {
    applyFilters(filters);
    handleClose();
  };
  const clearFilters = () => {
    applyFilters({});
    handleClose();
  };

  return (
    <Modal size="lg" show={show} centered onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Filter Players</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            <Col xs={12}>
              <span className="lead">Date Of Birth</span>
            </Col>
            <Col>
              <Row>
                <Col>
                  <Form.Group controlId="from-dob">
                    <Form.Label>From</Form.Label>
                    <Form.Control
                      type="date"
                      value={
                        filters.dob.from
                          ? new Date(filters.dob.from)
                              .toISOString()
                              .substring(0, 10)
                          : ""
                      }
                      onChange={(event) =>
                        modifyFilters({
                          ...filters,
                          dob: { ...filters.dob, from: event.target.value },
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="to-dob">
                    <Form.Label>To</Form.Label>
                    <Form.Control
                      type="date"
                      value={
                        filters.dob.to
                          ? new Date(filters.dob.to)
                              .toISOString()
                              .substring(0, 10)
                          : ""
                      }
                      onChange={(event) =>
                        modifyFilters({
                          ...filters,
                          dob: { ...filters.dob, to: event.target.value },
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
          <hr className="mt-1 mb-3" />
          <Row>
            <Col>
              <Form.Group controlId="batting-hand">
                <Form.Label>
                  <span className="lead">Batting Hand</span>
                </Form.Label>

                <MultiSelect
                  options={PlayerFilterPoints.Batting_Hand}
                  selected={filters.Batting_Hand}
                  onChange={onFilterChange("Batting_Hand")}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="bowling-skill">
                <Form.Label>
                  <span className="lead">Bowling Skill</span>
                </Form.Label>
                <MultiSelect
                  options={PlayerFilterPoints.Bowling_Skill}
                  selected={filters.Bowling_Skill}
                  onChange={onFilterChange("Bowling_Skill")}
                />
              </Form.Group>
            </Col>
          </Row>
          <hr className="mt-1 mb-3" />
          <Row>
            <Col>
              <Form.Group controlId="country">
                <Form.Label>
                  <span className="lead">Country</span>
                </Form.Label>
                <MultiSelect
                  options={PlayerFilterPoints.Country}
                  selected={filters.Country}
                  onChange={onFilterChange("Country")}
                />
              </Form.Group>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Row>
          <Button variant="danger" onClick={clearFilters}>
            CLEAR
          </Button>
          <Button className="ml-2" onClick={filterData} variant="primary">
            FILTER
          </Button>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default PlayerFilterDialog;
