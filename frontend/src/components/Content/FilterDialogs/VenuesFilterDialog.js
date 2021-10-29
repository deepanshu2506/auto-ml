import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import VenuesRepository from "../../../data/VenuesRepository";
import MultiSelect from "../../MultiSelect/MultiSelect";
import MinMaxFilterInput from "../MinMaxFilter/MinMaxFilter";
import "./styles.scss";
const initFilterState = {
  matchesPlayed: { min: 0, max: undefined },
  city: [],
};

const FilterPoints = VenuesRepository.getFilterPoints(["city"]);

const VenueFilterDialog = ({
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
        <Modal.Title>Filter Venues</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            <Col>
              <MinMaxFilterInput
                label="Matches Played"
                currValues={filters.matchesPlayed}
                range={FilterPoints.matchesPlayed}
                stepSize={1}
                onChange={(values) =>
                  modifyFilters((prev) => ({ ...prev, matchesPlayed: values }))
                }
              />
            </Col>
          </Row>
          <hr className="mt-1 mb-3" />
          <Row>
            <Col>
              <Form.Group controlId="batting-hand">
                <Form.Label>
                  <span className="lead">Venue city</span>
                </Form.Label>

                <MultiSelect
                  options={FilterPoints.city}
                  selected={filters.city}
                  onChange={onFilterChange("city")}
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

export default VenueFilterDialog;
