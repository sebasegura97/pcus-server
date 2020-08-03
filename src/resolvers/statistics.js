import { authenticated } from "../utils/authentication";
const { QueryTypes, Op } = require("sequelize");

export const resolver = {
  Query: {
    getStatistics: authenticated(
      async (parent, { from, to }, { dataSources, user }) => {
        try {
          if (user.role === "ADMINISTRADOR") {
            const statistics = await calculateStatistics({
              from,
              to,
              dataSources,
            });
            return statistics;
          } else {
            throw new Error("No autorizado");
          }
        } catch (error) {
          console.log(error);
          return;
        }
      }
    ),
  },
};

async function calculateStatistics({ from, to, dataSources }) {
  // Demora promedio del trámite
  const { models } = dataSources;
  let demoraPromedioMas300 = await models.sequelize.query(
    `select AVG(DATEDIFF(fechaDeAprobacion, createdAt)) as avg from procedures where superficiePCUS > 300;`,
    { type: QueryTypes.SELECT, raw: true }
  );
  demoraPromedioMas300 = demoraPromedioMas300[0].avg === null && 0;

  let demoraPromedioMenos300 = await models.sequelize.query(
    `select AVG(DATEDIFF(fechaDeAprobacion, createdAt)) as avg from procedures where superficiePCUS <= 300;`,
    { type: QueryTypes.SELECT, raw: true }
  );
  demoraPromedioMenos300 = demoraPromedioMenos300[0].avg === null && 0;

  const demoraPromedio = {
    name: "Demora promedio del trámite",
    unit: "Dias",
    valueMoreThan300: demoraPromedioMas300,
    valueLessThan300: demoraPromedioMenos300,
    description:
      "Tiempo promedio transcurrido entre fecha de solicitud y fecha de entrega de la resolucion aprobatoria.",
  };

  // Cantidad de solicitudes aprobadas
  const {
    count: cantidadDeAprobadosMas300,
  } = await dataSources.models.Procedure.findAndCountAll({
    where: {
      estado: "APROBADO",
      superficiePCUS: {
        [Op.gt]: 300,
      },
    },
  });

  const {
    count: cantidadDeAprobadosMenos300,
  } = await dataSources.models.Procedure.findAndCountAll({
    where: {
      estado: "APROBADO",
      superficiePCUS: {
        [Op.lte]: 300,
      },
    },
  });

  const cantidadAprobadas = {
    name: "Cantidad de solicitudes aprobadas",
    unit: "Procedimientos",
    valueMoreThan300: cantidadDeAprobadosMas300,
    valueLessThan300: cantidadDeAprobadosMenos300,
    description:
      "Cantidad total de solicitudes aprobadas desde que el sistema está en funcionamiento",
  };

  // Cantidad de solicitudes rechazadas

  const {
    count: cantidadDeRechazadosMas300,
  } = await dataSources.models.Procedure.findAndCountAll({
    where: {
      estado: "RECHAZADO",
      superficiePCUS: {
        [Op.gt]: 300,
      },
    },
  });

  const {
    count: cantidadDeRechazadosMenos300,
  } = await dataSources.models.Procedure.findAndCountAll({
    where: {
      estado: "APROBADO",
      superficiePCUS: {
        [Op.lte]: 300,
      },
    },
  });

  const cantidadRechazadas = {
    name: "Cantidad de solicitudes rechazadas",
    unit: "Procedimientos",
    valueMoreThan300: cantidadDeRechazadosMas300,
    valueLessThan300: cantidadDeRechazadosMenos300,
    description:
      "Cantidad total de solicitudes rechazadas desde que el sistema está en funcionamiento",
  };

  // Cantidad de solicitudes pendientes
  const {
    count: cantidadDePendientesMas300,
  } = await dataSources.models.Procedure.findAndCountAll({
    where: {
      superficiePCUS: {
        [Op.gt]: 300,
      },
      [Op.or]: [
        { estado: "ESPERANDO CORRECCION" },
        { estado: "ESPERANDO APROBACION" },
      ],
    },
  });

  const {
    count: cantidadDePendientesMenos300,
  } = await dataSources.models.Procedure.findAndCountAll({
    where: {
      superficiePCUS: {
        [Op.lte]: 300,
      },
      [Op.or]: [
        { estado: "ESPERANDO CORRECCION" },
        { estado: "ESPERANDO APROBACION" },
      ],
    },
  });

  const cantidadPendientes = {
    name: "Procedimientos pendientes",
    unit: "Procedimientos",
    valueMoreThan300: cantidadDePendientesMas300,
    valueLessThan300: cantidadDeAprobadosMenos300,
    description:
      "Cantidad total de solicitudes pendientes desde que el sistema está en funcionamiento",
  };

  // Cantidad total
  const {
    count: cantidadTotalMas300,
  } = await dataSources.models.Procedure.findAndCountAll({
    where: {
      deletedAt: null,
      superficiePCUS: {
        [Op.gt]: 300,
      },
    },
  });

  const {
    count: cantidadTotalMenos300,
  } = await dataSources.models.Procedure.findAndCountAll({
    where: {
      deletedAt: null,
      superficiePCUS: {
        [Op.lte]: 300,
      },
    },
  });

  const cantidadTotal = {
    name: "Total de procedimientos",
    unit: "Procedimientos",
    valueMoreThan300: cantidadTotalMas300,
    valueLessThan300: cantidadTotalMenos300,
    description:
      "Cantidad total de solicitudes iniciadas desde que el sistema está en funcionamiento",
  };

  // Superficie total aprobada
  const superficieAprobadaMas300 = await dataSources.models.Procedure.sum(
    "superficiePCUS",
    {
      where: {
        superficiePCUS: { [Op.gt]: 300 },
        estado: "APROBADO",
      },
    }
  );
  
  const superficieAprobadaMenos300 = await dataSources.models.Procedure.sum(
    "superficiePCUS",
    {
      where: {
        superficiePCUS: { [Op.lte]: 300 },
        estado: "APROBADO",
      },
    }
  );

  const superficieAprobada = {
    name: "Superficie aprobada",
    unit: "Dias",
    valueMoreThan300: superficieAprobadaMas300,
    valueLessThan300: superficieAprobadaMenos300,
    description: "Cantidad de superficie aprobada para PCUS en hectareas.",
  };

  let statistics = [
    demoraPromedio,
    cantidadAprobadas,
    cantidadRechazadas,
    cantidadPendientes,
    cantidadTotal,
    superficieAprobada,
  ];

  // Asignamos el id 
  statistics = statistics.map((item, index) => ({
    id: index,
    ...item,
  }));

  console.log(statistics);

  return statistics;
}
