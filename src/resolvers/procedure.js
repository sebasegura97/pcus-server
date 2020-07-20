import { authenticated } from "../utils/authentication";
import uploadFile from "../utils/uploadFile";
import { userUpdateProcedureNotificationTemplate } from "../utils/email";

export const resolver = {
  Query: {
    procedures: authenticated(async (root, { id }, { dataSources, user }) => {
      var procedures = [];
      try {
        if (id) {
          // Si se busca por id primero buscamos en la BD:
          const { dataValues } = await dataSources.models.Procedure.findByPk(
            id
          );
          // Controlamos que el request venga del propietario o de un rol autorizado a ver cualquier procedimiento
          // (osea, cualquier rol menos PROPONENTE, que solo puede ver sus procedimientos)
          if ((user.id = dataValues.userId || user.role !== "PROPONENTE")) {
            procedures = [dataValues];
          } else {
            throw new Error("Usted no está autorizado a acceder a estos datos");
          }
        } else {
          // Si se piden todos los procedimientos (sin filtrar), controlamos que esto no sea solicitado por un porponente
          // y le enviamos la tabla completa de procedimientos
          if (user.role !== "PROPONENTE") {
            procedures = await dataSources.models.Procedure.findAll({
              order: [["createdAt", "DESC"]],
            });
          } else {
            // Pero si es solicitado por un proponente solo le enviamos sus procedimientos:
            procedures = await dataSources.models.Procedure.findAll({
              where: { userId: user.id },
              order: [["createdAt", "DESC"]],
            });
          }
        }
        return {
          ok: true,
          procedures,
        };
      } catch (error) {
        console.log(error);
        return {
          ok: false,
          message: error.message,
        };
      }
    }),
  },

  Mutation: {
    createOrUpdateProcedure: authenticated(
      async (parent, args, { dataSources, user }) => {
        // Estos son archivos, que primero tenemos que subir al servidor y luego guardar la url en la BD
        const {
          constanciaDeMatriculaTRP,
          planoDeMensura,
          declaracionJuradaAptitudAmbiental,
          PCUS,
          cartografia,
          estudioDeImpactoSocioAmbiental,
          constanciaDeCUITProponente,
        } = args.input;

        var formPCUS = args.input.formPCUS;

        // Ponemos todos los archivos en un solo objeto para facilitar su manejo:
        const files = {
          constanciaDeMatriculaTRP,
          planoDeMensura,
          declaracionJuradaAptitudAmbiental,
          PCUS,
          cartografia,
          estudioDeImpactoSocioAmbiental,
          constanciaDeCUITProponente,
        };

        // Eliminamos los archivos para guardar el resto (datos) en la base de datos:
        delete args.input.constanciaDeMatriculaTRP;
        delete args.input.planoDeMensura;
        delete args.input.declaracionJuradaAptitudAmbiental;
        delete args.input.PCUS;
        delete args.input.cartografia;
        delete args.input.estudioDeImpactoSocioAmbiental;
        delete args.input.constanciaDeCUITProponente;

        // Tambien sacamos el id, si es que lo tuviera:
        var id = args.input.id;

        // Primero guardamos o actualizamos los datos para obtener el id:
        try {
          if (!id) {
            var { dataValues } = await dataSources.models.Procedure.create({
              ...args.input,
              userId: user.id,
              estado: "ESPERANDO REVISION",
            });
          } else {
            await dataSources.models.Procedure.update(
              {
                ...args.input,
                userId: user.id,
                estado: "ESPERANDO REVISION",
              },
              {
                where: { id },
              }
            );
            var { dataValues } = await dataSources.models.Procedure.findByPk(
              id
            );
          }
          if (formPCUS) {
            const formRecord = await dataSources.models.FormPCUS.findOne({
              where: { procedure: dataValues.id },
            });
            if (!formRecord) {
              await dataSources.models.FormPCUS.create({
                ...formPCUS,
                procedure: dataValues.id,
              });
            } else {
              await dataSources.models.FormPCUS.update(formPCUS, {
                where: { procedure: dataValues.id },
              });
            }
            // console.log("dataValues.id", dataValues.id);
          }
        } catch (error) {
          console.log(error);
          return {
            ok: false,
            message: error.message ? error.message : error,
          };
        }

        // Subimos los archivos y la funcion uploadFile(file, folder, subfolder) devuelve la url que guardaremos en la BD
        // Pondremos las url's dentro de una variable:
        var filesURL = {};

        console.log("files", files);

        for (var key of Object.keys(files)) {
          if (files[key]) {
            try {
              const url = await uploadFile(
                files[key][0],
                "procedures",
                dataValues.id,
                key
              );
              filesURL[key] = url;
            } catch (error) {
              console.log(error);
              return {
                ok: false,
                message: error.message ? error.message : error,
              };
            }
          }
        }

        console.log("filesURL", filesURL);

        // Actualizamos la BD con las urls generadas para los archivos:
        try {
          await dataSources.models.Procedure.update(filesURL, {
            where: { id: dataValues.id },
          });
          return {
            ok: true,
            message: "Se han registrado los datos correctamente.",
          };
        } catch (error) {
          console.log(error);
          return {
            ok: false,
            message: error.message ? error.message : error,
          };
        }
      }
    ),

    reviewProcedure: authenticated(
      async (parent, args, { dataSources, user }) => {
        try {
          if (user.role === "PROPONENTE") {
            throw new Error("Acceso denegado");
          }

          const prevReview = await dataSources.models.ProcedureReview.findOne({
            where: { procedureId: args.input.procedureId },
          });

          
          if (prevReview) {
            if (!args.input.comentarios) {
              args.input.comentarios = "";
            };
            prevReview.update(args.input)
          } else {
            await dataSources.models.ProcedureReview.create({
              ...args.input,
              userId: user.id,
            });
          }

          return {
            ok: true,
            message:
              "Se ha guardado la revisión y se ha notificado al proponente.",
          };
        } catch (error) {
          console.log(error);
          return {
            ok: false,
            message: error.message ? error.message : error,
          };
        }
      }
    ),
  },

  Procedure: {
    user: async (parent, _, { dataSources }) =>
      dataSources.models.User.findByPk(parent.userId),
    formPCUS: async (parent, _, { dataSources }) =>
      dataSources.models.FormPCUS.findOne({ where: { procedure: parent.id } }),
    reviews: async (parent, _, { dataSources }) =>
      dataSources.models.ProcedureReview.findAll({
        where: { procedureId: parent.id },
        order: [["createdAt", "desc"]],
      }),
  },
};
