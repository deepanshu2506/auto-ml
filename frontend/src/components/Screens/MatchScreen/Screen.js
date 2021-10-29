import { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import MatchRepository from "../../../data/MatchRepository";
import { getPlayingTeamMatchesUrl } from "../../../utils/MatchUtils";
import { MatchFilterBox } from "../../Content/FilterBox/FilterBox";
import InfiniteScrollTable from "../../Content/Table/InfiniteScrollTable";
import "./styles.scss";

const MatchScreen = (props) => {
  const matchHeaders = MatchRepository.getKeys();
  const [MatchesPaginator, setMatchesPaginator] = useState(
    MatchRepository.getAll()
  );
  const renderRow = (match) => [
    match.season,
    match.Venue,
    <Link to={getPlayingTeamMatchesUrl(match.team1)}>{match.team1}</Link>,
    <Link to={getPlayingTeamMatchesUrl(match.team2)}>{match.team2}</Link>,
    match.tossDecision,
    match.winner,
    match.winMargin,
    match.umpire1,
    match.umpire2,
  ];

  return (
    <Container className="screen matchscreen  pt-3 pl-4 " fluid>
      <Row>
        <MatchFilterBox setFilteredData={setMatchesPaginator} />
      </Row>
      <Row>
        <span className="row-count">{`${MatchesPaginator.length} entries`}</span>
      </Row>
      <InfiniteScrollTable
        dataPaginator={MatchesPaginator}
        keyExtractor={(match, idx) => match.id}
        headerCols={matchHeaders}
        renderRow={renderRow}
        renderEmpty={(props) => <p>No Games match your search</p>}
      />
    </Container>
  );
};

export default MatchScreen;
