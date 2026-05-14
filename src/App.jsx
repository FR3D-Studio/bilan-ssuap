import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ClipboardList, HeartPulse, Send, ShieldCheck, Stethoscope, TimerReset } from "lucide-react";

const scoreOption = (score, label) => `${score} - ${label}`;
const txt = (value) => (value === null || value === undefined ? "" : String(value));
const yesNo = (value) => (value ? "OUI" : "NON");
const clone = (value) => JSON.parse(JSON.stringify(value));

const OPTIONS = {
  voiesAeriennes: ["Libres", "Obstruction partielle", "Obstruction complète", "Encombrées", "Vomissements", "Sang", "Corps étranger", "Canule en place"],
  respiration: ["Normale", "Bruyante", "Superficielle", "Difficile", "Absente", "Gasp", "Tirage"],
  pouls: ["Régulier", "Irrégulier", "Bien frappé", "Filant", "Non perçu"],
  conscience: ["Consciente", "Confuse", "Désorientée", "Somnolente", "Inconsciente", "Agitée"],
  position: ["Allongée", "PLS", "Demi-assise", "Assise", "Décubitus latéral gauche", "Jambes surélevées"],
  novi: ["Non concerné", "Urgence absolue", "Urgence relative", "Impliqué / indemne", "Décédé"],
};

const GLASGOW = {
  eyes: [scoreOption(4, "Spontanée"), scoreOption(3, "À la parole"), scoreOption(2, "À la douleur"), scoreOption(1, "Aucune")],
  verbal: [scoreOption(5, "Orientée"), scoreOption(4, "Confuse"), scoreOption(3, "Inappropriée"), scoreOption(2, "Incompréhensible"), scoreOption(1, "Aucune")],
  motor: [scoreOption(6, "Obéit aux ordres"), scoreOption(5, "Localise la douleur"), scoreOption(4, "Évite la douleur"), scoreOption(3, "Flexion anormale"), scoreOption(2, "Extension"), scoreOption(1, "Aucune")],
};

const MALINAS = {
  parite: [scoreOption(0, "1er accouchement"), scoreOption(1, "2e accouchement"), scoreOption(2, "3e et +")],
  travail: [scoreOption(0, "< 3h"), scoreOption(1, "3 à 5h"), scoreOption(2, "> 5h")],
  contractions: [scoreOption(0, "< 1 min"), scoreOption(1, "1 min"), scoreOption(2, "> 1 min")],
  intervalle: [scoreOption(0, "> 5 min"), scoreOption(1, "3 à 5 min"), scoreOption(2, "< 3 min")],
  eaux: [scoreOption(0, "Non"), scoreOption(1, "Récente"), scoreOption(2, "> 1h")],
};

const BLANK_SURVEILLANCE = { heure: "", fr: "", spo2: "", fc: "", ta: "", glasgow: "", evn: "", notes: "" };

const INITIAL_DATA = {
  intervention: { dateHeure: "", adresse: "", nature: "", dangers: "", securite: false, renforts: "" },
  identite: { nom: "", prenom: "", age: "", sexe: "", victime: "" },
  circonstanciel: { circonstances: "", plainte: "", gestesTemoins: "" },
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
  gestes: { oxygene: false, o2Debit: "", position: "", immobilisation: false, pansement: false, asu: "", autres: "" },
  samu: { couleur: "", heureTransmission: "", decision: "", destination: "", consignes: "" },
  surveillance: [{ ...BLANK_SURVEILLANCE }],
};

function normalizeNovi(value) {
  const raw = txt(value).trim();
  if (raw.includes("Urgence absolue")) return "Urgence absolue";
  if (raw.includes("Urgence relative")) return "Urgence relative";
  if (raw.includes("Impliqué")) return "Impliqué / indemne";
  if (raw.includes("Décédé")) return "Décédé";
  return raw || "Non concerné";
}

function getScore(value) {
  if (!value) return 0;
  const score = Number(String(value).split("-")[0].trim());
  return Number.isFinite(score) ? score : 0;
}

function calculateGlasgow(data) {
  const p = data?.primaire ?? {};
  return getScore(p.glasgowYeux) + getScore(p.glasgowVerbal) + getScore(p.glasgowMoteur);
}

function calculateMalinas(sec) {
  return getScore(sec?.malinasParite) + getScore(sec?.malinasTravail) + getScore(sec?.malinasContractions) + getScore(sec?.malinasIntervalle) + getScore(sec?.malinasEaux);
}

function calculateWallace(sec) {
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
    const total = zones.reduce((sum, [key, score]) => sum + (sec?.[key] ? score : 0), 0);
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
  const total = zones.reduce((sum, [key, score]) => sum + (sec?.[key] ? score : 0), 0);
  return Number(total.toFixed(1));
}

