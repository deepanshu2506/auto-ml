import Avatar from "react-avatar";
import PlayerScreen from "../Screens/PlayersScreen/Screen";
import MatchScreen from "../Screens/MatchScreen/Screen";
import TeamScreen from "../Screens/TeamScreen/Screen";
import VenueScreen from "../Screens/Venues/Screen";

const routes = [
  {
    title: "teams",
    path: "/teams",
    exact: true,
    Icon: () => <Avatar src="/teams-icon.png" round={true} size={35} />,
    component: TeamScreen,
  },
  {
    title: "Players",
    path: "/players",
    exact: true,
    Icon: () => <Avatar src="/player-icon.svg" round={true} size={35} />,
    component: PlayerScreen,
  },

  {
    title: "matches",
    path: "/matches",
    Icon: () => <Avatar src="/bats-man.svg" round={true} size={35} />,

    component: MatchScreen,
  },
  {
    title: "venues",
    path: "/venues",
    Icon: () => <Avatar src="/venue-icon.svg" round={true} size={35} />,

    component: VenueScreen,
  },
];

export default routes;
