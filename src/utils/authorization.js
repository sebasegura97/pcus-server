// TODO: Para role based auth leer "Getting started with authorization":
// https://medium.com/the-guild/authentication-and-authorization-in-graphql-and-how-graphql-modules-can-help-fadc1ee5b0c2


export const validateRole = role => next => (root, args, context, info) => {
  if (context.user.role !== role) {
    throw new Error(`Unauthorized!`);
  }

  return next(root, args, context, info);
};