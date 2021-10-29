import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";

import MatchRepository from "../../../data/MatchRepository";
import MultiSelect from "../../MultiSelect/MultiSelect";
import "./styles.scss";
const initFilterState = {
  season: [],
  venue: [],
  playingTeam: [],
  tossDecision: [],
  winnerTeam: [],
  umpire: [],
};

const MatchFilterPoints = MatchRepository.getFilterPoints([
  "season",
  "Venue",
  "tossDecision",
]);

const MatchFilterDialog = ({
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
        <Modal.Title>Filter Matches</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            <Col>
              <Form.Group controlId="season">
                <Form.Label>
                  <span className="lead">Season</span>
                </Form.Label>

                <MultiSelect
                  options={MatchFilterPoints.season}
                  selected={filters.season}
                  onChange={onFilterChange("season")}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="venue">
                <Form.Label>
                  <span className="lead">Venue</span>
                </Form.Label>
                <MultiSelect
                  options={MatchFilterPoints.Venue}
                  selected={filters.venue}
                  onChange={onFilterChange("venue")}
                />
              </Form.Group>
            </Col>
          </Row>
          <hr className="mt-1 mb-3" />
          <Row>
            <Col>
              <Form.Group controlId="playingTeam">
                <Form.Label>
                  <span className="lead">Playing Team</span>
                </Form.Label>
                <MultiSelect
                  options={MatchFilterPoints.teams}
                  selected={filters.playingTeam}
                  onChange={onFilterChange("playingTeam")}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="winningTeam">
                <Form.Label>
                  <span className="lead"> Winning Team</span>
                </Form.Label>
                <MultiSelect
                  options={MatchFilterPoints.teams}
                  selected={filters.winnerTeam}
                  onChange={onFilterChange("winnerTeam")}
                />
              </Form.Group>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <Form.Group controlId="toss">
                <Form.Label>
                  <span className="lead">Toss Decision</span>
                </Form.Label>
                <MultiSelect
                  options={MatchFilterPoints.tossDecision}
                  selected={filters.tossDecision}
                  onChange={onFilterChange("tossDecision")}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="umpire">
                <Form.Label>
                  <span className="lead">Umpires</span>
                </Form.Label>
                <MultiSelect
                  options={MatchFilterPoints.umpires}
                  selected={filters.umpire}
                  onChange={onFilterChange("umpire")}
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

export default MatchFilterDialog;
