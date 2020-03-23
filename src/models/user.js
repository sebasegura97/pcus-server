import bcrypt from "bcrypt";
const { Model } = require("sequelize");

export default (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "Invalid email"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [5, 100],
            msg: "The password needs to be between 5 and 100 characters long"
          }
        }
      },
      role: {
        type: DataTypes.ENUM([
          "PROPONENTE",
          "ADMINISTRADOR",
          "CONTROL_JURIDICO",
          "CONTROL_TECNICO"
        ])
      }
    },
    {
      sequelize,
      paranoid: true
    }
  );

  User.beforeCreate(async user => {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
  });

  User.beforeUpdate(async user => {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
  });

  if (process.env.NODE_ENV === "production") {
    sequelize.transaction(function(t) {
      return User.findOrCreate({
        where: {
          email: "administrador@pcus.com"
        },
        defaults: {
          name: "Administrador",
          lastname: "Del Sistema",
          role: "ADMINISTRADOR",
          password: "123456789",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    });
  } else {
    sequelize.transaction(function(t) {
      return User.findOrCreate({
        where: {
          email: "administrador@pcus.com"
        },
        defaults: {
          name: "Administrador",
          lastname: "Del Sistema",
          role: "ADMINISTRADOR",
          password: "123456789",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    });

    sequelize.transaction(function(t) {
      return User.findOrCreate({
        where: {
          email: "proponente@pcus.com"
        },
        defaults: {
          name: "Proponente",
          lastname: "De prueba",
          role: "PROPONENTE",
          password: "123456789",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    });

    sequelize.transaction(function(t) {
      return User.findOrCreate({
        where: {
          email: "control_tecnico@pcus.com"
        },
        defaults: {
          name: "Control tecnico",
          lastname: "De prueba",
          role: "CONTROL_TECNICO",
          password: "123456789",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    });

    sequelize.transaction(function(t) {
      return User.findOrCreate({
        where: {
          email: "control_juridico@pcus.com"
        },
        defaults: {
          name: "Control jurídico",
          lastname: "De prueba",
          role: "CONTROL_JURIDICO",
          password: "123456789",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    });
  }

  return User;
};
