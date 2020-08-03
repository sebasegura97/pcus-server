const { DataSource } = require("apollo-datasource");
import {
  createResetPasswordToken,
  getPasswordResetURL,
} from "../utils/authentication";
import { resetPasswordTemplate, transporter } from "../utils/email";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
        user,
      };
    } catch (err) {
      console.log(err);
      if ((err.errno = 1062)) {
        return {
          ok: false,
          message: "Ya existe un usuario registrado con este email",
        };
      } else {
        return {
          ok: false,
          message: err.message,
        };
      }
    }
  }

  async changeRole({ userId, newRole }) {
    try {
      const user = await this.store.User.findByPk(userId);
      user.role = newRole;
      await user.save();
      return {
        ok: true,
        message: `Se ha actualizado el rol del usuario ${user.name} ${user.lastname} a ${newRole}`,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message ? error.message : error,
      };
    }
  }

  async update({ userId, update }) {
    try {
      const user = await this.store.User.findOne({ where: { id: userId } });
      await user.update(update);
      return {
        user,
        ok: true,
        message: "Usuario actualizado correctamente",
      };
    } catch (error) {
      console.log("error", error);
      return {
        ok: false,
        message: error.message,
      };
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

  async sendChangePasswordEmail({ email }) {
    let user;
    try {
      user = await this.store.User.findOne({ where: { email } });
      const token = createResetPasswordToken(user);
      const url = getPasswordResetURL(user, token);
      const template = resetPasswordTemplate(user, url);
      await transporter.sendMail(template);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async changeUserPassword({ userId, token, newPassword }) {
    try {
      const user = await this.store.User.findByPk(userId);
      const secret = user.password + "-" + user.createdAt;
      const payload = jwt.decode(token, secret);
      if (payload.userId === user.id) {
        const hash = await bcrypt.hash(newPassword, 12);
        user.update({ password: hash });
        return true;
      } else {
        throw new Error("El token no corresponde al usuario.");
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }
}

module.exports = UserAPI;
