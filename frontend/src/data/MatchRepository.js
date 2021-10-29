import matches from "./db/matches";
import Paginator from "./Paginator";
import Repository from "./Repository";
import stats from "./db/teamWiseHomeAndAway";
class MatchRepository extends Repository {
  constructor(matches) {
    super();
    this.matches = matches;
  }

  getKeys() {
    return [
      "season",
      "venue",
      "home team",
      "away team",
      "toss decision",
      "winner",
      "win margin",
      "umpire 1",
      "umpire 2",
    ];
  }

  getAll() {
    return new Paginator(this.matches);
  }

  filter(filters) {
    const filterFunction = filters.playingTeam
      ? (match) =>
          filters.playingTeam.includes(match.team1) ||
          filters.playingTeam.includes(match.team2)
      : () => Math.random() > 0.5;
    const filteredPlayers = this.matches.filter(filterFunction);
    return new Paginator(filteredPlayers);
  }

  formatFilterLabels(filters) {
    return Object.keys(filters)
      .map((key) => {
        switch (key) {
          case "season":
          case "venue":
          case "playingTeam":
          case "tossDecision":
          case "winnerTeam":
          case "umpire":
            return filters[key].length > 0
              ? {
                  key,
                  label: (
                    <span>
                      <b>{key} : </b>
                      {typeof filters[key] === "string"
                        ? filters[key]
                        : filters[key].join(", ")}
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
    let filterPoints = {};
    points.forEach((point) => {
      filterPoints[point] = new Set();
    });
    filterPoints.umpires = new Set();
    this.matches.forEach((match) => {
      points.forEach((point) => {
        if (match[point] && match[point] !== "")
          filterPoints[point].add(match[point]);
      });
      filterPoints.umpires.add(match.umpire1);
      filterPoints.umpires.add(match.umpire2);
    });
    filterPoints.teams = Object.keys(stats);

    Object.keys(filterPoints).forEach((key) => {
      filterPoints[key] = Array.from(filterPoints[key]);
    });
    return filterPoints;
  }
}

export default new MatchRepository(matches);
