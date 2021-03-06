import { Router } from "express";
import AuthenticationService from "../services/authentication-service";
import { toError } from "../utils/response-utils";
import { commonAuthorize, refreshTokenAuthorize } from "./authorization";

const authenticationService = new AuthenticationService();
const router = Router();

const signin = async (req, res) => {
  try {
    const authentication = await authenticationService.authenticate(req.body);

    if (authentication.status === "failed") {
      if (authentication.code === "AUTH_401") {
        res.status(401).json(authentication);
      } else if (authentication.code === "AUTH_403") {
        res.status(403).json(authentication);
      }
    } else {
      res.status(200).json(authentication);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json(toError(e));
  }
};

const signout = async (req, res) => {
  try {
    const jwtToken = req.authentication;
    const user = req.user;

    const response = await authenticationService.logout(user, jwtToken);
    res.status(200).json(response);
  } catch (e) {
    console.error(e);
    res.status(500).json(toError(e));
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const username = req["username"];
    const data = await authenticationService.refreshToken({
      refreshToken,
      username,
    });
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json(toError(e));
  }
};

router.post("/vbms/auth/signin", signin);
router.post("/vbms/auth/refresh", refreshTokenAuthorize, refreshToken);
router.post("/vbms/auth/signout", commonAuthorize, signout);

export default router;