function isFastPositive(sec) {
  return Boolean(sec?.fastFace || sec?.fastArm || sec?.fastSpeech);
}

function hasDetresseVitale(data) {
  const p = data?.primaire ?? {};
  const glasgow = calculateGlasgow(data);
  return Boolean(p.xHemorragie || p.bDetresse || p.cDetresse || (glasgow >= 3 && glasgow <= 7));
}

function buildResume(data) {
  const d = data ?? clone(INITIAL_DATA);
  const i = d.intervention ?? {};
  const id = d.identite ?? {};
  const c = d.circonstanciel ?? {};
  const p = d.primaire ?? {};
  const s = d.secondaire ?? {};
  const g = d.gestes ?? {};
  const samu = d.samu ?? {};
  const surveillance = Array.isArray(d.surveillance) ? d.surveillance : [];
  const surveillanceText = surveillance.length
    ? surveillance.map((x, index) => `${index + 1}. ${txt(x?.heure)} FR ${txt(x?.fr)} SpO₂ ${txt(x?.spo2)} FC ${txt(x?.fc)} TA ${txt(x?.ta)} Glasgow ${txt(x?.glasgow)} EVN ${txt(x?.evn)} ${txt(x?.notes)}`.trim()).join("\n")
    : "Aucune surveillance renseignée";

  return [
    "BILAN VICTIME",
    "",
    "INTERVENTION",
    `Date/heure : ${txt(i.dateHeure)}`,
    `Adresse : ${txt(i.adresse)}`,
    `Nature : ${txt(i.nature)}`,
    `Sécurité réalisée : ${yesNo(i.securite)}`,
    `Dangers/contexte : ${txt(i.dangers)}`,
    `Renforts : ${txt(i.renforts)}`,
    "",
    "IDENTITÉ",
    `${txt(id.sexe)} ${txt(id.age)} ans - ${txt(id.nom)} ${txt(id.prenom)}`.trim(),
    `Type : ${txt(id.victime)}`,
    "",
    "CIRCONSTANCES",
    txt(c.circonstances),
    `Plainte : ${txt(c.plainte)}`,
    `Gestes témoins : ${txt(c.gestesTemoins)}`,
    "",
    "PRIMAIRE XABCDE",
    `X hémorragie : ${yesNo(p.xHemorragie)} ${txt(p.xAction)}`,
    `A voies aériennes : ${txt(p.aVA)} / suspicion rachis : ${yesNo(p.aRachis)}`,
    `B respiration : ${txt(p.bQualite)}, FR ${txt(p.bFR)}, SpO₂ ${txt(p.bSpO2)}, détresse ${yesNo(p.bDetresse)}`,
    `C circulation : pouls ${txt(p.cPouls)}, FC ${txt(p.cFC)}, TA ${txt(p.cTA)}, TRC ${txt(p.cTRC)}, détresse ${yesNo(p.cDetresse)}`,
    `D neurologique : Glasgow ${calculateGlasgow(d)}, conscience ${txt(p.dConscience)}, signes ${txt(p.dNeuro)}`,
    `E lésions : ${txt(p.eLesions)}`,
    "",
    "SECONDAIRE",
    `PQRST : P ${txt(s.pqrstP)} / Q ${txt(s.pqrstQ)} / R ${txt(s.pqrstR)} / S ${txt(s.pqrstS)} / T ${txt(s.pqrstT)}`,
    `MHTA : Maladie ${txt(s.maladie)} / Hospitalisation ${txt(s.hospitalisation)} / Traitement ${txt(s.traitement)} / Allergie ${txt(s.allergie)}`,
    `Glycémie ${txt(s.glycemie)}, T° ${txt(s.temperature)}, EVN ${txt(s.evn)}, FAST ${isFastPositive(s) ? "positif" : "négatif/non retrouvé"}`,
    `Malinas ${calculateMalinas(s)}, Wallace ${calculateWallace(s)}%`,
    "",
    "GESTES",
    `O₂ ${yesNo(g.oxygene)} débit ${txt(g.o2Debit)}, position ${txt(g.position)}, immobilisation ${yesNo(g.immobilisation)}, pansement ${yesNo(g.pansement)}, ASU ${txt(g.asu)}, autres ${txt(g.autres)}`,
    "",
    "SAMU",
    `Tri NOVI ${normalizeNovi(samu.couleur)}, heure transmission ${txt(samu.heureTransmission)}, décision ${txt(samu.decision)}, destination ${txt(samu.destination)}, consignes ${txt(samu.consignes)}`,
    "",
    "SURVEILLANCE",
    surveillanceText,
  ].join("\n");
}

