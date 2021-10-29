import { useState } from "react";
import { Container, Row } from "react-bootstrap";
import PlayerRepository from "../../../data/PlayerRepository";
import { PlayerFilterBox } from "../../Content/FilterBox/FilterBox";
import InfiniteScrollTable from "../../Content/Table/InfiniteScrollTable";
import "./styles.scss";
const PlayerScreen = (props) => {
  const playerHeaders = PlayerRepository.getKeys();
  const [PlayersPaginator, setPlayersPaginator] = useState(
    PlayerRepository.getAll()
  );
  const renderRow = (player) => [
    player.Player_Name,
    player.DOB,
    player.Batting_Hand,
    player.Bowling_Skill,
    player.Country,
  ];
  return (
    <Container className="screen playerScreen pt-3 pl-4 " fluid>
      <Row>
        <PlayerFilterBox setFilteredData={setPlayersPaginator} />
      </Row>
      <Row>
        <span className="row-count">{`${PlayersPaginator.length} entries`}</span>
      </Row>
      <InfiniteScrollTable
        dataPaginator={PlayersPaginator}
        keyExtractor={(_, idx) => idx}
        headerCols={playerHeaders}
        renderRow={renderRow}
        renderEmpty={(props) => <p>No Players match your search</p>}
      />
    </Container>
  );
};

export default PlayerScreen;
