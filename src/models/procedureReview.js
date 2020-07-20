const { Model } = require("sequelize");
import {
  transporter,
  getPasswordResetURL,
  newReviewNotificationTemplate,
} from "../utils/email";
// Este modelo cuenta con un campo para cada requisito que debe ser ingresado por el proponente. Tambien contempla el estado actual
// del tramite.

export default (sequelize, DataTypes) => {
  class ProcedureReview extends Model {}
  ProcedureReview.init(
    {
      requisitosFisicos: DataTypes.BOOLEAN,
      requisitosJuridicos: DataTypes.BOOLEAN,
      requisitosTecnicos: DataTypes.BOOLEAN,
      constanciaDeCuit: DataTypes.BOOLEAN,
      constanciaDeMatricula: DataTypes.BOOLEAN,
      planoDeMensura: DataTypes.BOOLEAN,
      formularioPCUS: DataTypes.BOOLEAN,
      declaracionJuradaAptitudAmbiental: DataTypes.BOOLEAN,
      PCUS: DataTypes.BOOLEAN,
      cartografia: DataTypes.BOOLEAN,
      estudioImpactoAmbiental: DataTypes.BOOLEAN,
      rechazado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      comentarios: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
    },
    {
      sequelize,
      paranoid: true,
    }
  );

  ProcedureReview.associate = (models) => {
    ProcedureReview.belongsTo(models.User, {
      foreignKey: "userId",
    });
    ProcedureReview.belongsTo(models.Procedure, {
      foreignKey: "procedureId",
    });
  };

  ProcedureReview.beforeUpdate(async (values) => {
    values = await calculateRequirements(values);
  });

  ProcedureReview.beforeCreate(async (values) => {
    values = await calculateRequirements(values);
  });

  ProcedureReview.afterCreate(async (values) => {
    await notificate(values);
  });

  ProcedureReview.afterUpdate(async (values) => {
    await notificate(values);
  });

  async function calculateRequirements(values) {
    var {
      constanciaDeCuit,
      constanciaDeMatricula,
      planoDeMensura,
      formularioPCUS,
      declaracionJuradaAptitudAmbiental,
      PCUS,
      cartografia,
      estudioImpactoAmbiental,
      procedureId,
    } = values.dataValues;
    const { dataValues: procedure } = await sequelize.models.Procedure.findByPk(
      procedureId
    );
    // Requisitos juridicos. Dependen de la calidad del proponente.
    // Constancia de matricula y plano de mensura son siempre requeridos.
    let requisitosJuridicos = constanciaDeMatricula && planoDeMensura;
    if (procedure.calidadDelProponente === "PERSONA HUMANA") {
      // Y si es persona humana, ademas necesitamos la constancia de cuit
      requisitosJuridicos = requisitosJuridicos && constanciaDeCuit;
    }
    values.requisitosJuridicos = requisitosJuridicos;
    // Requisitos tecnicos: Dependen de la superficie del PCUS.
    // La declaracion jurada es requerida en todos los casos
    let requisitosTecnicos = declaracionJuradaAptitudAmbiental;
    if (procedure.superficiePCUS <= 10) {
      requisitosTecnicos = requisitosTecnicos && formularioPCUS;
    } else if (procedure.superficiePCUS <= 300) {
      requisitosTecnicos = requisitosTecnicos && PCUS && cartografia;
    } else if (procedure.superficiePCUS > 300) {
      requisitosTecnicos =
        requisitosTecnicos && PCUS && cartografia && estudioImpactoAmbiental;
    }
    values.requisitosTecnicos = requisitosTecnicos;
    return values;
  }

  async function notificate(values) {
    // Notificamos al usuario y actualizamos el estado del procedimiento segun corresponda
    const {
      requisitosFisicos,
      requisitosJuridicos,
      requisitosTecnicos,
      rechazado,
      comentarios,
      userId: senderId,
      procedureId,
    } = values.dataValues;
    const procedure = await sequelize.models.Procedure.findByPk(procedureId);
    const receiverId = procedure.dataValues.userId;
    const receiver = await sequelize.models.User.findByPk(receiverId);
    var reason;

    // Actualizamos el estado del procedimiento despues de crear una revision:
    if (requisitosFisicos && requisitosJuridicos && requisitosTecnicos) {
      reason = `Su procedimiento ha sido aprobado.`;
      procedure.estado = "APROBADO";
      procedure.fechaDeAprobacion = Date.now();
    } else if (rechazado) {
      reason = `Se ha rechazado su procedimiento para plan de cambio de uso de suelo Nº. ${procedureId}`;
      procedure.estado = "RECHAZADO";
      procedure.fechaRechazo = Date.now();
    } else {
      reason = `Se ha realizado una revision del procedimiento Nº. ${procedureId}. Por favor ingrese al sistema para ver el estado completo de su procedimiento.`;
      procedure.estado = "ESPERANDO CORRECCION";
    }

    try {
      await procedure.save();
    } catch (error) {
      console.log(error);
    }

    // Notificacion via mail y sistema:
    const template = newReviewNotificationTemplate({
      user: receiver,
      procedure,
      message: reason,
    });

    try {
      await transporter.sendMail(template);
      await sequelize.models.Notification.create({
        senderId,
        receiverId,
        message: comentarios ? comentarios : "",
        reason,
      });
      console.log("Notificacion enviada por mail y por sistema");
    } catch (error) {
      console.log(error);
    }
  }
  return ProcedureReview;
};
