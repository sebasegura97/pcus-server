// Aqui se incluyen los tipos compartidos
const { gql } = require("apollo-server");

export const typeDefs = gql`
  # Need Query and Mutation type to extends among others schema files
  extend type Query {
    procedures(id: ID): ProcedureResponse!
  }

  extend type Mutation {
    createOrUpdateProcedure(input: ProcedureInput!, id: ID): ProcedureResponse!
    reviewProcedure(input: ProcedureReviewInput): ProcedureResponse!
  }

  type ProcedureResponse {
    ok: Boolean!
    message: String
    procedures: [Procedure]
  }

  type Procedure {
    id: ID!
    numeroDeExpediente: String
    calidadDelProponente: String
    razonSocial: String
    """
    La denominacion es para comunidades indigenas
    """
    denominacion: String
    condicionJuridicaDelInmueble: String
    nombreProponente: String
    apellidoProponente: String
    tipoDeDocumentoProponente: String
    numeroDeDocumentoProponente: String
    domicilioRealProponente: String
    domicilioLegalProponente: String
    domicilioProyecto: String
    nombreTRP: String
    apellidoTRP: String
    tipoDeDocumentoTRP: String
    numeroDeDocumentoTRP: String
    numeroDeCatastro: String
    planoDeMensura: String
    superficiePCUS: Float
    constanciaDeMatriculaTRP: String
    declaracionJuradaAptitudAmbiental: String
    formPCUS: FormPCUS
    PCUS: String
    cartografia: String
    constanciaDeCUITProponente: String
    estudioDeImpactoSocioAmbiental: String
    estado: String!
    user: User!
    reviews: [ProcedureReview!]!
    createdAt: String!
    deletedAt: String
    updatedAt: String!
    fechaDeAprobacion: String!
    fechaDeRechazo: String!
  }

  input ProcedureInput {
    id: ID
    numeroDeExpediente: String
    calidadDelProponente: String
    razonSocial: String
    denominacion: String
    condicionJuridicaDelInmueble: String
    nombreProponente: String
    apellidoProponente: String
    tipoDeDocumentoProponente: String
    numeroDeDocumentoProponente: String
    domicilioRealProponente: String
    domicilioLegalProponente: String
    domicilioProyecto: String
    nombreTRP: String
    apellidoTRP: String
    tipoDeDocumentoTRP: String
    numeroDeDocumentoTRP: String
    numeroDeCatastro: String
    superficiePCUS: Float
    constanciaDeMatriculaTRP: Upload
    constanciaDeCUITProponente: Upload
    planoDeMensura: Upload
    declaracionJuradaAptitudAmbiental: Upload
    formPCUS: FormPCUSInput
    PCUS: Upload
    cartografia: Upload
    estudioDeImpactoSocioAmbiental: Upload
    estado: String
  }

  type ProcedureReview {
    id: ID!
    requisitosJuridicos: Boolean
    requisitosTecnicos: Boolean
    constanciaDeCuit: Boolean
    constanciaDeMatricula: Boolean
    planoDeMensura: Boolean
    formularioPCUS: Boolean
    declaracionJuradaAptitudAmbiental: Boolean
    PCUS: Boolean
    cartografia: Boolean
    estudioImpactoAmbiental: Boolean
    requisitosFisicos: Boolean
    rechazado: Boolean
    comentarios: String
    createdAt: String!
    updatedAt: String
    deletedAt: String
  }

  input ProcedureReviewInput {
    procedureId: ID!
    constanciaDeCuit: Boolean
    constanciaDeMatricula: Boolean
    planoDeMensura: Boolean
    formularioPCUS: Boolean
    declaracionJuradaAptitudAmbiental: Boolean
    PCUS: Boolean
    cartografia: Boolean
    estudioImpactoAmbiental: Boolean
    requisitosFisicos: Boolean
    rechazado: Boolean
    comentarios: String
  }

  type FormPCUS {
    id: ID!

    # DATOS DEL APODERADO
    calidadDelApoderado: String
    CUITApoderado: String
    domicilioLegalApoderado: String
    emailApoderado: String

    # DATOS DEL ARRENDATARIO
    calidadDelArrendatario: String
    CUITArrendatario: String
    domicilioLegalArrendatario: String
    emailArrendatario: String
    vencimientoContratoArrendatario: String

    # DATOS DE LA PROPIEDAD
    titularDelDominio: String
    departamento: String
    nombreDelInmueble: String
    matricula: String
    superficieTotal: String
    categoriasOTBNFinca: String
    categoriasOTBNProyecto: String

    # SUPERFICIE (hectareas)
    total: String
    cultivada: String
    desmontada: String
    aDesmontar: String
    aprovechada: String
    aAprovechar: String
    forestada: String
    aForestar: String

    # UBICACION
    localidad: String
    paraje: String
    accesoDesde: String
    pr1Coordenadas: String
    pr2Coordenadas: String
    pr3Coordenadas: String
    pr1DetalleUbicacion: String
    pr2DetalleUbicacion: String
    pr3DetalleUbicacion: String

    # CARACTERISTICAS DEL BOSQUE
    tipoDeBosque: String
    densidadBosque: String
    gradoExplotacionBosque: String
    especiesArboreasConMayorAltura: String
    especiesArboreasMasAbundantes: String
    diametrosMaximos: String
    promedioToconesPorHectarea: String
    especiesDominanteEnSotoBosque: String

    # CANTIDAD ESTIMADA DE PRODUCTOS A ELABORAR
    rollos: String
    postes: String
    lena: String
    durmientes: String
    trabillas: String
    carbon: String

    # DETALLE VOLUMEN DE MADERA EN ROLLOS:
    detalleMadera: [DetalleMadera]
    destinoComercialDeLosProductos: String
  }

  input FormPCUSInput {
    id: ID
    
    # DATOS DEL APODERADO
    calidadDelApoderado: String
    CUITApoderado: String
    domicilioLegalApoderado: String
    emailApoderado: String

    # DATOS DEL ARRENDATARIO
    calidadDelArrendatario: String
    CUITArrendatario: String
    domicilioLegalArrendatario: String
    emailArrendatario: String
    vencimientoContratoArrendatario: String

    # DATOS DE LA PROPIEDAD
    titularDelDominio: String
    departamento: String
    nombreDelInmueble: String
    matricula: String
    superficieTotal: String
    categoriasOTBNFinca: String
    categoriasOTBNProyecto: String

    # SUPERFICIE (hectareas)
    total: String
    cultivada: String
    desmontada: String
    aDesmontar: String
    aprovechada: String
    aAprovechar: String
    forestada: String
    aForestar: String

    # UBICACION
    localidad: String
    paraje: String
    accesoDesde: String
    pr1Coordenadas: String
    pr2Coordenadas: String
    pr3Coordenadas: String
    pr1DetalleUbicacion: String
    pr2DetalleUbicacion: String
    pr3DetalleUbicacion: String

    # CARACTERISTICAS DEL BOSQUE
    tipoDeBosque: String
    densidadBosque: String
    gradoExplotacionBosque: String
    especiesArboreasConMayorAltura: String
    especiesArboreasMasAbundantes: String
    diametrosMaximos: String
    promedioToconesPorHectarea: String
    especiesDominanteEnSotoBosque: String

    # CANTIDAD ESTIMADA DE PRODUCTOS A ELABORAR
    rollos: String
    postes: String
    lena: String
    durmientes: String
    trabillas: String
    carbon: String

    # DETALLE VOLUMEN DE MADERA EN ROLLOS:
    detalleMadera: [DetalleMaderaInput]
    destinoComercialDeLosProductos: String
  }

  type DetalleMadera {
    especie: String!
    metrosCubicos: String!
  }

  input DetalleMaderaInput {
    especie: String!
    metrosCubicos: String!
  }

`;
