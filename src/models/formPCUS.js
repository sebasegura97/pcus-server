const { Model } = require("sequelize");

/**
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('sequelize').QueryInterface} QueryInterface
 * @typedef {import('sequelize').DataTypes} DataTypes
 */

/**
 * @param {QueryInterface} queryInterface
 * @param {Sequelize} Sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */


// Este modelo cuenta con un campo para cada requisito que debe ser ingresado por el proponente. Tambien contempla el estado actual
// del tramite.

export default (sequelize, DataTypes) => {
  class FormPCUS extends Model {}
  FormPCUS.init(
    {
      // 1.1 Estado Legal
      // DATOS DEL PROPONENTE:
      // Estan todos en la tabla procedures

      // DATOS DEL APODERADO:
      calidadDelApoderado: DataTypes.ENUM(
        "PERSONA HUMANA",
        "PERSONA JURIDICA",
        "COMUNIDAD INDIGENA"
      ),
      CUITApoderado: DataTypes.STRING,
      domicilioLegalApoderado: DataTypes.STRING,
      emailApoderado: DataTypes.STRING,

      // DATOS DEL ARRENDATARIO
      calidadDelArrendatario: DataTypes.ENUM(
        "PERSONA HUMANA",
        "PERSONA JURIDICA",
        "COMUNIDAD INDIGENA"
      ),
      CUITArrendatario: DataTypes.STRING,
      domicilioLegalArrendatario: DataTypes.STRING,
      emailArrendatario: DataTypes.STRING,
      vencimientoContratoArrendatario: DataTypes.STRING,

      // DATOS DE LA PROPIEDAD
      titularDelDominio: DataTypes.STRING,
      departamento: DataTypes.STRING,
      nombreDelInmueble: DataTypes.STRING,
      matricula: DataTypes.STRING,
      superficieTotal: DataTypes.STRING,
      categoriasOTBNFinca: DataTypes.STRING,
      categoriasOTBNProyecto: DataTypes.STRING,

      // SUPERFICIE (hectareas)
      total: DataTypes.FLOAT,
      cultivada: DataTypes.FLOAT,
      desmontada: DataTypes.FLOAT,
      aDesmontar: DataTypes.FLOAT,
      aprovechada: DataTypes.FLOAT,
      aAprovechar: DataTypes.FLOAT,
      forestada: DataTypes.FLOAT,
      aForestar: DataTypes.FLOAT,

      // UBICACION
      localidad: DataTypes.STRING,
      paraje: DataTypes.STRING,
      accesoDesde: DataTypes.TEXT,
      pr1Coordenadas: DataTypes.STRING,
      pr2Coordenadas: DataTypes.STRING,
      pr3Coordenadas: DataTypes.STRING,
      pr1DetalleUbicacion: DataTypes.TEXT,
      pr2DetalleUbicacion: DataTypes.TEXT,
      pr3DetalleUbicacion: DataTypes.TEXT,

      // CARACTERISTICAS DEL BOSQUE
      tipoDeBosque: DataTypes.STRING,
      densidadBosque: DataTypes.STRING,
      gradoExplotacionBosque: DataTypes.STRING,
      especiesArboreasConMayorAltura: DataTypes.TEXT,
      especiesArboreasMasAbundantes: DataTypes.TEXT,
      diametrosMaximos: DataTypes.TEXT,
      promedioToconesPorHectarea: DataTypes.FLOAT,
      especiesDominanteEnSotoBosque: DataTypes.TEXT,

      // CANTIDAD ESTIMADA DE PRODUCTOS A ELABORAR 
      rollos: DataTypes.FLOAT,
      postes: DataTypes.FLOAT,
      lena: DataTypes.FLOAT,
      durmientes: DataTypes.FLOAT,
      trabillas: DataTypes.FLOAT,
      carbon: DataTypes.FLOAT,

      // DETALLE VOLUMEN DE MADERA EN ROLLOS:
      detalleMadera: DataTypes.JSON,
      destinoComercialDeLosProductos: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true
    }
  );

FormPCUS.associate = models => {
    FormPCUS.belongsTo(models.Procedure, {
        foreignKey: "procedure"
    })
}
  return FormPCUS;
};
