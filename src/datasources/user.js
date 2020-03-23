import formatErrors from "../utils/formatErrors"
const { DataSource } = require("apollo-datasource");
import bcrypt from "bcrypt"

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async create(args) {
    try {
      const user = await this.store.User.create(args);
      return {
        ok: true,
        user
      };
    } catch (err) {
      return {
        ok: false,
        errors: formatErrors(err, this.store)
      };
    }
  }

  async update({userId, update}) {
    try {
      const user = await this.store.User.findOne({ where: { id: userId } });
      await user.update(update);
      return {
        user, 
        ok: true,
        message: "Usuario actualizado correctamente"
      };
    } catch (error) {
      console.log("error", error);
      return {
        ok: false,
        message: error.message
      }
    }
  }

  async delete({ userId }) {
    try {
      await this.store.User.destroy({ where: { id: userId } });
      return userId;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = UserAPI;
