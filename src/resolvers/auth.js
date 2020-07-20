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
        const user = await context.dataSources.models.User.findByPk(
          context.user.id
        );
        return user.dataValues;
      } catch (error) {
        console.log(error);
      }
    }),
    getNotifications: authenticated(async (root, { readed }, context) => {
      var notifications;
      try {
        if (typeof readed === "boolean") {
          notifications = await context.dataSources.models.Notification.findAndCountAll(
            {
              where: { receiverId: context.user.id, readed },
              order: [["createdAt", "desc"]],
            }
          );
        } else {
          notifications = await context.dataSources.models.Notification.findAndCountAll(
            {
              where: { receiverId: context.user.id },
              order: [["createdAt", "desc"]],
            }
          );
        }
        return {
          totalCount: notifications.count,
          notifications: notifications.rows,
        };
      } catch (error) {}
    }),
  },

  Mutation: {
    login: (parent, { email, password }, { dataSources, SECRET, SECRET2 }) =>
      tryLogin(email, password, dataSources.models, SECRET, SECRET2),
    register: (root, args, { dataSources }) => dataSources.userAPI.create(args),
    changeRole: authenticated(
      validateRole(
        "ADMINISTRADOR"
      )((root, { userId, newRole }, { dataSources }) =>
        dataSources.userAPI.changeRole({ userId, newRole })
      )
    ),
    deleteUser: (parent, args, { dataSources }) =>
      dataSources.userAPI.delete(args),
    updateUser: (parent, args, { dataSources }) =>
      dataSources.userAPI.update(args),
    sendChangePasswordEmail: (parent, args, { dataSources }) =>
      dataSources.userAPI.sendChangePasswordEmail(args),
    changeUserPassword: (parent, args, { dataSources }) =>
      dataSources.userAPI.changeUserPassword(args),
    readNotification: authenticated(async (parent, { id }, { dataSources }) => {
      try {
        await dataSources.models.Notification.update(
          { readed: true },
          { where: { id } }
        );
        return true;
      } catch (error) {
        throw new Error(error);
        // return false;
      }
    }),
    
  },
};
