import { tryLogin, authenticated } from "../utils/authentication";
import { validateRole } from "../utils/authorization";

export const resolver = {
  Mutation: {
    login: (parent, { email, password }, { dataSources, SECRET, SECRET2 }) =>
      tryLogin(email, password, dataSources.models, SECRET, SECRET2),

    register: authenticated(
      // Solo los gerentes pueden crear un nuevo usuario
      validateRole("GERENTE")((root, args, { dataSources }) =>
        dataSources.userAPI.create(args)
      )
    )
  }
};
