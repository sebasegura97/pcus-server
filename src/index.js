import "@babel/polyfill";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import jwt from "jsonwebtoken";
import moment from "moment-timezone";
import models from "./models";
import resolvers from "./resolvers";
import typeDefs from "./schema";
import { refreshTokens } from "./utils/authentication";
import UserAPI from "./datasources/user";

require("dotenv").config();
moment.tz.setDefault("-03:00");

const SECRET = process.env.AUTH_TOKEN_SECRET;
const SECRET2 = process.env.AUTH_TOKEN_SECRET_2;

// set up any dataSources our resolvers need
const dataSources = () => ({
  models,
  userAPI: new UserAPI({ store: models })
});

// the function that sets up the global context for each resolver, using the req
const context = async ({ req, res, next }) => {
  let user = null;
  let token = null;

  try {
    token = req.headers["x-token"];
  } catch (error) {
    console.log("line 33", error);
  }
  if (token) {
    try {
      const verifiedToken = jwt.verify(token, SECRET);
      user = verifiedToken.user;
    } catch (err) {
      const refreshToken = req.headers["x-refresh-token"];
      const newTokens = await refreshTokens(
        token,
        refreshToken,
        models,
        SECRET,
        SECRET2
      );
      if (newTokens.token && newTokens.refreshToken) {
        res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token");
        res.set("x-token", newTokens.token);
        res.set("x-refresh-token", newTokens.refreshToken);
      }
      user = newTokens.user;
    }
  }
  if (user && user.id) {
    try {
      user = await models.User.findByPk(user.id);
      user = user.dataValues;
    } catch (error) {}
  }
  return {
    user,
    SECRET,
    SECRET2
  };
};

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  cors: {
    origin: "*",
    credentials: true
  },
  context,
});

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test.
const app = express();
server.applyMiddleware({ app, path: "/", cors: true });

if (process.env.NODE_ENV !== "test")
  app.listen(4000, () => console.log(`App running at port 4000`));
// .then(({ url }) => console.log(`🚀 app running at ${url}`));

exports.app = app;
