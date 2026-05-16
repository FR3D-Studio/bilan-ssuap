export const BLANK_SURVEILLANCE = {
  heure: "",
  fr: "",
  spo2: "",
  fc: "",
  ta: "",
  glasgow: "",
  evn: "",
  notes: "",
};

export const INITIAL_DATA = {
  intervention: {
    dateHeure: "",
    adresse: "",
    nature: "",
    dangers: "",
    securite: false,
    renforts: "",
  },

  identite: {
    nom: "",
    prenom: "",
    age: "",
    sexe: "",
    victime: "Malaise/Maladie",
    natureVictime: "",
    societe: "",
  },

  circonstanciel: {
    circonstances: "",
    plainte: "",
    gestesTemoins: "",
  },

  primaire: {
    xHemorragie: false,
    xAction: "",

    aVA: "",
    aRachis: false,

    bQualite: "",
    bFR: "",
    bSpO2: "",
    bDetresse: false,

    cPouls: "",
    cFC: "",
    cTA: "",
    cTRC: "",
    cDetresse: false,

    glasgowYeux: "",
    glasgowVerbal: "",
    glasgowMoteur: "",

    dConscience: "",
    dNeuro: "",

    eLesions: "",
  },

  secondaire: {
    pqrstP: "",
    pqrstQ: "",
    pqrstR: "",
    pqrstS: "",
    pqrstT: "",

    maladie: "",
    hospitalisation: "",
    traitement: "",
    allergie: "",

    glycemie: "",
    temperature: "",
    evn: "",

    fastFace: false,
    fastArm: false,
    fastSpeech: false,
    fastTime: "",

    malinasParite: "",
    malinasTravail: "",
    malinasContractions: "",
    malinasIntervalle: "",
    malinasEaux: "",

    wallaceMode: "Adulte - règle des 9",
    wallacePaumes: "",

    wallaceTeteAvant: false,
    wallaceTeteArriere: false,

    wallaceBrasDroitAvant: false,
    wallaceBrasDroitArriere: false,

    wallaceBrasGaucheAvant: false,
    wallaceBrasGaucheArriere: false,

    wallaceTroncAvant: false,
    wallaceTroncArriere: false,

    wallaceJambeDroiteAvant: false,
    wallaceJambeDroiteArriere: false,

    wallaceJambeGaucheAvant: false,
    wallaceJambeGaucheArriere: false,

    wallacePerinee: false,
  },

  gestes: {
    oxygene: false,
    o2Debit: "",
    position: "",
    immobilisation: false,
    pansement: false,
    asu: "",
    autres: "",
  },

  samu: {
    couleur: "",
    heureTransmission: "",
    decision: "",
    destination: "",
    consignes: "",
    vecteur: "",

    refusEvacuationOk: false,
    refusObservations: "",
    
    refusNomVictime: "",
    refusSignatureVictime: "",
    refusNomTemoin1: "",
    refusSignatureTemoin1: "",
    refusNomTemoin2: "",
    refusSignatureTemoin2: "",
  },

  surveillance: [{ ...BLANK_SURVEILLANCE }],

  photos: [],
};