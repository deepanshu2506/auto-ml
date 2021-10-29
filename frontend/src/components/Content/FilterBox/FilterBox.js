import { Col, Form, Row, Button } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import { BsFillCaretDownFill, BsFilter, BsSearch } from "react-icons/bs";
import PropTypes from "prop-types";
import { IoCloseOutline } from "react-icons/io5";
import MatchRepository from "../../../data/MatchRepository";
import MatchFilterDialog from "../FilterDialogs/MatchesFilterDialog";
import PlayerFilterDialog from "../FilterDialogs/PlayerFilterDialog";
import PlayerRepository from "../../../data/PlayerRepository";
import Repository from "../../../data/Repository";
import querystring from "querystring";
import TeamFilterDialog from "../FilterDialogs/TeamsFilterDialog";
import TeamRepository from "../../../data/TeamRepository";
import VenueFilterDialog from "../FilterDialogs/VenuesFilterDialog";
import VenuesRepository from "../../../data/VenuesRepository";
import { useLocation } from "react-router";

const FilterLabel = ({ label, removeFilter }) => {
  return (
    <Col md="auto" className="filter-label">
      <span>{label}</span>
      <IoCloseOutline
        onClick={removeFilter}
        className="ml-auto"
        size={20}
        color="#0f6fff"
      />
    </Col>
  );
};

const FilterButton = ({ onClick }) => (
  <Col onClick={onClick} className="text-center filter-button">
    <BsFilter color="#0f6fff" size={25} />
    <span>Filter</span>
    <BsFillCaretDownFill className="mt-1" size={12} />
  </Col>
);

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FilterBox = ({
  FilterDialog,
  dataRepository,
  setFilteredData,
  ...props
}) => {
  const location = useLocation();
  const [showFilterDialog, setShowFiltersDialog] = useState(false);
  const [filters, setFilters] = useState({});
  const [formattedFilters, setFormattedFilters] = useState([]);
  const prevFilters = usePrevious(filters);
  useEffect(() => {
    setFilters(
      location.search ? querystring.parse(location.search.substring(1)) : {}
    );
  }, [location.search]);
  useEffect(() => {
    if (prevFilters !== undefined || Object.keys(filters).length !== 0) {
      setFilteredData(dataRepository.filter(filters));
      const formattedFilters = dataRepository.formatFilterLabels(filters);
      setFormattedFilters(formattedFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);
  function openFiltersDialog() {
    setShowFiltersDialog(true);
  }
  function closeFiltersDialog() {
    setShowFiltersDialog(false);
  }
  function removeFilter(key) {
    return function () {
      console.log(key);
      const newFilters = Object.keys(filters)
        .filter((k) => k !== key)
        .reduce((prev, key) => ({ ...prev, [key]: filters[key] }), {});
      setFilters(newFilters);
    };
  }
  return (
    <React.Fragment>
      <FilterDialog
        show={showFilterDialog}
        handleClose={closeFiltersDialog}
        applyFilters={setFilters}
        existingFilters={filters}
        dataRepository={dataRepository}
      />
      <Col className="filter-box">
        <Row className="search py-2 pl-2 pr-5">
          <Col className="pr-0">
            <Form.Control
              type="text"
              placeholder={`Search for ${props.title}`}
            />
          </Col>
          <Col md={1}>
            <Button block variant="primary">
              <BsSearch size={20} color="white" />
            </Button>
          </Col>
        </Row>
        <Row className="applied-filters">
          {formattedFilters.length > 0 ? (
            formattedFilters.map((filter) => (
              <FilterLabel
                key={filter.key}
                label={filter.label}
                removeFilter={removeFilter(filter.key)}
              />
            ))
          ) : (
            <span className="no-filters">No filters Applied</span>
          )}
        </Row>
        <Row>
          <FilterButton onClick={openFiltersDialog} />
        </Row>
      </Col>
    </React.Fragment>
  );
};

FilterBox.propTypes = {
  FilterDialog: PropTypes.element.isRequired,
  dataRepository: PropTypes.instanceOf(Repository).isRequired,
  setFilteredData: PropTypes.func.isRequired,
  filterQuery: PropTypes.string,
};

export const MatchFilterBox = (props) => (
  <FilterBox
    FilterDialog={MatchFilterDialog}
    dataRepository={MatchRepository}
    title={"Matches"}
    {...props}
  />
);

export const PlayerFilterBox = (props) => (
  <FilterBox
    title={"Players"}
    FilterDialog={PlayerFilterDialog}
    dataRepository={PlayerRepository}
    {...props}
  />
);

export const TeamFilterBox = (props) => (
  <FilterBox
    title={"Teams"}
    FilterDialog={TeamFilterDialog}
    dataRepository={TeamRepository}
    {...props}
  />
);

export const VenuesFilterBox = (props) => (
  <FilterBox
    title="Venues"
    FilterDialog={VenueFilterDialog}
    dataRepository={VenuesRepository}
    {...props}
  />
);
