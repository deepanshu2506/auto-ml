import Players from "./db/players";
import Paginator from "./Paginator";
import Repository from "./Repository";
class PlayersRepository extends Repository {
  constructor(players) {
    super();
    this.players = players;
  }

  getKeys() {
    return ["player name", "dob", "batting hand", "bowling skill", "country"];
  }

  getAll() {
    return new Paginator(this.players);
  }

  filter(filters) {
    const filteredPlayers = this.players.filter(() => Math.random() > 0.5);
    return new Paginator(filteredPlayers);
  }

  formatFilterLabels(filters) {
    return Object.keys(filters)
      .map((key) => {
        switch (key) {
          case "dob":
            if (filters[key].from || filters[key].to) {
              let label = "";
              if (filters[key].from) {
                const start = new Date(filters[key].from)
                  .toISOString()
                  .substring(0, 10);
                label += `From ${start}`;
              }
              if (filters[key].to) {
                const end = new Date(filters[key].to)
                  .toISOString()
                  .substring(0, 10);
                label += ` till ${end}`;
              }

              return {
                key,
                label: (
                  <span>
                    <b>DOB : </b>
                    {label}
                  </span>
                ),
              };
            } else {
              return null;
            }
          case "Batting_Hand":
          case "Bowling_Skill":
          case "Country":
            return filters[key].length > 0
              ? {
                  key,
                  label: (
                    <span>
                      <b>{key} : </b>
                      {filters[key].join(", ")}
                    </span>
                  ),
                }
              : null;
          default:
            return null;
        }
      })
      .filter((item) => item != null);
  }
  getFilterPoints(points) {
    const filterPoints = {};
    points.forEach((point) => {
      filterPoints[point] = new Set();
    });
    this.players.forEach((player) => {
      points.forEach((point) => {
        if (player[point] && player[point] !== "")
          filterPoints[point].add(player[point]);
      });
    });
    Object.keys(filterPoints).forEach((key) => {
      filterPoints[key] = Array.from(filterPoints[key]);
    });
    return filterPoints;
  }
}

export default new PlayersRepository(Players);
