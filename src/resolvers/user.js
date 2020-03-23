import { tryLogin, authenticated } from "../utils/authentication";
import { validateRole } from "../utils/authorization";

export const resolver = {
  Query: {
    getUser: (parent, { userId }, { dataSources }) =>
      dataSources.models.User.findOne({ where: { id: userId } }),
    allUsers: (parent, args, { dataSources }) =>
      dataSources.models.User.findAll(),
    me: authenticated(async (root, args, context) => {
      try {
        const user = await context.dataSources.models.User.findByPk(context.user.id);
        return user.dataValues;
      } catch (error) {
        console.log(error);
      }
    })
  },

  Mutation: {
    deleteUser: (parent, args, { dataSources }) =>
      dataSources.userAPI.delete(args),
    updateUser: (parent, args, { dataSources }) =>
      dataSources.userAPI.update(args)
  }
};
