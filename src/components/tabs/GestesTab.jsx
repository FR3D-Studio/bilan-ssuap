import { HandHeart, Images, TimerReset } from "lucide-react";

import CardBlock from "../ui/CardBlock";
import Field from "../ui/Field";
import SelectField from "../ui/SelectField";
import Check from "../ui/Check";
import Button from "../ui/Button";

import { OPTIONS } from "../../data/options";

function TextAreaField({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="block space-y-1 md:col-span-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>

      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </label>
  );
}

function photoCountText(photos) {
  const count = Array.isArray(photos) ? photos.length : 0;
  return `${count} photo${count > 1 ? "s" : ""}`;
}

function PhotoInput({ onAddPhotos }) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800">
      Prendre / ajouter photo
      <input
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => {
          onAddPhotos(Array.from(e.target.files || []));
          e.target.value = "";
        }}
      />
    </label>
  );
}

function PhotosBlock({ photos, onAddPhotos, onRemovePhoto }) {
  return (
    <CardBlock title="Photos intervention" icon={Images} tone="slate">
      <div className="space-y-3">
        <div className="rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-900">
          Photos conservées localement dans le bilan en cours. Attention aux
          données personnelles et médicales.
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <PhotoInput onAddPhotos={onAddPhotos} />
          <span className="text-sm font-semibold text-slate-700">
            {photoCountText(photos)}
          </span>
        </div>

        {photos.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
              >
                <img
                  src={photo.dataUrl}
                  alt={photo.name || "Photo intervention"}
                  className="h-48 w-full rounded-lg object-cover"
                />

                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-semibold text-slate-600">
                    {photo.name || "Photo"}
                  </span>

                  <Button
                    variant="outline"
                    onClick={() => onRemovePhoto(photo.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </CardBlock>
  );
}

export default function GestesTab({
  data,
  set,
  updateSurveillance,
  addSurveillance,
  onAddPhotos,
  onRemovePhoto,
}) {
  const surveillance = Array.isArray(data.surveillance)
    ? data.surveillance
    : [];

  return (
    <div className="space-y-4">
      <CardBlock
        title="Gestes réalisés / conditionnement"
        icon={HandHeart}
        tone="amber"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <Check
            label="DSA"
            checked={data.gestes.dsa}
            onChange={(v) => set(["gestes", "dsa"], v)}
          />

          <Field
            label="Nbrs de chocs délivré"
            type="number"
            value={data.gestes.dsaChocs}
            onChange={(v) => set(["gestes", "dsaChocs"], v)}
          />

          <Check
            label="O₂ administré"
            checked={data.gestes.oxygene}
            onChange={(v) => set(["gestes", "oxygene"], v)}
          />

          <Field
            label="Débit O₂"
            value={data.gestes.o2Debit}
            onChange={(v) => set(["gestes", "o2Debit"], v)}
          />

          <Check
            label="Immobilisation"
            checked={data.gestes.immobilisation}
            onChange={(v) => set(["gestes", "immobilisation"], v)}
          />

          <Check
            label="Pansement / protection"
            checked={data.gestes.pansement}
            onChange={(v) => set(["gestes", "pansement"], v)}
          />

          <SelectField
            label="Position"
            value={data.gestes.position}
            onChange={(v) => set(["gestes", "position"], v)}
            options={OPTIONS.position}
          />

          <Field
            label="ASU sur prescription médicale / soins réalisés"
            value={data.gestes.asu}
            onChange={(v) => set(["gestes", "asu"], v)}
            placeholder="ex : ECG, hémoglobinémie, traitement prescrit, autre soin..."
          />

          <TextAreaField
            label="Autres gestes"
            value={data.gestes.autres}
            onChange={(v) => set(["gestes", "autres"], v)}
          />
        </div>
      </CardBlock>

      <CardBlock title="Surveillance" icon={TimerReset}>
        <div className="space-y-3">
          {surveillance.map((s, i) => (
            <div
              key={`surveillance-${i}`}
              className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-3 lg:grid-cols-9"
            >
              <Field
                label="Heure"
                type="time"
                value={s?.heure}
                onChange={(v) => updateSurveillance(i, "heure", v)}
              />
              <Field
                label="FR"
                value={s?.fr}
                onChange={(v) => updateSurveillance(i, "fr", v)}
              />
              <Field
                label="SpO₂"
                value={s?.spo2}
                onChange={(v) => updateSurveillance(i, "spo2", v)}
              />
              <Field
                label="FC"
                value={s?.fc}
                onChange={(v) => updateSurveillance(i, "fc", v)}
              />
              <div className="grid gap-2 md:col-span-2 md:grid-cols-2">
                <Field
                  label="TA gauche"
                  value={s?.taGauche ?? s?.ta}
                  onChange={(v) => updateSurveillance(i, "taGauche", v)}
                />
                <Field
                  label="TA droite"
                  value={s?.taDroite}
                  onChange={(v) => updateSurveillance(i, "taDroite", v)}
                />
              </div>
              <Field
                label="Glasgow"
                value={s?.glasgow}
                onChange={(v) => updateSurveillance(i, "glasgow", v)}
                />
              <Field
                label="EVN"
                value={s?.evn || data.secondaire?.pqrstS}
                onChange={(v) => updateSurveillance(i, "evn", v)}
              />
              <Field
                label="Notes"
                value={s?.notes}
                onChange={(v) => updateSurveillance(i, "notes", v)}
              />
            </div>
          ))}

          <Button onClick={addSurveillance}>Ajouter une surveillance</Button>
        </div>
      </CardBlock>

      <PhotosBlock
        photos={data.photos || []}
        onAddPhotos={onAddPhotos}
        onRemovePhoto={onRemovePhoto}
      />
    </div>
  );
}
