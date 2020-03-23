import jwt from "jsonwebtoken";
import _ from "lodash";
import bcrypt from "bcrypt";

export const createTokens = async (user, secret, secret2) => {

  const createToken = jwt.sign(
    {
      user: _.pick(user, ["id", "username"])
    },
    secret,
    {
      expiresIn: "8h",
    }
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, "id")
    },
    secret2,
    {
      expiresIn: "7d"
    }
  );

  return [createToken, createRefreshToken];
};

export const refreshTokens = async (
  token,
  refreshToken,
  models,
  SECRET,
  SECRET2
) => {
  let userId = 0;

  try {
    const {
      user: { id }
    } = jwt.decode(refreshToken);
    userId = id;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await models.User.findByPk(userId);
  if (!user) {
    return {};
  }

  const refreshSecret = user.password + SECRET2;

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(
    user,
    SECRET,
    refreshSecret
  );
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user
  };
};

export const tryLogin = async (email, password, models, SECRET, SECRET2) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    // user with provided email not found
    return {
      ok: false,
      errors: [{ path: "email", message: "Wrong email" }]
    };
  }
  console.log("password", password);
  console.log("user.password", user.password);
  const valid = await bcrypt.compare(password, user.password);
  console.log("valid", valid);
  if (!valid) {
    // bad password
    return {
      ok: false,
      errors: [{ path: "password", message: "Wrong password" }]
    };
  }

  const refreshTokenSecret = user.password + SECRET2;
  // console.log("refresTokenSecret - authentication.js - 97", refreshTokenSecret);

  const [token, refreshToken] = await createTokens(
    user,
    SECRET,
    refreshTokenSecret
  );

  return {
    ok: true,
    user,
    token,
    refreshToken
  };
};

// Middlewares para protejer resolvers 
export const authenticated = next => (root, args, context, info) => {
  if (!context.user) {
    throw new Error(`Unauthenticated!`);
  }

  return next(root, args, context, info);
};
