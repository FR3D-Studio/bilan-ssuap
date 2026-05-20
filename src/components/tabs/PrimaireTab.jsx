import { AlertTriangle, HeartPulse } from "lucide-react";

import CardBlock from "../ui/CardBlock";
import Field from "../ui/Field";
import SelectField from "../ui/SelectField";
import Check from "../ui/Check";

import { OPTIONS, GLASGOW } from "../../data/options";

import {
  calculateGlasgow,
  isRespiratoryDistressQuality,
} from "../../utils/scores";

function ScoreCard({ title, value, danger, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-base font-black text-slate-950">{title}</h3>
      {children}
      <div
        className={`mt-3 rounded-lg p-3 text-center text-xl font-black text-white sm:text-2xl ${
          danger ? "bg-red-600" : "bg-slate-950"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default function PrimaireTab({ data, set, detresseVitale }) {
  const glasgow = calculateGlasgow(data);

  return (
    <CardBlock title="Bilan primaire XABCDE" icon={HeartPulse} tone="red">
      <div className="grid gap-3 md:grid-cols-2">
        <Check
          label="X : hémorragie externe grave"
          checked={data.primaire.xHemorragie}
          onChange={(v) => set(["primaire", "xHemorragie"], v)}
        />

        <Field
          label="X : action réalisée"
          value={data.primaire.xAction}
          onChange={(v) => set(["primaire", "xAction"], v)}
          placeholder="compression, pansement, garrot..."
        />

        <Check
          label="A : suspicion rachis / stabilisation"
          checked={data.primaire.aRachis}
          onChange={(v) => set(["primaire", "aRachis"], v)}
        />

        <SelectField
          label="A : voies aériennes"
          value={data.primaire.aVA}
          onChange={(v) => set(["primaire", "aVA"], v)}
          options={OPTIONS.voiesAeriennes}
        />

        <Check
          label={
            data.primaire.bDetresse
              ? "B : détresse respiratoire / Appel SAMU immédiat"
              : "B : détresse respiratoire"
          }
          checked={data.primaire.bDetresse}
          danger={data.primaire.bDetresse}
          onChange={(v) => set(["primaire", "bDetresse"], v)}
        />

        <SelectField
          label="B : qualité respiration"
          value={data.primaire.bQualite}
          danger={isRespiratoryDistressQuality(data.primaire.bQualite)}
          onChange={(v) => {
            set(["primaire", "bQualite"], v);
            set(
              ["primaire", "bDetresse"],
              isRespiratoryDistressQuality(v)
            );
          }}
          options={OPTIONS.respiration}
        />

        <Field
          label="B : FR"
          value={data.primaire.bFR}
          onChange={(v) => set(["primaire", "bFR"], v)}
        />

        <Field
          label="B : SpO₂"
          value={data.primaire.bSpO2}
          onChange={(v) => set(["primaire", "bSpO2"], v)}
        />

        <div className="md:col-start-1">
          <Check
            label={
              data.primaire.cDetresse
                ? "C : détresse circulatoire / Appel SAMU immédiat"
                : "C : détresse circulatoire"
            }
            checked={data.primaire.cDetresse}
            danger={data.primaire.cDetresse}
            onChange={(v) => set(["primaire", "cDetresse"], v)}
          />
        </div>

        <SelectField
          label="C : pouls"
          value={data.primaire.cPouls}
          danger={data.primaire.cPouls === "Non perçu"}
          onChange={(v) => {
            set(["primaire", "cPouls"], v);
            set(["primaire", "cDetresse"], v === "Non perçu");
          }}
          options={OPTIONS.pouls}
        />

        <Field
          label="C : FC"
          value={data.primaire.cFC}
          onChange={(v) => set(["primaire", "cFC"], v)}
        />

        <Field
          label="C : TRC"
          value={data.primaire.cTRC}
          onChange={(v) => set(["primaire", "cTRC"], v)}
        />

        <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
          <Field
            label="C : TA gauche"
            value={data.primaire.cTAGauche}
            onChange={(v) => set(["primaire", "cTAGauche"], v)}
          />

          <Field
            label="C : TA droite"
            value={data.primaire.cTADroite}
            onChange={(v) => set(["primaire", "cTADroite"], v)}
          />
        </div>

        <div className="md:col-span-2">
          <ScoreCard
            title="Score de Glasgow"
            value={`Glasgow total : ${glasgow}`}
            danger={glasgow >= 3 && glasgow <= 7}
          >
            <div className="grid gap-3 md:grid-cols-3">
              <SelectField
                label="Ouverture des yeux"
                value={data.primaire.glasgowYeux}
                onChange={(v) => set(["primaire", "glasgowYeux"], v)}
                options={GLASGOW.eyes}
              />

              <SelectField
                label="Réponse verbale"
                value={data.primaire.glasgowVerbal}
                onChange={(v) =>
                  set(["primaire", "glasgowVerbal"], v)
                }
                options={GLASGOW.verbal}
              />

              <SelectField
                label="Réponse motrice"
                value={data.primaire.glasgowMoteur}
                onChange={(v) =>
                  set(["primaire", "glasgowMoteur"], v)
                }
                options={GLASGOW.motor}
              />
            </div>

            {glasgow >= 3 && glasgow <= 7 ? (
              <div className="mt-3 rounded-lg bg-red-100 p-3 text-center font-bold text-red-800">
                <AlertTriangle className="mr-2 inline h-5 w-5" />
                Glasgow 3 à 7 : avis médical urgent
              </div>
            ) : null}
          </ScoreCard>
        </div>

        <SelectField
          label="D : conscience"
          value={data.primaire.dConscience}
          onChange={(v) => set(["primaire", "dConscience"], v)}
          options={OPTIONS.conscience}
        />

        <label className="block space-y-1 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">
            D : signes neurologiques
          </span>
          <textarea
            value={data.primaire.dNeuro ?? ""}
            onChange={(e) =>
              set(["primaire", "dNeuro"], e.target.value)
            }
            className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <label className="block space-y-1 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">
            E : lésions / exposition
          </span>
          <textarea
            value={data.primaire.eLesions ?? ""}
            onChange={(e) =>
              set(["primaire", "eLesions"], e.target.value)
            }
            className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </label>
      </div>

      {detresseVitale ? (
        <div className="mt-4 rounded-lg bg-red-600 p-3 font-semibold text-white">
          <AlertTriangle className="mr-2 inline h-5 w-5" />
          Transmission urgente SAMU / bilan rouge à envisager selon procédure.
        </div>
      ) : null}
    </CardBlock>
  );
}
