import { Router } from "express";
import AuthenticationService from "../services/authentication-service";
import { clearCookies, toError } from "../utils/response-utils";
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
      const { refreshToken, ...other } = authentication.data;
      res
        .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
          expiresIn: new Date(
            Date.now() + process.env.REFRESH_TOKEN_COOKIE_EXPIRY
          ),
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
        })
        .status(200)
        .json({ status: authentication.status, data: { ...other } });
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

    clearCookies(req, res, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    res.status(200).json(response);
  } catch (e) {
    console.error(e);
    res.status(500).json(toError(e));
  }
};

const refreshToken = async (req, res) => {
  try {
    const username = req["username"];

    const authentication = await authenticationService.refreshToken({
      refreshToken: req.cookies["refresh_token"],
      username,
    });
    const { refreshToken, ...other } = authentication.data;
    res
      .cookie("refresh_token", authentication.data.refreshToken, {
        expiresIn: new Date(
          Date.now() + process.env.REFRESH_TOKEN_COOKIE_EXPIRY
        ),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      })
      .status(200)
      .json({ status: authentication.status, data: { ...other } });
  } catch (e) {
    console.error(e);
    res.status(500).json(toError(e));
  }
};

router.post("/vbms/auth/signin", signin);
router.post("/vbms/auth/refresh", refreshTokenAuthorize, refreshToken);
router.post("/vbms/auth/signout", commonAuthorize, signout);

export default router;