function runSelfTests() {
  console.assert(buildResume({}).includes("BILAN VICTIME"), "Résumé minimal OK");
  console.assert(getScore("4 - Spontanée") === 4, "Extraction score OK");
  console.assert(calculateGlasgow({ primaire: { glasgowYeux: "4 - Spontanée", glasgowVerbal: "5 - Orientée", glasgowMoteur: "6 - Obéit aux ordres" } }) === 15, "Glasgow OK");
  console.assert(calculateMalinas({ malinasParite: "2 - 3e et +", malinasTravail: "1 - 3 à 5h" }) === 3, "Malinas OK");
  console.assert(calculateWallace({ wallaceTroncAvant: true, wallaceTroncArriere: true }) === 36, "Wallace OK");
  console.assert(calculateWallace({ wallaceTeteAvant: true, wallaceTeteArriere: true }) === 9, "Wallace tête avant + arrière OK");
  console.assert(calculateWallace({ wallaceMode: "Paume = 1%", wallacePaumes: "7" }) === 7, "Wallace paume OK");
  console.assert(calculateWallace({ wallaceMode: "Enfant - règle adaptée", wallaceTeteAvant: true, wallaceTeteArriere: true }) === 17, "Wallace enfant tête OK");
  console.assert(hasDetresseVitale({ primaire: { glasgowYeux: "2 - À la douleur", glasgowVerbal: "2 - Incompréhensible", glasgowMoteur: "3 - Flexion anormale" } }) === true, "Détresse Glasgow OK");
  console.assert(isFastPositive({ fastFace: false, fastArm: true, fastSpeech: false }) === true, "FAST positif OK");
  console.assert(normalizeNovi("Urgence absolue 🔴") === "Urgence absolue", "NOVI normalisé OK");
}
runSelfTests();

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input type={type} value={txt(value)} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
    </label>
  );
}

function Area({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="block space-y-1 md:col-span-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea value={txt(value)} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select value={txt(value)} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
        <option value="">Sélectionner...</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm">
      <input type="checkbox" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-blue-600" />
      <span>{label}</span>
    </label>
  );
}

function Button({ children, onClick, variant = "solid" }) {
  const styles = variant === "outline" ? "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50" : "bg-slate-950 text-white hover:bg-slate-800";
  return <button type="button" onClick={onClick} className={`rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm transition active:scale-[0.99] ${styles}`}>{children}</button>;
}

function Badge({ children, danger }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${danger ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}`}>{children}</span>;
}

function NoviBadge({ value }) {
  const cleanValue = normalizeNovi(value);
  const styles = {
    "Urgence absolue": "bg-red-600 text-white border-red-700",
    "Urgence relative": "bg-yellow-400 text-slate-900 border-yellow-500",
    "Impliqué / indemne": "bg-green-600 text-white border-green-700",
    "Décédé": "bg-black text-white border-black",
    "Non concerné": "bg-slate-200 text-slate-800 border-slate-300",
  };
  const dots = {
    "Urgence absolue": "🔴",
    "Urgence relative": "🟡",
    "Impliqué / indemne": "🟢",
    "Décédé": "⚫",
    "Non concerné": "⚪",
  };
  const style = styles[cleanValue] || styles["Non concerné"];
  const dot = dots[cleanValue] || dots["Non concerné"];

  return (
    <div className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-black shadow-sm ${style}`}>
      <span className="text-xl">{dot}</span>
      <span>{cleanValue}</span>
    </div>
  );
}

