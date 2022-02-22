import { Router } from "express";
import { playerAuthorize } from "./authorization";
import PlayerService from "../services/player-service";
import TeamsService from "../services/teams-service";
import { toPlayer, toTeam } from "../utils/response-utils";

const router = Router();

const teamsService = new TeamsService();
const playerService = new PlayerService();

const getProfile = async (req, res) => {
  try {
    const user = req.user;
    const player = toPlayer(
      await playerService.getCurrentPlayer(user.username)
    );
    const team = toTeam(await teamsService.getTeam(player.team.id));
    res.status(200).json({ status: "success", data: { user, player, team } });
  } catch (e) {
    console.error(e);
    res.status(500).json(toError(e));
  }
};

router.get("/vbms/api/v1/profile", playerAuthorize, getProfile);

export default router;
