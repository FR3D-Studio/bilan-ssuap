import { ClipboardList, ShieldCheck, FileText } from "lucide-react";

import CardBlock from "../ui/CardBlock";
import Field from "../ui/Field";
import SelectField from "../ui/SelectField";
import Check from "../ui/Check";

import { OPTIONS } from "../../data/options";

function TextAreaField({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="block space-y-1 md:col-span-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>

      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </label>
  );
}

export default function DepartTab({ data, set }) {
  return (
    <div className="space-y-4">
      <CardBlock title="1. Intervention" icon={ShieldCheck} tone="blue">
        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label="Date / heure"
            value={data.intervention.dateHeure}
            onChange={(v) => set(["intervention", "dateHeure"], v)}
          />

          <Field
            label="Adresse"
            value={data.intervention.adresse}
            onChange={(v) => set(["intervention", "adresse"], v)}
          />

          <Field
            label="Nature d’intervention"
            value={data.intervention.nature}
            onChange={(v) => set(["intervention", "nature"], v)}
          />

          <Field
            label="Renforts demandés / présents"
            value={data.intervention.renforts}
            onChange={(v) => set(["intervention", "renforts"], v)}
          />

          <TextAreaField
            label="Dangers / contexte"
            value={data.intervention.dangers}
            onChange={(v) => set(["intervention", "dangers"], v)}
            placeholder="Dangers, accès, environnement, risques particuliers..."
          />
        </div>
      </CardBlock>

      <CardBlock title="2. Identification" icon={ClipboardList} tone="slate">
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
            label="Sexe"
            value={data.identite.sexe}
            onChange={(v) => set(["identite", "sexe"], v)}
          />

          <Field
            label="Nationalité"
            value={data.identite.nationalite}
            onChange={(v) => set(["identite", "nationalite"], v)}
          />

          <SelectField
            label="Type"
            value={data.identite.victime}
            onChange={(v) => set(["identite", "victime"], v)}
            options={OPTIONS.typeVictime}
          />

          <div className="space-y-3">
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
          </div>

          <TextAreaField
            label="Plainte principale"
            value={data.circonstanciel.plainte}
            onChange={(v) => set(["circonstanciel", "plainte"], v)}
            placeholder="Motif principal, douleur, gêne, symptôme exprimé..."
          />
        </div>
      </CardBlock>

      <CardBlock title="3. Circonstanciel" icon={FileText} tone="amber">
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

          <Check
            label="Sécurité réalisée"
            checked={data.intervention.securite}
            onChange={(v) => set(["intervention", "securite"], v)}
          />
        </div>
      </CardBlock>
    </div>
  );
}