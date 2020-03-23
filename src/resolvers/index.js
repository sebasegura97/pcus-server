import { resolver as root } from "./root";
import { resolver as user } from "./user";
import { resolver as auth } from "./auth";
import { merge } from "lodash";

const resolver = merge(
  root,
  user,
  auth
);

module.exports = resolver;
