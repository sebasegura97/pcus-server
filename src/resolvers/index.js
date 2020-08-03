import { resolver as root } from "./root";
import { resolver as auth } from "./auth";
import { resolver as procedure } from "./procedure";
import { resolver as statistics } from "./statistics";
import { merge } from "lodash";

const resolver = merge(
  root,
  auth,
  statistics,
  procedure
);

module.exports = resolver;
