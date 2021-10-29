import { useState } from "react";
import { Container, Image, Row } from "react-bootstrap";
import { useHistory } from "react-router";
import TeamRepository from "../../../data/TeamRepository";
import { TeamFilterBox } from "../../Content/FilterBox/FilterBox";
import InfiniteScrollTable from "../../Content/Table/InfiniteScrollTable";
import { getPlayingTeamMatchesUrl } from "../../../utils/MatchUtils";
import "./styles.scss";
const TeamsScreen = (props) => {
  const history = useHistory();
  const TeamHeaders = TeamRepository.getKeys();
  const [TeamsPaginator, setTeamsPaginator] = useState(TeamRepository.getAll());
  const renderRow = (team) => [
    <Image className="avatar" src={team.avatar} />,
    team.team,
    team.home_wins,
    team.away_wins,
    team.home_matches,
    team.away_matches,
    (Number(team.home_win_percentage) || 0).toFixed(2),
    (Number(team.away_win_percentage) || 0).toFixed(2),
  ];

  return (
    <Container className="screen teamScreen pt-3 pl-4" fluid>
      <Row>
        <TeamFilterBox setFilteredData={setTeamsPaginator} />
      </Row>
      <Row>
        <span className="row-count">{`${TeamsPaginator.length} entries`}</span>
      </Row>
      <InfiniteScrollTable
        dataPaginator={TeamsPaginator}
        keyExtractor={(_, idx) => idx}
        headerCols={TeamHeaders}
        renderRow={renderRow}
        onRowClick={(team) => history.push(getPlayingTeamMatchesUrl(team.team))}
        renderEmpty={(props) => <p>No Teams match your search</p>}
      />
    </Container>
  );
};

export default TeamsScreen;
