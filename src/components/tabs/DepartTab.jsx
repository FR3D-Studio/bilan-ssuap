import { MapPinned, ScrollText, UserRound } from "lucide-react";

import CardBlock from "../ui/CardBlock";
import Field from "../ui/Field";
import SelectField from "../ui/SelectField";

import { OPTIONS } from "../../data/options";

function splitDateTime(value) {
  const [date = "", time = ""] = String(value || "").split("T");

  return {
    date,
    time: time.slice(0, 5),
  };
}

function mergeDateTime(currentValue, key, nextValue) {
  const current = splitDateTime(currentValue);
  const next = {
    ...current,
    [key]: nextValue,
  };

  if (!next.date && !next.time) return "";
  if (!next.date) return next.time;
  if (!next.time) return next.date;

  return `${next.date}T${next.time}`;
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder = "",
  small = false,
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>

      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
          small ? "min-h-24" : "min-h-28"
        }`}
      />
    </label>
  );
}

export default function DepartTab({ data, set }) {
  const interventionDateTime = splitDateTime(data.intervention.dateHeure);

  return (
    <div className="space-y-4">
      <CardBlock title="1. Intervention" icon={MapPinned} tone="blue">
        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label="Date"
            type="date"
            value={interventionDateTime.date}
            onChange={(v) =>
              set(
                ["intervention", "dateHeure"],
                mergeDateTime(data.intervention.dateHeure, "date", v)
              )
            }
          />

          <Field
            label="Heure"
            type="time"
            value={interventionDateTime.time}
            onChange={(v) =>
              set(
                ["intervention", "dateHeure"],
                mergeDateTime(data.intervention.dateHeure, "time", v)
              )
            }
          />

          <Field
            label="Lieu d'intervention"
            value={data.intervention.lieu}
            onChange={(v) => set(["intervention", "lieu"], v)}
            placeholder="Terminal, piste, avion, porte..."
          />

          <SelectField
            label="Nature d’intervention"
            value={data.intervention.nature}
            onChange={(v) => set(["intervention", "nature"], v)}
            options={OPTIONS.typeVictime}
          />

          <Field
            label="Renforts demandés / présents"
            value={data.intervention.renforts}
            onChange={(v) => set(["intervention", "renforts"], v)}
          />

          <div className="md:col-span-2">
            <TextAreaField
              label="Dangers / contexte"
              value={data.intervention.dangers}
              onChange={(v) => set(["intervention", "dangers"], v)}
              placeholder="Dangers, accès, environnement, risques particuliers..."
            />
          </div>
        </div>
      </CardBlock>

      <CardBlock title="2. Identification" icon={UserRound} tone="slate">
        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label="Nom"
            value={data.identite.nom}
            onChange={(v) => set(["identite", "nom"], v)}
          />

          <Field
            label="Prénom"
            value={data.identite.prenom}
            onChange={(v) => set(["identite", "prenom"], v)}
          />

          <Field
            label="Âge"
            value={data.identite.age}
            onChange={(v) => set(["identite", "age"], v)}
          />

          <Field
            label="Nationalité"
            value={data.identite.nationalite}
            onChange={(v) => set(["identite", "nationalite"], v)}
          />

          <Field
            label="Sexe"
            value={data.identite.sexe}
            onChange={(v) => set(["identite", "sexe"], v)}
          />

          <TextAreaField
            label="Adresse victime"
            value={data.identite.adresse}
            onChange={(v) => set(["identite", "adresse"], v)}
            placeholder="Adresse complète..."
            small
          />

          <SelectField
            label="Nature de la victime"
            value={data.identite.natureVictime}
            onChange={(v) => set(["identite", "natureVictime"], v)}
            options={OPTIONS.natureVictime}
          />

          <Field
            label="Nom de la société"
            value={data.identite.societe}
            onChange={(v) => set(["identite", "societe"], v)}
            placeholder="Entreprise / société"
          />

          <div className="md:col-span-2">
            <TextAreaField
              label="Plainte principale"
              value={data.circonstanciel.plainte}
              onChange={(v) => set(["circonstanciel", "plainte"], v)}
              placeholder="Motif principal, douleur, gêne, symptôme exprimé..."
            />
          </div>
        </div>
      </CardBlock>

      <CardBlock title="3. Circonstanciel" icon={ScrollText} tone="amber">
        <div className="grid gap-3 md:grid-cols-2">
          <TextAreaField
            label="Circonstances"
            value={data.circonstanciel.circonstances}
            onChange={(v) => set(["circonstanciel", "circonstances"], v)}
            placeholder="Déroulé des faits, mécanisme, contexte..."
          />

          <TextAreaField
            label="Gestes déjà réalisés par témoins"
            value={data.circonstanciel.gestesTemoins}
            onChange={(v) => set(["circonstanciel", "gestesTemoins"], v)}
            placeholder="Gestes effectués avant arrivée, consignes données, premiers secours..."
          />

        </div>
      </CardBlock>
    </div>
  );
}
