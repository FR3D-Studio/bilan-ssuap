import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Activity,
  FileDown,
  HandHeart,
  HeartPulse,
  MapPinned,
  Radio,
  Route,
} from "lucide-react";

import logoMedifire from "./assets/logo-medifire.png";

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
  calculateGlasgow,
  calculateMalinas,
  calculateWallace,
  hasDetresseVitale,
  isFastPositive,
} from "./utils/scores";

const txt = (value) =>
  value === null || value === undefined ? "" : String(value);

const yesNo = (value) => (value ? "OUI" : "NON");

const clone = (value) => JSON.parse(JSON.stringify(value));

function formatDateTime(value) {
  const raw = txt(value);
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);

  if (!match) {
    const dateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (dateOnly) {
      const [, year, month, day] = dateOnly;

      return `${day}/${month}/${year}`;
    }

    return raw;
  }

  const [, year, month, day, hour, minute] = match;

  return `${day}/${month}/${year} ${hour}:${minute}`;
}

function getCurrentDateTimeValue() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;

  return new Date(now.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
}

function formatTime(value) {
  const raw = txt(value);
  const match = raw.match(/^(\d{2}):(\d{2})/);

  if (!match) return raw;

  return `${match[1]}:${match[2]}`;
}

function formatTa(gauche, droite, fallback = "") {
  const taGauche = txt(gauche);
  const taDroite = txt(droite);

  if (taGauche || taDroite) {
    return `G ${taGauche || "-"} / D ${taDroite || "-"}`;
  }

  return txt(fallback);
}

function normalizeNovi(value) {
  const raw = txt(value).trim();

  if (raw.includes("Urgence absolue")) return "Urgence absolue";
  if (raw.includes("Urgence relative")) return "Urgence relative";
  if (raw.includes("Impliqué")) return "Impliqué / indemne";
  if (raw.includes("Décédé")) return "Décédé";

  return raw || "Non concerné";
}

function photoCountText(photos) {
  const count = Array.isArray(photos) ? photos.length : 0;

  return `${count} photo${count > 1 ? "s" : ""}`;
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
    const initialObject =
      initialValue && typeof initialValue === "object" ? initialValue : {};

    return Object.keys(value).some((key) =>
      hasUserData(value[key], initialObject[key])
    );
  }

  return false;
}

