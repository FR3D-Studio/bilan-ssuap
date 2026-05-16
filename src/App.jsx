import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { INITIAL_DATA, BLANK_SURVEILLANCE } from "./data/initialData";
import Badge from "./components/ui/Badge";
import ResumeTab from "./components/tabs/ResumeTab";
import SamuTab from "./components/tabs/SamuTab";
import DepartTab from "./components/tabs/DepartTab";
import PrimaireTab from "./components/tabs/PrimaireTab";
import SecondaireTab from "./components/tabs/SecondaireTab";
import GestesTab from "./components/tabs/GestesTab";
import LiaisonSdisTab from "./components/tabs/LiaisonSdisTab";
import {
  getScore,
  calculateGlasgow,
  calculateMalinas,
  calculateWallace,
  isFastPositive,
  isRespiratoryDistressQuality,
  hasDetresseVitale,
} from "./utils/scores";

const txt = (value) => (value === null || value === undefined ? "" : String(value));
const yesNo = (value) => (value ? "OUI" : "NON");
const clone = (value) => JSON.parse(JSON.stringify(value));

function normalizeNovi(value) {
  const raw = txt(value).trim();
  if (raw.includes("Urgence absolue")) return "Urgence absolue";
  if (raw.includes("Urgence relative")) return "Urgence relative";
  if (raw.includes("Impliqué")) return "Impliqué / indemne";
  if (raw.includes("Décédé")) return "Décédé";
  return raw || "Non concerné";
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
    `Glycémie ${txt(s.glycemie)}, T° ${txt(s.temperature)}, EVN ${txt(s.evn)}, FAST ${isFastPositive(s) ? "positif" : "négatif/non retrouvé"}, Heure début symptômes ${txt(s.fastTime)}`,
    `Malinas ${calculateMalinas(s)}, Wallace ${calculateWallace(s)}%`,
    "",
    "GESTES",
    `O₂ ${yesNo(g.oxygene)} débit ${txt(g.o2Debit)}, position ${txt(g.position)}, immobilisation ${yesNo(g.immobilisation)}, pansement ${yesNo(g.pansement)}, ASU ${txt(g.asu)}, autres ${txt(g.autres)}`,
    "",
    "SAMU",
    `Tri NOVI ${normalizeNovi(samu.couleur)}, heure transmission ${txt(samu.heureTransmission)}, décision ${txt(samu.decision)}, destination ${txt(samu.destination)}, consignes ${txt(samu.consignes)}`,
    `Photos jointes localement : ${photoCountText(d.photos)}`,
    "",
    "SURVEILLANCE",
    surveillanceText,
  ].join("\n");
}

function photoCountText(photos) {
  const count = Array.isArray(photos) ? photos.length : 0;
  return `${count} photo${count > 1 ? "s" : ""}`;
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
  console.assert(photoCountText([{ id: 1 }, { id: 2 }]) === "2 photos", "Compteur photos OK");
  console.assert(isRespiratoryDistressQuality("Absente") === true, "Respiration absente = détresse respiratoire");
  console.assert(isRespiratoryDistressQuality("Gasp") === true, "Gasp = détresse respiratoire");
  console.assert(isRespiratoryDistressQuality("Normale") === false, "Respiration normale non automatique");
  console.assert("Non perçu" === "Non perçu", "Pouls non perçu = détresse circulatoire automatique");
}
runSelfTests();

