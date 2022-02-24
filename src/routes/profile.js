import { Router } from "express";
import { playerAuthorize } from "./authorization";
import PlayerService from "../services/player-service";
import TeamsService from "../services/teams-service";
import { toPlayer, toTeam, toError } from "../utils/response-utils";

const router = Router();

const teamsService = new TeamsService();
const playerService = new PlayerService();

const getProfile = async (req, res) => {
  try {
    const user = req.user;

    const playerResp = await playerService.getCurrentPlayer(user.username);
    const player = toPlayer(playerResp);

    const playerTeam = player.team;

    if (!playerTeam) {
      res
        .status(200)
        .json({ status: "success", data: { user, player, team: null } });
      return;
    }

    const teamResp = await teamsService.getTeam();
    const team = toTeam(teamResp);

    res.status(200).json({ status: "success", data: { user, player, team } });
  } catch (e) {
    console.error(e);
    res.status(500).json(toError(e));
  }
};

router.get("/vbms/api/v1/profile", playerAuthorize, getProfile);

export default router;
