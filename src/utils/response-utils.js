const toError = (e, errCode, message) => {
  let error = {
    status: "failed",
    code: "ERR_500",
    message: "Something went wrong!",
  };

  if (e) {
    const errorMessage = `${message}. Reason: ${e.detail || JSON.stringify(e)}`;
    const code = errCode || error.code;
    error = { ...error, code, message: errorMessage };
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
    favourite_positions,
    created_at,
    updated_at,
  } = player;

  _player.playerId = player_id;
  _player.name = name;
  _player.photoUrl = null;
  _player.shirtNo = shirt_no;
  _player.team = { id: team_id, name: team_name };
  _player.additionalInfo = {
    age,
    height,
    weight,
    power,
    speed,
    favouritePositions: favourite_positions,
  };
  _player.audit = { createdAt: created_at, updatedAt: updated_at };
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
  _team.audit = { createdAt: created_at, updatedAt: updated_at };
  return _team;
};

export { toError, toPlayer, toTeam };