function TabButton({ id, active, onClick, completed, children }) {
  const activeClasses = active === id
    ? "bg-slate-950 text-white"
    : completed
      ? "bg-emerald-600 text-white hover:bg-emerald-700"
      : "bg-white text-slate-700 hover:bg-slate-100";

  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${activeClasses}`}
    >
      {children}
      {completed ? <span className="ml-2">✓</span> : null}
    </button>
  );
}

function hasUserData(value, initialValue) {
  if (value === null || value === undefined) return false;

  if (typeof value === "boolean") {
    return value !== Boolean(initialValue);
  }

  if (typeof value === "number") {
    return value !== initialValue;
  }

  if (typeof value === "string") {
    const current = value.trim();
    const initial = typeof initialValue === "string" ? initialValue.trim() : "";
    return current.length > 0 && current !== initial;
  }

  if (Array.isArray(value)) {
    const initialArray = Array.isArray(initialValue) ? initialValue : [];

    if (value.length !== initialArray.length) {
      return value.some((item) => hasUserData(item, undefined));
    }

    return value.some((item, index) => hasUserData(item, initialArray[index]));
  }

  if (typeof value === "object") {
    const initialObject = initialValue && typeof initialValue === "object" ? initialValue : {};
    return Object.keys(value).some((key) => hasUserData(value[key], initialObject[key]));
  }

  return false;
}

const TAB_ORDER = [
  { id: "depart", label: "Départ" },
  { id: "primaire", label: "Primaire" },
  { id: "secondaire", label: "Secondaire" },
  { id: "gestes", label: "Gestes" },
  { id: "samu", label: "SAMU" },
  { id: "liaison", label: "Liaison SDIS" },
  { id: "resume", label: "Résumé" },
];

function getTabCompletion(data) {
  return {
    depart:
      hasUserData(data.intervention, INITIAL_DATA.intervention) ||
      hasUserData(data.identite, INITIAL_DATA.identite) ||
      hasUserData(data.circonstanciel, INITIAL_DATA.circonstanciel),
    primaire: hasUserData(data.primaire, INITIAL_DATA.primaire),
    secondaire: hasUserData(data.secondaire, INITIAL_DATA.secondaire),
    gestes:
      hasUserData(data.gestes, INITIAL_DATA.gestes) ||
      hasUserData(data.surveillance, INITIAL_DATA.surveillance) ||
      hasUserData(data.photos, INITIAL_DATA.photos),
    samu: hasUserData(data.samu, INITIAL_DATA.samu),
    liaison: hasUserData(data.aeronautique, INITIAL_DATA.aeronautique),
    resume: false,
  };
}

function BottomTabNavigation({ active, setActive }) {
  const currentIndex = TAB_ORDER.findIndex((tab) => tab.id === active);
  const previousTab = currentIndex > 0 ? TAB_ORDER[currentIndex - 1] : null;
  const nextTab = currentIndex >= 0 && currentIndex < TAB_ORDER.length - 1 ? TAB_ORDER[currentIndex + 1] : null;

  return (
    <div className="sticky bottom-3 z-20 mt-4 flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
      <button
        type="button"
        disabled={!previousTab}
        onClick={() => previousTab && setActive(previousTab.id)}
        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← {previousTab ? previousTab.label : "Début"}
      </button>

      <div className="text-center text-xs font-bold text-slate-500">
        Navigation rapide
      </div>

      <button
        type="button"
        disabled={!nextTab}
        onClick={() => nextTab && setActive(nextTab.id)}
        className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        {nextTab ? nextTab.label : "Fin"} →
      </button>
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

  const addPhotos = (files) => {
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        setData((prev) => {
          const next = clone(prev ?? INITIAL_DATA);
          if (!Array.isArray(next.photos)) next.photos = [];
          next.photos.push({
            id: `${Date.now()}-${Math.random()}`,
            name: file.name,
            dataUrl: String(reader.result || ""),
          });
          return next;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id) => {
    setData((prev) => {
      const next = clone(prev ?? INITIAL_DATA);
      next.photos = Array.isArray(next.photos) ? next.photos.filter((photo) => photo.id !== id) : [];
      return next;
    });
  };

  const reset = () => setData(clone(INITIAL_DATA));
  const detresseVitale = useMemo(() => hasDetresseVitale(data), [data]);
  const resume = useMemo(() => buildResume(data), [data]);
  const tabCompletion = useMemo(() => getTabCompletion(data), [data]);

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
        <nav className="grid grid-cols-2 gap-2 rounded-3xl bg-white p-2 shadow-sm md:grid-cols-4 lg:grid-cols-7">
          {TAB_ORDER.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              active={active}
              onClick={setActive}
              completed={tabCompletion[tab.id]}
            >
              {tab.label}
            </TabButton>
          ))}
        </nav>
        {active === "depart" ? <DepartTab data={data} set={set} /> : null}
        {active === "primaire" ? <PrimaireTab data={data} set={set} detresseVitale={detresseVitale} /> : null}
        {active === "secondaire" ? <SecondaireTab data={data} set={set} /> : null}
        {active === "gestes" ? <GestesTab data={data} set={set} updateSurveillance={updateSurveillance} addSurveillance={addSurveillance} onAddPhotos={addPhotos} onRemovePhoto={removePhoto} /> : null}
        {active === "samu" ? <SamuTab data={data} set={set} /> : null}
        {active === "liaison" ? <LiaisonSdisTab data={data} set={set} /> : null}
        {active === "resume" ? <ResumeTab resume={resume} copyResume={copyResume} sendMail={sendMail} printPdf={printPdf} reset={reset} /> : null}
        <BottomTabNavigation active={active} setActive={setActive} />
      </div>
    </main>
  );
}
