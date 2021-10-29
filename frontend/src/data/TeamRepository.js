import Paginator from "./Paginator";
import Repository from "./Repository";
import Teams from "./db/teamWiseHomeAndAway";
class TeamsRepository extends Repository {
  constructor(teams) {
    super();
    this.teamNames = Object.keys(teams);
    this.teamObjects = Object.values(teams);
  }

  getKeys() {
    return [
      "",
      "TEAM",
      "HOME WINS",
      "AWAY WINS",
      "HOME MATCHES",
      "AWAY MATCHES",
      "HOME WIN %",
      "AWAY WIN %",
    ];
  }
  getAll() {
    return new Paginator(this.teamObjects);
  }

  formatFilterLabels(filters) {
    return Object.keys(filters)
      .map((key) => {
        const { min, max } = filters[key];
        if (min > 0 || max) {
          const label = `(${min}-${max || "max"})`;
          return {
            key,
            label: (
              <span>
                <b>{key} : </b>
                {label}
              </span>
            ),
          };
        } else {
          return null;
        }
      })
      .filter((item) => item !== null);
  }
  getFilterPoints() {
    return {
      homeMatchWins: {
        min: 0,
        max: Math.max(...this.teamObjects.map((team) => team.home_win), 0),
      },
      awayMatchWins: {
        min: 0,
        max: Math.max(...this.teamObjects.map((team) => team.away_win), 0),
      },
      homeMatches: {
        min: 0,
        max: Math.max(...this.teamObjects.map((team) => team.home_matches), 0),
      },
      awayMatches: {
        min: 0,
        max: Math.max(...this.teamObjects.map((team) => team.away_matches), 0),
      },
      homeWinPer: {
        min: 0,
        max: Math.max(
          ...this.teamObjects.map((team) =>
            Number(team.home_win_percentage).toFixed(2)
          ),
          0
        ),
      },
      awayWinPer: {
        min: 0,
        max: Math.max(
          ...this.teamObjects.map((team) =>
            Number(team.away_win_percentage).toFixed(2)
          ),
          0
        ),
      },
    };
  }
  filter() {
    return new Paginator(this.teamObjects);
  }
}

export default new TeamsRepository(Teams);