function getTabCompletion(data) {
  const interventionWithoutAutoDate = {
    ...data.intervention,
    dateHeure: INITIAL_DATA.intervention.dateHeure,
  };

  return {
    depart:
      hasUserData(
        interventionWithoutAutoDate,
        INITIAL_DATA.intervention
      ) ||
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

function buildResume(data) {
  const d = data ?? clone(INITIAL_DATA);
  const i = d.intervention ?? {};
  const id = d.identite ?? {};
  const c = d.circonstanciel ?? {};
  const p = d.primaire ?? {};
  const s = d.secondaire ?? {};
  const g = d.gestes ?? {};
  const samu = d.samu ?? {};
  const surveillance = Array.isArray(d.surveillance)
    ? d.surveillance
    : [];

  const surveillanceText = surveillance.length
    ? surveillance
        .map((x, index) =>
          `${index + 1}. ${formatTime(x?.heure)} FR ${txt(x?.fr)} SpO2 ${txt(
            x?.spo2
          )} FC ${txt(x?.fc)} TA ${formatTa(
            x?.taGauche,
            x?.taDroite,
            x?.ta
          )} Glasgow ${txt(x?.glasgow)} EVN ${txt(
            x?.evn || s.pqrstS
          )} ${txt(x?.notes)}`.trim()
        )
        .join("\n")
    : "Aucune surveillance renseignée";

  return [
    "BILAN VICTIME",
    "",
    "INTERVENTION",
    `Date/heure : ${formatDateTime(i.dateHeure)}`,
    `Lieu intervention : ${txt(i.lieu)}`,
    `Nature : ${txt(i.nature)}`,
    `Dangers/contexte : ${txt(i.dangers)}`,
    `Renforts : ${txt(i.renforts)}`,
    "",
    "IDENTITÉ",
    `Nom : ${txt(id.nom)}`,
    `Prénom : ${txt(id.prenom)}`,
    `Âge : ${txt(id.age)}`,
    `Sexe : ${txt(id.sexe)}`,
    `Adresse victime : ${txt(id.adresse)}`,
    `Nature victime : ${txt(id.natureVictime)}`,
    `Société : ${txt(id.societe)}`,
    `Nationalité : ${txt(id.nationalite)}`,
    "",
    "CIRCONSTANCES",
    txt(c.circonstances),
    `Plainte : ${txt(c.plainte)}`,
    `Gestes témoins : ${txt(c.gestesTemoins)}`,
    "",
    "PRIMAIRE XABCDE",
    `X hémorragie : ${yesNo(p.xHemorragie)} ${txt(p.xAction)}`,
    `A voies aériennes : ${txt(p.aVA)} / suspicion rachis : ${yesNo(
      p.aRachis
    )}`,
    `B respiration : ${txt(p.bQualite)}, FR ${txt(p.bFR)}, SpO2 ${txt(
      p.bSpO2
    )}, détresse ${yesNo(p.bDetresse)}`,
    `C circulation : pouls ${txt(p.cPouls)}, FC ${txt(p.cFC)}, TA ${formatTa(
      p.cTAGauche,
      p.cTADroite,
      p.cTA
    )}, TRC ${txt(p.cTRC)}, détresse ${yesNo(p.cDetresse)}`,
    `D neurologique : Glasgow ${calculateGlasgow(d)}, conscience ${txt(
      p.dConscience
    )}, signes ${txt(p.dNeuro)}`,
    `E lésions : ${txt(p.eLesions)}`,
    "",
    "SECONDAIRE",
    `PQRST : P ${txt(s.pqrstP)} / Q ${txt(s.pqrstQ)} / R ${txt(
      s.pqrstR
    )} / S ${txt(s.pqrstS)} / T ${txt(s.pqrstT)}`,
    `MHTA : Maladie ${txt(s.maladie)} / Hospitalisation ${txt(
      s.hospitalisation
    )} / Traitement ${txt(s.traitement)} / Allergie ${txt(s.allergie)}`,
    `Glycémie ${txt(s.glycemie)}, T ${txt(s.temperature)}, EVN ${txt(
      s.pqrstS || s.evn
    )}, FAST ${isFastPositive(s) ? "positif" : "négatif/non retrouvé"}, Heure début symptômes ${formatTime(
      s.fastTime
    )}`,
    `Malinas ${calculateMalinas(s)}, Wallace ${calculateWallace(s)}%`,
    "",
    "GESTES",
    `O2 ${yesNo(g.oxygene)} débit ${txt(g.o2Debit)}, position ${txt(
      g.position
    )}, immobilisation ${yesNo(g.immobilisation)}, pansement ${yesNo(
      g.pansement
    )}, DSA ${yesNo(g.dsa)}, chocs délivrés ${txt(
      g.dsaChocs
    )}, ASU ${txt(g.asu)}, autres ${txt(g.autres)}`,
    "",
    "SAMU",
    `Tri NOVI ${normalizeNovi(samu.couleur)}, heure transmission ${formatTime(
      samu.heureTransmission
    )}, décision ${txt(samu.decision)}, destination ${txt(
      samu.destination
    )}, vecteur ${txt(samu.vecteur)}, consignes ${txt(samu.consignes)}`,
    `Photos jointes localement : ${photoCountText(d.photos)}`,
    "",
    "SURVEILLANCE",
    surveillanceText,
  ].join("\n");
}

const TAB_ORDER = [
  {
    id: "depart",
    label: "Départ",
    icon: MapPinned,
    idleClass: "text-sky-700 hover:bg-sky-50",
    iconClass: "bg-sky-100 text-sky-700",
  },
  {
    id: "primaire",
    label: "Primaire",
    icon: HeartPulse,
    idleClass: "text-red-700 hover:bg-red-50",
    iconClass: "bg-red-100 text-red-700",
  },
  {
    id: "secondaire",
    label: "Secondaire",
    icon: Activity,
    idleClass: "text-emerald-700 hover:bg-emerald-50",
    iconClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "gestes",
    label: "ASU",
    icon: HandHeart,
    idleClass: "text-amber-700 hover:bg-amber-50",
    iconClass: "bg-amber-100 text-amber-700",
  },
  {
    id: "samu",
    label: "SAMU",
    icon: Radio,
    idleClass: "text-indigo-700 hover:bg-indigo-50",
    iconClass: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "liaison",
    label: "Liaison SDIS",
    icon: Route,
    idleClass: "text-violet-700 hover:bg-violet-50",
    iconClass: "bg-violet-100 text-violet-700",
  },
  {
    id: "resume",
    label: "Résumé",
    icon: FileDown,
    idleClass: "text-slate-700 hover:bg-slate-100",
    iconClass: "bg-slate-100 text-slate-700",
  },
];

function AppHeader({ detresseVitale }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#002B67] via-[#003C8F] to-[#071D49] p-4 text-white shadow-2xl shadow-blue-950/25 sm:p-5"
    >
      <div className="grid items-center gap-4 md:grid-cols-[96px_1fr_96px]">
        <div className="flex justify-start">
          <img
            src={logoMedifire}
            alt="Logo MédiFIRE"
            className="h-20 w-20 shrink-0 rounded-2xl bg-white object-contain p-1 shadow-lg ring-1 ring-white/30 sm:h-24 sm:w-24"
          />
        </div>

        <div className="min-w-0 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-100 sm:text-xs">
            RFFS
          </div>

          <h1 className="mt-1 text-4xl font-black leading-none tracking-tight sm:text-5xl">
            <span className="text-white">Médi</span>
            <span className="text-red-500">FIRE</span>
          </h1>

          <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-100 sm:text-sm">
            SSUAP opérationnel
          </p>
        </div>

        <div />
      </div>

      <p className="mx-auto mt-4 max-w-none rounded-2xl border border-white/15 bg-white/10 p-3 text-center text-[11px] font-medium leading-relaxed text-blue-50 backdrop-blur sm:whitespace-nowrap sm:text-xs">
        Outil d’aide à la structuration du bilan. La décision opérationnelle
        et médicale relève des procédures en vigueur, du CA et de la
        régulation SAMU.
      </p>

      <div className="mt-3 flex justify-center">
        <Badge color={detresseVitale ? "red" : "green"} danger={detresseVitale}>
          {detresseVitale
            ? "Détresse vitale potentielle"
            : "Aucune détresse vitale"}
        </Badge>
      </div>
    </motion.header>
  );
}

function BottomTabNavigation({ active, setActive }) {
  const currentIndex = TAB_ORDER.findIndex((tab) => tab.id === active);

  const previousTab =
    currentIndex > 0 ? TAB_ORDER[currentIndex - 1] : null;

  const nextTab =
    currentIndex >= 0 && currentIndex < TAB_ORDER.length - 1
      ? TAB_ORDER[currentIndex + 1]
      : null;

  const currentTab = TAB_ORDER[currentIndex];

  return (
    <div className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-30 rounded-2xl border border-blue-950/10 bg-[#002B67]/95 p-2 shadow-2xl shadow-blue-950/30 backdrop-blur lg:sticky lg:inset-auto lg:bottom-3 lg:mt-4 lg:p-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={!previousTab}
          onClick={() => previousTab && setActive(previousTab.id)}
          className="min-h-11 flex-1 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-black text-white transition hover:bg-white/20 disabled:opacity-30 sm:flex-none sm:px-4"
        >
          <span className="sm:hidden">← {previousTab ? "Préc." : "Début"}</span>
          <span className="hidden sm:inline">
            ← {previousTab ? previousTab.label : "Début"}
          </span>
        </button>

        <div className="hidden text-center text-xs font-black uppercase tracking-[0.18em] text-blue-100 sm:block">
          {currentTab?.label || "Navigation"}
        </div>

        <button
          type="button"
          disabled={!nextTab}
          onClick={() => nextTab && setActive(nextTab.id)}
          className="min-h-11 flex-1 rounded-xl bg-white px-3 py-2.5 text-sm font-black text-[#003C8F] shadow-sm transition hover:bg-blue-50 disabled:opacity-30 sm:flex-none sm:px-4"
        >
          <span className="sm:hidden">{nextTab ? "Suiv." : "Fin"} →</span>
          <span className="hidden sm:inline">
            {nextTab ? nextTab.label : "Fin"} →
          </span>
        </button>
      </div>

      <div className="mt-1 text-center text-[10px] font-semibold text-blue-100/80">
        © 2026 FR3D-Studio
      </div>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(() => ({
    ...clone(INITIAL_DATA),
    intervention: {
      ...clone(INITIAL_DATA.intervention),
      dateHeure: getCurrentDateTimeValue(),
    },
  }));
  const [active, setActive] = useState("depart");

  const set = (path, value) => {
    setData((prev) => {
      const next = clone(prev ?? INITIAL_DATA);

      let current = next;

      for (let i = 0; i < path.length - 1; i += 1) {
        const key = path[i];

        if (!current[key] || typeof current[key] !== "object") {
          current[key] = {};
        }

        current = current[key];
      }

      current[path[path.length - 1]] = value;

      return next;
    });
  };

  const updateSurveillance = (index, key, value) => {
    setData((prev) => {
      const next = clone(prev ?? INITIAL_DATA);

      if (!Array.isArray(next.surveillance)) {
        next.surveillance = [];
      }

      if (!next.surveillance[index]) {
        next.surveillance[index] = { ...BLANK_SURVEILLANCE };
      }

      next.surveillance[index][key] = value;

      return next;
    });
  };

  const addSurveillance = () => {
    setData((prev) => {
      const next = clone(prev ?? INITIAL_DATA);

      if (!Array.isArray(next.surveillance)) {
        next.surveillance = [];
      }

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

          if (!Array.isArray(next.photos)) {
            next.photos = [];
          }

          next.photos.push({
            id:
              typeof crypto !== "undefined" && crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`,
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

      next.photos = Array.isArray(next.photos)
        ? next.photos.filter((photo) => photo.id !== id)
        : [];

      return next;
    });
  };

  const reset = () =>
    setData({
      ...clone(INITIAL_DATA),
      intervention: {
        ...clone(INITIAL_DATA.intervention),
        dateHeure: getCurrentDateTimeValue(),
      },
    });

  const detresseVitale = useMemo(
    () => hasDetresseVitale(data),
    [data]
  );

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
    <main className="min-h-screen bg-gradient-to-b from-[#F6FAFF] via-[#EAF1FB] to-[#F8FAFC] p-3 pb-24 md:p-6 lg:pb-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <AppHeader detresseVitale={detresseVitale} />

        <nav className="sticky top-2 z-20 grid auto-cols-max grid-flow-col gap-2 overflow-x-auto rounded-2xl border border-white/70 bg-white/85 p-2 shadow-xl shadow-blue-950/5 backdrop-blur lg:grid-flow-col lg:grid-cols-7">
          {TAB_ORDER.map((tab) => {
            const Icon = tab.icon;
            const completed = tabCompletion[tab.id];

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`
                  flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-xl px-4 py-3 text-left text-base font-black transition lg:w-full
                  ${
                    active === tab.id
                      ? "bg-[#003C8F] text-white shadow-lg shadow-blue-900/25"
                      : completed
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                        : `bg-transparent ${tab.idleClass}`
                  }
                `}
              >
                <span
                  className={`
                    flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                    ${
                      active === tab.id || completed
                        ? "bg-white/20"
                        : tab.iconClass
                    }
                  `}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.35} />
                </span>

                <span className="whitespace-nowrap leading-none">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        <section className="min-w-0 space-y-4">
            {active === "depart" ? (
              <DepartTab data={data} set={set} />
            ) : null}

            {active === "primaire" ? (
              <PrimaireTab
                data={data}
                set={set}
                detresseVitale={detresseVitale}
              />
            ) : null}

            {active === "secondaire" ? (
              <SecondaireTab data={data} set={set} />
            ) : null}

            {active === "gestes" ? (
              <GestesTab
                data={data}
                set={set}
                updateSurveillance={updateSurveillance}
                addSurveillance={addSurveillance}
                onAddPhotos={addPhotos}
                onRemovePhoto={removePhoto}
              />
            ) : null}

            {active === "samu" ? (
              <SamuTab data={data} set={set} />
            ) : null}

            {active === "liaison" ? (
              <LiaisonSdisTab data={data} set={set} />
            ) : null}

            {active === "resume" ? (
              <ResumeTab
                resume={resume}
                copyResume={copyResume}
                sendMail={sendMail}
                printPdf={printPdf}
                reset={reset}
              />
            ) : null}

            <BottomTabNavigation
              active={active}
              setActive={setActive}
            />
        </section>

      </div>
    </main>
  );
}
