import bcrypt from "bcryptjs";
import { IllegalArgumentError } from "./errors";
import crypto from "crypto";

const BCRYPT_PATTERN = new RegExp(/\$2([ayb])?\$(\d\d)\$[.\/0-9A-Za-z]{53}/);

class BcryptPasswordEncoder {
  encode(rawPassword) {
    return bcrypt.hashSync(rawPassword);
  }

  matches(rawPassword, encodedPassword) {
    if (!rawPassword) {
      throw new IllegalArgumentError("rawPassword can not be null");
    }

    if (!encodedPassword || encodedPassword.length === 0) {
      console.log("Empty encoded password");
      return false;
    }

    if (!BCRYPT_PATTERN.test(encodedPassword)) {
      console.log("Encoded password does not look like BCrypt");
      return false;
    }

    return bcrypt.compareSync(rawPassword, encodedPassword);
  }
}

const generateHash = (rawString = "") => {
  return crypto.createHash("sha256").update(rawString).digest("hex");
};

const generateSecureRandomKey = (hash = false) => {
  const randomString = crypto.randomBytes(32).toString("hex");
  if (!hash) {
    return randomString;
  }
  return crypto.createHash("sha256").update(randomString).digest("hex");
};

export { BcryptPasswordEncoder, generateHash, generateSecureRandomKey };
