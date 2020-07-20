// import { typeDefs as User } from "./user"
import { typeDefs as root } from "./root";
import { typeDefs as auth } from "./auth";
import { typeDefs as procedure } from "./procedure";
import { typeDefs as statistics } from "./statistics";

const typeDefs = [
  root,
  auth,
  procedure,
  statistics
];

export default typeDefs;