function CardBlock({ title, icon: Icon, tone = "slate", children }) {
  const tones = {
    slate: "from-slate-50 to-white border-slate-200",
    red: "from-red-50 to-white border-red-200",
    blue: "from-blue-50 to-white border-blue-200",
    green: "from-emerald-50 to-white border-emerald-200",
    amber: "from-amber-50 to-white border-amber-200",
  };
  return (
    <div className={`rounded-3xl border bg-gradient-to-br ${tones[tone] ?? tones.slate} shadow-sm`}>
      <div className="space-y-4 p-4 md:p-6">
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="h-5 w-5" /> : null}
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

function TabButton({ id, active, onClick, children }) {
  const activeClasses = active === id ? "bg-slate-950 text-white" : "bg-white text-slate-700 hover:bg-slate-100";
  return <button type="button" onClick={() => onClick(id)} className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${activeClasses}`}>{children}</button>;
}

function ScoreCard({ title, value, danger, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-base font-bold text-slate-900">{title}</h3>
      {children}
      <div className={`mt-3 rounded-2xl p-3 text-center text-2xl font-black text-white ${danger ? "bg-red-600" : "bg-slate-950"}`}>{value}</div>
    </div>
  );
}

function AppHeader({ detresseVitale }) {
  return (
    <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-slate-950 p-5 text-white shadow-lg">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black md:text-3xl">Bilan SSUAP mobile</h1>
          <p className="text-sm text-slate-300">Support de saisie opérationnelle : circonstanciel, primaire XABCDE, secondaire, surveillance, transmission.</p>
        </div>
        <Badge danger={detresseVitale}>{detresseVitale ? "Détresse vitale potentielle" : "Pas de détresse vitale cochée"}</Badge>
      </div>
      <p className="mt-3 rounded-2xl bg-white/10 p-3 text-xs text-slate-200">Outil d’aide à la structuration du bilan. La décision opérationnelle et médicale relève des procédures en vigueur, du CA et de la régulation SAMU.</p>
    </motion.header>
  );
}

function DepartTab({ data, set }) {
  return (
    <div className="space-y-4">
      <CardBlock title="1. Sécurité / intervention" icon={ShieldCheck} tone="blue">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Date / heure" value={data.intervention.dateHeure} onChange={(v) => set(["intervention", "dateHeure"], v)} />
          <Field label="Adresse" value={data.intervention.adresse} onChange={(v) => set(["intervention", "adresse"], v)} />
          <Field label="Nature d’intervention" value={data.intervention.nature} onChange={(v) => set(["intervention", "nature"], v)} />
          <Field label="Renforts demandés / présents" value={data.intervention.renforts} onChange={(v) => set(["intervention", "renforts"], v)} />
          <Area label="Dangers / contexte / sécurité" value={data.intervention.dangers} onChange={(v) => set(["intervention", "dangers"], v)} />
          <Check label="Sécurité réalisée" checked={data.intervention.securite} onChange={(v) => set(["intervention", "securite"], v)} />
        </div>
      </CardBlock>
      <CardBlock title="2. Identification / circonstanciel" icon={ClipboardList}>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Nom" value={data.identite.nom} onChange={(v) => set(["identite", "nom"], v)} />
          <Field label="Prénom" value={data.identite.prenom} onChange={(v) => set(["identite", "prenom"], v)} />
          <Field label="Âge" value={data.identite.age} onChange={(v) => set(["identite", "age"], v)} />
          <Field label="Sexe" value={data.identite.sexe} onChange={(v) => set(["identite", "sexe"], v)} />
          <Field label="Type" value={data.identite.victime} onChange={(v) => set(["identite", "victime"], v)} placeholder="blessé, malade, impliqué..." />
          <Area label="Circonstances" value={data.circonstanciel.circonstances} onChange={(v) => set(["circonstanciel", "circonstances"], v)} />
          <Area label="Plainte principale" value={data.circonstanciel.plainte} onChange={(v) => set(["circonstanciel", "plainte"], v)} />
          <Area label="Gestes déjà réalisés par témoins" value={data.circonstanciel.gestesTemoins} onChange={(v) => set(["circonstanciel", "gestesTemoins"], v)} />
        </div>
      </CardBlock>
    </div>
  );
}

function PrimaireTab({ data, set, detresseVitale }) {
  const glasgow = calculateGlasgow(data);
  return (
    <CardBlock title="Bilan primaire XABCDE" icon={HeartPulse} tone="red">
      <div className="grid gap-3 md:grid-cols-2">
        <Check label="X : hémorragie externe grave" checked={data.primaire.xHemorragie} onChange={(v) => set(["primaire", "xHemorragie"], v)} />
        <Field label="X : action réalisée" value={data.primaire.xAction} onChange={(v) => set(["primaire", "xAction"], v)} placeholder="compression, pansement, garrot..." />
        <SelectField label="A : voies aériennes" value={data.primaire.aVA} onChange={(v) => set(["primaire", "aVA"], v)} options={OPTIONS.voiesAeriennes} />
        <Check label="A : suspicion rachis / stabilisation" checked={data.primaire.aRachis} onChange={(v) => set(["primaire", "aRachis"], v)} />
        <SelectField label="B : qualité respiration" value={data.primaire.bQualite} onChange={(v) => set(["primaire", "bQualite"], v)} options={OPTIONS.respiration} />
        <Field label="B : FR" value={data.primaire.bFR} onChange={(v) => set(["primaire", "bFR"], v)} />
        <Field label="B : SpO₂" value={data.primaire.bSpO2} onChange={(v) => set(["primaire", "bSpO2"], v)} />
        <Check label="B : détresse respiratoire" checked={data.primaire.bDetresse} onChange={(v) => set(["primaire", "bDetresse"], v)} />
        <SelectField label="C : pouls" value={data.primaire.cPouls} onChange={(v) => set(["primaire", "cPouls"], v)} options={OPTIONS.pouls} />
        <Field label="C : FC" value={data.primaire.cFC} onChange={(v) => set(["primaire", "cFC"], v)} />
        <Field label="C : TA" value={data.primaire.cTA} onChange={(v) => set(["primaire", "cTA"], v)} />
        <Field label="C : TRC" value={data.primaire.cTRC} onChange={(v) => set(["primaire", "cTRC"], v)} />
        <Check label="C : détresse circulatoire" checked={data.primaire.cDetresse} onChange={(v) => set(["primaire", "cDetresse"], v)} />
        <div className="md:col-span-2">
          <ScoreCard title="Score de Glasgow" value={`Glasgow total : ${glasgow}`} danger={glasgow >= 3 && glasgow <= 7}>
            <div className="grid gap-3 md:grid-cols-3">
              <SelectField label="Ouverture des yeux" value={data.primaire.glasgowYeux} onChange={(v) => set(["primaire", "glasgowYeux"], v)} options={GLASGOW.eyes} />
              <SelectField label="Réponse verbale" value={data.primaire.glasgowVerbal} onChange={(v) => set(["primaire", "glasgowVerbal"], v)} options={GLASGOW.verbal} />
              <SelectField label="Réponse motrice" value={data.primaire.glasgowMoteur} onChange={(v) => set(["primaire", "glasgowMoteur"], v)} options={GLASGOW.motor} />
            </div>
            {glasgow >= 3 && glasgow <= 7 ? <div className="mt-3 rounded-2xl bg-red-100 p-3 text-center font-bold text-red-800"><AlertTriangle className="mr-2 inline h-5 w-5" />Glasgow 3 à 7 : avis médical urgent</div> : null}
          </ScoreCard>
        </div>
        <SelectField label="D : conscience" value={data.primaire.dConscience} onChange={(v) => set(["primaire", "dConscience"], v)} options={OPTIONS.conscience} />
        <Area label="D : signes neurologiques" value={data.primaire.dNeuro} onChange={(v) => set(["primaire", "dNeuro"], v)} />
        <Area label="E : lésions / exposition" value={data.primaire.eLesions} onChange={(v) => set(["primaire", "eLesions"], v)} />
      </div>
      {detresseVitale ? <div className="rounded-2xl bg-red-600 p-3 font-semibold text-white"><AlertTriangle className="mr-2 inline h-5 w-5" />Transmission urgente SAMU / bilan rouge à envisager selon procédure.</div> : null}
    </CardBlock>
  );
}

function SecondaireTab({ data, set }) {
  const s = data.secondaire;
  const malinas = calculateMalinas(s);
  const wallace = calculateWallace(s);
  const fast = isFastPositive(s);
  return (
    <CardBlock title="Bilan secondaire : PQRST + MHTA + paramètres" icon={Stethoscope} tone="green">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-base font-bold text-slate-900">PQRST</h3>
          <div className="grid gap-3">
            <Field label="P - Provoqué par" value={s.pqrstP} onChange={(v) => set(["secondaire", "pqrstP"], v)} />
            <Field label="Q - Qualité" value={s.pqrstQ} onChange={(v) => set(["secondaire", "pqrstQ"], v)} />
            <Field label="R - Région / irradiation" value={s.pqrstR} onChange={(v) => set(["secondaire", "pqrstR"], v)} />
            <Field label="S - Sévérité / EVN" value={s.pqrstS} onChange={(v) => set(["secondaire", "pqrstS"], v)} />
            <Field label="T - Temps / évolution" value={s.pqrstT} onChange={(v) => set(["secondaire", "pqrstT"], v)} />
          </div>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-base font-bold text-slate-900">MHTA</h3>
          <div className="grid gap-3">
            <Field label="M - Maladie / antécédents" value={s.maladie} onChange={(v) => set(["secondaire", "maladie"], v)} />
            <Field label="H - Hospitalisations" value={s.hospitalisation} onChange={(v) => set(["secondaire", "hospitalisation"], v)} />
            <Field label="T - Traitements" value={s.traitement} onChange={(v) => set(["secondaire", "traitement"], v)} />
            <Field label="A - Allergies" value={s.allergie} onChange={(v) => set(["secondaire", "allergie"], v)} />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-bold text-slate-900">FAST AVC</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <Check label="Face" checked={s.fastFace} onChange={(v) => set(["secondaire", "fastFace"], v)} />
          <Check label="Arm" checked={s.fastArm} onChange={(v) => set(["secondaire", "fastArm"], v)} />
          <Check label="Speech" checked={s.fastSpeech} onChange={(v) => set(["secondaire", "fastSpeech"], v)} />
        </div>
        <div className={`mt-3 rounded-2xl p-3 font-semibold ${fast ? "bg-red-600 text-white" : "bg-slate-100 text-slate-900"}`}>FAST : {fast ? "POSITIF" : "NÉGATIF / NON RETROUVÉ"}</div>
      </div>

      <ScoreCard title="Score de Malinas" value={`Malinas : ${malinas}`} danger={malinas >= 5}>
        <div className="grid gap-3 md:grid-cols-2">
          <SelectField label="Parité" value={s.malinasParite} onChange={(v) => set(["secondaire", "malinasParite"], v)} options={MALINAS.parite} />
          <SelectField label="Durée travail" value={s.malinasTravail} onChange={(v) => set(["secondaire", "malinasTravail"], v)} options={MALINAS.travail} />
          <SelectField label="Durée contractions" value={s.malinasContractions} onChange={(v) => set(["secondaire", "malinasContractions"], v)} options={MALINAS.contractions} />
          <SelectField label="Intervalle contractions" value={s.malinasIntervalle} onChange={(v) => set(["secondaire", "malinasIntervalle"], v)} options={MALINAS.intervalle} />
          <SelectField label="Perte des eaux" value={s.malinasEaux} onChange={(v) => set(["secondaire", "malinasEaux"], v)} options={MALINAS.eaux} />
        </div>
        {malinas >= 5 ? <div className="mt-3 rounded-2xl bg-red-100 p-3 text-center font-bold text-red-800"><AlertTriangle className="mr-2 inline h-5 w-5" />Accouchement imminent : préparer prise en charge sur place et prévenir rapidement le SAMU.</div> : null}
      </ScoreCard>

      <ScoreCard title="Règle de Wallace" value={`Surface brûlée : ${wallace}%`} danger={false}>
        <p className="mb-3 rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-900">Contrôler systématiquement la face antérieure ET la face postérieure de la victime. Mode adulte et enfant disponibles selon l’âge de la victime.</p>
        <div className="mb-3">
          <SelectField label="Mode d’évaluation" value={s.wallaceMode} onChange={(v) => set(["secondaire", "wallaceMode"], v)} options={["Adulte - règle des 9", "Enfant - règle adaptée", "Paume = 1%"]} />
        </div>
        {s.wallaceMode === "Paume = 1%" ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <Field label="Nombre de paumes de la victime brûlées" value={s.wallacePaumes} onChange={(v) => set(["secondaire", "wallacePaumes"], v)} placeholder="1 paume = environ 1%" />
            <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-600">Méthode utile pour les petites brûlures : la paume de la victime représente environ 1% de la surface corporelle.</div>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="mb-3 font-bold text-slate-900">Face antérieure</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <Check label={s.wallaceMode === "Enfant - règle adaptée" ? "Tête / face avant 8,5%" : "Tête / face avant 4,5%"} checked={s.wallaceTeteAvant} onChange={(v) => set(["secondaire", "wallaceTeteAvant"], v)} />
                <Check label="Bras droit avant 4,5%" checked={s.wallaceBrasDroitAvant} onChange={(v) => set(["secondaire", "wallaceBrasDroitAvant"], v)} />
                <Check label="Bras gauche avant 4,5%" checked={s.wallaceBrasGaucheAvant} onChange={(v) => set(["secondaire", "wallaceBrasGaucheAvant"], v)} />
                <Check label="Tronc avant 18%" checked={s.wallaceTroncAvant} onChange={(v) => set(["secondaire", "wallaceTroncAvant"], v)} />
                <Check label={s.wallaceMode === "Enfant - règle adaptée" ? "Jambe droite avant 7%" : "Jambe droite avant 9%"} checked={s.wallaceJambeDroiteAvant} onChange={(v) => set(["secondaire", "wallaceJambeDroiteAvant"], v)} />
                <Check label={s.wallaceMode === "Enfant - règle adaptée" ? "Jambe gauche avant 7%" : "Jambe gauche avant 9%"} checked={s.wallaceJambeGaucheAvant} onChange={(v) => set(["secondaire", "wallaceJambeGaucheAvant"], v)} />
                <Check label="Périnée 1%" checked={s.wallacePerinee} onChange={(v) => set(["secondaire", "wallacePerinee"], v)} />
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="mb-3 font-bold text-slate-900">Face postérieure</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <Check label={s.wallaceMode === "Enfant - règle adaptée" ? "Tête arrière 8,5%" : "Tête arrière 4,5%"} checked={s.wallaceTeteArriere} onChange={(v) => set(["secondaire", "wallaceTeteArriere"], v)} />
                <Check label="Bras droit arrière 4,5%" checked={s.wallaceBrasDroitArriere} onChange={(v) => set(["secondaire", "wallaceBrasDroitArriere"], v)} />
                <Check label="Bras gauche arrière 4,5%" checked={s.wallaceBrasGaucheArriere} onChange={(v) => set(["secondaire", "wallaceBrasGaucheArriere"], v)} />
                <Check label="Dos / tronc arrière 18%" checked={s.wallaceTroncArriere} onChange={(v) => set(["secondaire", "wallaceTroncArriere"], v)} />
                <Check label={s.wallaceMode === "Enfant - règle adaptée" ? "Jambe droite arrière 7%" : "Jambe droite arrière 9%"} checked={s.wallaceJambeDroiteArriere} onChange={(v) => set(["secondaire", "wallaceJambeDroiteArriere"], v)} />
                <Check label={s.wallaceMode === "Enfant - règle adaptée" ? "Jambe gauche arrière 7%" : "Jambe gauche arrière 9%"} checked={s.wallaceJambeGaucheArriere} onChange={(v) => set(["secondaire", "wallaceJambeGaucheArriere"], v)} />
              </div>
              <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-600">Retourner / inspecter la victime selon la situation et la sécurité, pour ne pas oublier les lésions postérieures.</div>
            </div>
          </div>
        )}
      </ScoreCard>

      <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-bold text-slate-900">Paramètres / examens complémentaires</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Field label="EVN" value={s.evn} onChange={(v) => set(["secondaire", "evn"], v)} />
          <Field label="Glycémie" value={s.glycemie} onChange={(v) => set(["secondaire", "glycemie"], v)} />
          <Field label="Température" value={s.temperature} onChange={(v) => set(["secondaire", "temperature"], v)} />
        </div>
      </div>
    </CardBlock>
  );
}

function GestesTab({ data, set, updateSurveillance, addSurveillance }) {
  const surveillance = Array.isArray(data.surveillance) ? data.surveillance : [];
  return (
    <div className="space-y-4">
      <CardBlock title="Gestes réalisés / conditionnement" icon={ShieldCheck} tone="amber">
        <div className="grid gap-3 md:grid-cols-2">
          <Check label="O₂ administré" checked={data.gestes.oxygene} onChange={(v) => set(["gestes", "oxygene"], v)} />
          <Field label="Débit O₂" value={data.gestes.o2Debit} onChange={(v) => set(["gestes", "o2Debit"], v)} />
          <SelectField label="Position" value={data.gestes.position} onChange={(v) => set(["gestes", "position"], v)} options={OPTIONS.position} />
          <Check label="Immobilisation" checked={data.gestes.immobilisation} onChange={(v) => set(["gestes", "immobilisation"], v)} />
          <Check label="Pansement / protection" checked={data.gestes.pansement} onChange={(v) => set(["gestes", "pansement"], v)} />
          <Field label="ASU sur prescription médicale / soins réalisés" value={data.gestes.asu} onChange={(v) => set(["gestes", "asu"], v)} placeholder="ex : ECG, hémoglobinémie, traitement prescrit, autre soin..." />
          <Area label="Autres gestes" value={data.gestes.autres} onChange={(v) => set(["gestes", "autres"], v)} />
        </div>
      </CardBlock>
      <CardBlock title="Surveillance" icon={TimerReset}>
        <div className="space-y-3">
          {surveillance.map((s, i) => (
            <div key={`surveillance-${i}`} className="grid gap-2 rounded-3xl border border-slate-200 bg-white p-3 md:grid-cols-8">
              <Field label="Heure" value={s?.heure} onChange={(v) => updateSurveillance(i, "heure", v)} />
              <Field label="FR" value={s?.fr} onChange={(v) => updateSurveillance(i, "fr", v)} />
              <Field label="SpO₂" value={s?.spo2} onChange={(v) => updateSurveillance(i, "spo2", v)} />
              <Field label="FC" value={s?.fc} onChange={(v) => updateSurveillance(i, "fc", v)} />
              <Field label="TA" value={s?.ta} onChange={(v) => updateSurveillance(i, "ta", v)} />
              <Field label="Glasgow" value={s?.glasgow} onChange={(v) => updateSurveillance(i, "glasgow", v)} />
              <Field label="EVN" value={s?.evn} onChange={(v) => updateSurveillance(i, "evn", v)} />
              <Field label="Notes" value={s?.notes} onChange={(v) => updateSurveillance(i, "notes", v)} />
            </div>
          ))}
          <Button onClick={addSurveillance}>Ajouter une surveillance</Button>
        </div>
      </CardBlock>
    </div>
  );
}

function SamuTab({ data, set }) {
  return (
    <CardBlock title="Transmission SAMU / devenir" icon={Send} tone="blue">
      <div className="space-y-3">
        <div className="rounded-2xl bg-blue-50 p-3 text-sm font-semibold text-blue-900">Le tri NOVI sert au classement rapide en présence de nombreuses victimes. Il ne remplace pas la transmission du bilan au SAMU.</div>
        <NoviBadge value={data.samu.couleur} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <SelectField label="Tri NOVI / nombreuses victimes" value={data.samu.couleur} onChange={(v) => set(["samu", "couleur"], v)} options={OPTIONS.novi} />
        <Field label="Heure transmission" value={data.samu.heureTransmission} onChange={(v) => set(["samu", "heureTransmission"], v)} />
        <Field label="Décision SAMU" value={data.samu.decision} onChange={(v) => set(["samu", "decision"], v)} />
        <Field label="Destination" value={data.samu.destination} onChange={(v) => set(["samu", "destination"], v)} />
        <Area label="Consignes / notifications" value={data.samu.consignes} onChange={(v) => set(["samu", "consignes"], v)} />
      </div>
    </CardBlock>
  );
}

function ResumeTab({ resume, copyResume, sendMail, printPdf, reset }) {
  return (
    <CardBlock title="Résumé copiable" icon={ClipboardList}>
      <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-3xl bg-slate-950 p-4 text-xs text-slate-50 md:text-sm">{resume}</pre>
      <div className="flex flex-wrap gap-2">
        <Button onClick={copyResume}>Copier le résumé</Button>
        <Button onClick={sendMail}>Mail texte</Button>
        <Button onClick={printPdf}>Imprimer / PDF</Button>
        <Button variant="outline" onClick={reset}>Réinitialiser</Button>
      </div>
    </CardBlock>
  );
}

export default function App() {
  const [data, setData] = useState(() => clone(INITIAL_DATA));
  const [active, setActive] = useState("depart");

  const set = (path, value) => {
    setData((prev) => {
      const next = clone(prev ?? INITIAL_DATA);
      let current = next;
      for (let i = 0; i < path.length - 1; i += 1) {
        const key = path[i];
        if (!current[key] || typeof current[key] !== "object") current[key] = {};
        current = current[key];
      }
      current[path[path.length - 1]] = value;
      return next;
    });
  };

  const updateSurveillance = (index, key, value) => {
    setData((prev) => {
      const next = clone(prev ?? INITIAL_DATA);
      if (!Array.isArray(next.surveillance)) next.surveillance = [];
      if (!next.surveillance[index]) next.surveillance[index] = { ...BLANK_SURVEILLANCE };
      next.surveillance[index][key] = value;
      return next;
    });
  };

  const addSurveillance = () => {
    setData((prev) => {
      const next = clone(prev ?? INITIAL_DATA);
      if (!Array.isArray(next.surveillance)) next.surveillance = [];
      next.surveillance.push({ ...BLANK_SURVEILLANCE });
      return next;
    });
  };

  const reset = () => setData(clone(INITIAL_DATA));
  const detresseVitale = useMemo(() => hasDetresseVitale(data), [data]);
  const resume = useMemo(() => buildResume(data), [data]);

  const copyResume = async () => {
    try {
      await navigator.clipboard.writeText(resume);
    } catch {
      window.prompt("Copier le résumé :", resume);
    }
  };

  const sendMail = () => {
    const subject = encodeURIComponent("Bilan SSUAP");
    const body = encodeURIComponent(resume);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const printPdf = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-slate-100 p-3 md:p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <AppHeader detresseVitale={detresseVitale} />
        <nav className="grid grid-cols-2 gap-2 rounded-3xl bg-white p-2 shadow-sm md:grid-cols-6">
          <TabButton id="depart" active={active} onClick={setActive}>Départ</TabButton>
          <TabButton id="primaire" active={active} onClick={setActive}>Primaire</TabButton>
          <TabButton id="secondaire" active={active} onClick={setActive}>Secondaire</TabButton>
          <TabButton id="gestes" active={active} onClick={setActive}>Gestes</TabButton>
          <TabButton id="samu" active={active} onClick={setActive}>SAMU</TabButton>
          <TabButton id="resume" active={active} onClick={setActive}>Résumé</TabButton>
        </nav>
        {active === "depart" ? <DepartTab data={data} set={set} /> : null}
        {active === "primaire" ? <PrimaireTab data={data} set={set} detresseVitale={detresseVitale} /> : null}
        {active === "secondaire" ? <SecondaireTab data={data} set={set} /> : null}
        {active === "gestes" ? <GestesTab data={data} set={set} updateSurveillance={updateSurveillance} addSurveillance={addSurveillance} /> : null}
        {active === "samu" ? <SamuTab data={data} set={set} /> : null}
        {active === "resume" ? <ResumeTab resume={resume} copyResume={copyResume} sendMail={sendMail} printPdf={printPdf} reset={reset} /> : null}
      </div>
    </main>
  );
}
