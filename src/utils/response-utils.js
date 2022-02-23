import withLocale from "../config/moment-locale";

const moment = withLocale("en");

const toError = (e, errCode, message) => {
  let error = {
    status: "failed",
    code: "ERR_500",
    message: "Something went wrong!",
    detail: "Internal error",
  };

  if (e) {
    error = {
      status: "failed",
      code: errCode || error.code,
      message: message || error.message,
      detail: e.detail || JSON.stringify(e),
    };
  }
  return error;
};

const toPlayer = (player) => {
  let _player = {};

  if (!player) {
    return _player;
  }

  const {
    player_id,
    team_id,
    team_name,
    name,
    shirt_no,
    age,
    height,
    weight,
    power,
    speed,
    location,
    favourite_positions,
    created_at,
    updated_at,
  } = player;

  const [firstName, lastName] = name.split(" ");

  const initials =
    firstName.substring(0, 1) + "" + (lastName ? lastName.substring(0, 1) : "");

  _player.playerId = player_id;
  _player.name = name;
  _player.initials = initials;
  _player.photoUrl = null;
  _player.shirtNo = shirt_no;
  _player.team = { id: team_id, name: team_name };
  _player.additionalInfo = {
    age,
    height,
    weight,
    power,
    speed,
    location,
    favouritePositions: favourite_positions,
  };
  _player.audit = {
    createdAt: moment(created_at).format("ll"),
    updatedAt: moment(updated_at).format("ll"),
  };
  return _player;
};

const toTeam = (team) => {
  let _team = {};
  if (!team) {
    return _team;
  }
  const { team_id, name, max_players, created_at, updated_at } = team;
  _team.teamId = team_id;
  _team.name = name;
  _team.maxPlayers = max_players;
  _team.audit = {
    createdAt: moment(created_at).format("ll"),
    updatedAt: moment(updated_at).format("ll"),
  };
  return _team;
};

const clearCookies = (req, res, cookieOptions = {}) => {
  [process.env.REFRESH_TOKEN_COOKIE_NAME].forEach((cookie) =>
    res.clearCookie(cookie, cookieOptions)
  );
};
export { toError, toPlayer, toTeam, clearCookies };
