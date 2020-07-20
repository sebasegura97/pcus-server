const { Model } = require("sequelize");

// Este modelo cuenta con un campo para cada requisito que debe ser ingresado por el proponente. Tambien contempla el estado actual
// del tramite.

export default (sequelize, DataTypes) => {
  class Notification extends Model {}
  Notification.init(
    {
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      reason: DataTypes.STRING,
      readed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      paranoid: true
    }
  );

  Notification.associate = models => {
    Notification.belongsTo(models.User, {
      foreignKey: "receiverId"
    });
    Notification.belongsTo(models.User, {
      foreignKey: "senderId"
    });
  };

  return Notification;
};
