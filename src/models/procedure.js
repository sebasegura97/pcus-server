const { Model } = require("sequelize");

// Este modelo cuenta con un campo para cada requisito que debe ser ingresado por el proponente. Tambien contempla el estado actual
// del tramite.

export default (sequelize, DataTypes) => {
  class Procedure extends Model {}
  Procedure.init(
    {
      // REQUISITOS JURÍDICOS son requeridos para iniciar el tramite todos los requisitos juridicos.
      
      numeroDeExpediente: DataTypes.STRING,
      calidadDelProponente: DataTypes.ENUM(
        "PERSONA HUMANA",
        "PERSONA JURIDICA",
        "COMUNIDAD INDIGENA"
      ),
      condicionJuridicaDelInmueble: DataTypes.STRING,
      denominacion: DataTypes.STRING,
      razonSocial: DataTypes.STRING,
      nombreProponente: DataTypes.STRING,
      apellidoProponente: DataTypes.STRING,
      constanciaDeCUITProponente: DataTypes.STRING,
      tipoDeDocumentoProponente: DataTypes.STRING,
      numeroDeDocumentoProponente: DataTypes.STRING,
      domicilioRealProponente: DataTypes.STRING,
      domicilioLegalProponente: DataTypes.STRING,
      nombreTRP: DataTypes.STRING,
      apellidoTRP: DataTypes.STRING,
      tipoDeDocumentoTRP: DataTypes.STRING,
      numeroDeDocumentoTRP: DataTypes.STRING,
      constanciaDeMatriculaTRP: DataTypes.STRING,
      numeroDeCatastro: DataTypes.STRING,
      domicilioProyecto: DataTypes.STRING,
      planoDeMensura: DataTypes.STRING,

      // REQUISITOS TECNICOS todos pueden ser nulos e irse agregando en futuras ediciones.

      superficiePCUS: DataTypes.FLOAT,
      declaracionJuradaAptitudAmbiental: DataTypes.STRING,
      PCUS: DataTypes.STRING,
      cartografia: DataTypes.STRING,
      estudioDeImpactoSocioAmbiental: DataTypes.STRING,

      // OTROS ATRIBUTOS:
      fechaDeAprobacion: DataTypes.DATE,
      fechaDeRechazo: DataTypes.DATE,
      estado: {
        type: DataTypes.ENUM(
          "ESPERANDO REVISION", // Del personal de control juridico o tecnico
          "ESPERANDO CORRECCION", // Por parte del usuario
          "APROBADO",
          "RECHAZADO"
        ),
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
    }
  );

  Procedure.associate = (models) => {
    Procedure.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };

  return Procedure;
};
