import { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useHistory } from "react-router";
import querystring from "querystring";
import { VenuesFilterBox } from "../../Content/FilterBox/FilterBox";
import "./styles.scss";
import InfiniteScrollTable from "../../Content/Table/InfiniteScrollTable";
import VenuesRepository from "../../../data/VenuesRepository";
const VenueScreen = (props) => {
  const history = useHistory();
  const VenueHeaders = VenuesRepository.getKeys();
  const [VenuesPaginator, setVenuesPaginator] = useState(
    VenuesRepository.getAll()
  );
  const renderRow = (venue) => [venue.venue, venue.city, venue.matchesPlayed];

  return (
    <Container className="screen venueScreen pt-3 pl-4 " fluid>
      <Row>
        <VenuesFilterBox setFilteredData={setVenuesPaginator} />
      </Row>
      <Row>
        <span className="row-count">{`${VenuesPaginator.length} entries`}</span>
      </Row>
      <InfiniteScrollTable
        dataPaginator={VenuesPaginator}
        keyExtractor={(_, idx) => idx}
        headerCols={VenueHeaders}
        renderRow={renderRow}
        onRowClick={(venue) =>
          history.push(
            `/matches?${querystring.stringify({
              venue: `${venue.venue}, ${venue.city}`,
            })}`
          )
        }
        renderEmpty={(props) => <p>No Venues match your search</p>}
      />
    </Container>
  );
};

export default VenueScreen;
