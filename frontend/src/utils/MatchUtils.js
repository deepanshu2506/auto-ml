import querystring from "querystring";

export const getPlayingTeamMatchesUrl = (teamName) =>
  `/matches?${querystring.stringify({ playingTeam: teamName })}`;
