export function getScore(value) {
  if (!value) return 0;

  const score = Number(String(value).split("-")[0].trim());

  return Number.isFinite(score) ? score : 0;
}

export function calculateGlasgow(data) {
  const p = data?.primaire ?? {};

  return (
    getScore(p.glasgowYeux) +
    getScore(p.glasgowVerbal) +
    getScore(p.glasgowMoteur)
  );
}

export function calculateMalinas(sec) {
  return (
    getScore(sec?.malinasParite) +
    getScore(sec?.malinasTravail) +
    getScore(sec?.malinasContractions) +
    getScore(sec?.malinasIntervalle) +
    getScore(sec?.malinasEaux)
  );
}

export function calculateWallace(sec) {
  if (sec?.wallaceMode === "Enfant - règle adaptée") {
    const zones = [
      ["wallaceTeteAvant", 8.5],
      ["wallaceTeteArriere", 8.5],

      ["wallaceBrasDroitAvant", 4.5],
      ["wallaceBrasDroitArriere", 4.5],

      ["wallaceBrasGaucheAvant", 4.5],
      ["wallaceBrasGaucheArriere", 4.5],

      ["wallaceTroncAvant", 18],
      ["wallaceTroncArriere", 18],

      ["wallaceJambeDroiteAvant", 7],
      ["wallaceJambeDroiteArriere", 7],

      ["wallaceJambeGaucheAvant", 7],
      ["wallaceJambeGaucheArriere", 7],

      ["wallacePerinee", 1],
    ];

    const total = zones.reduce(
      (sum, [key, score]) => sum + (sec?.[key] ? score : 0),
      0
    );

    return Number(total.toFixed(1));
  }

  if (sec?.wallaceMode === "Paume = 1%") {
    const paumes = Number(sec?.wallacePaumes || 0);

    return Number.isFinite(paumes) ? paumes : 0;
  }

  const zones = [
    ["wallaceTeteAvant", 4.5],
    ["wallaceTeteArriere", 4.5],

    ["wallaceBrasDroitAvant", 4.5],
    ["wallaceBrasDroitArriere", 4.5],

    ["wallaceBrasGaucheAvant", 4.5],
    ["wallaceBrasGaucheArriere", 4.5],

    ["wallaceTroncAvant", 18],
    ["wallaceTroncArriere", 18],

    ["wallaceJambeDroiteAvant", 9],
    ["wallaceJambeDroiteArriere", 9],

    ["wallaceJambeGaucheAvant", 9],
    ["wallaceJambeGaucheArriere", 9],

    ["wallacePerinee", 1],
  ];

  const total = zones.reduce(
    (sum, [key, score]) => sum + (sec?.[key] ? score : 0),
    0
  );

  return Number(total.toFixed(1));
}

export function isFastPositive(sec) {
  return Boolean(
    sec?.fastFace ||
    sec?.fastArm ||
    sec?.fastSpeech
  );
}

export function isRespiratoryDistressQuality(value) {
  return value === "Absente" || value === "Gasp";
}

export function hasDetresseVitale(data) {
  const p = data?.primaire ?? {};
  const glasgow = calculateGlasgow(data);

  return Boolean(
    p.xHemorragie ||
    p.bDetresse ||
    p.cDetresse ||
    (glasgow >= 3 && glasgow <= 7)
  );
}