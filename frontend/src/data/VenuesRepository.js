import venues from "./db/venues";
import Paginator from "./Paginator";
import Repository from "./Repository";

class VenuesRepository extends Repository {
  constructor(venues) {
    super();
    this.venues = venues;
  }

  getAll() {
    return new Paginator(this.venues);
  }
  getKeys() {
    return ["venue", "city", "matches Played"];
  }
  formatFilterLabels(filters) {
    return Object.keys(filters)
      .map((key) => {
        switch (key) {
          case "matchesPlayed":
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
          case "city":
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
    this.venues.forEach((venue) => {
      points.forEach((point) => {
        if (venue[point] && venue[point] !== "")
          filterPoints[point].add(venue[point]);
      });
    });
    Object.keys(filterPoints).forEach((key) => {
      filterPoints[key] = Array.from(filterPoints[key]);
    });
    filterPoints.matchesPlayed = {
      min: 0,
      max: Math.max(...this.venues.map((venue) => venue.matchesPlayed), 0),
    };
    return filterPoints;
  }
  filter() {
    return new Paginator(this.venues.filter((f) => Math.random() > 0.4));
  }
}

export default new VenuesRepository(venues);
