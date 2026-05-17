import { useRef, useState } from "react";
import { Download, Radio } from "lucide-react";

import CardBlock from "../ui/CardBlock";
import Field from "../ui/Field";
import SelectField from "../ui/SelectField";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

import { OPTIONS } from "../../data/options";
import { downloadElementAsPdf } from "../../utils/pdfExport";

const txt = (value) =>
  value === null || value === undefined ? "" : String(value);

function normalizeNovi(value) {
  const raw = txt(value).trim();

  if (raw.includes("Urgence absolue")) return "Urgence absolue";
  if (raw.includes("Urgence relative")) return "Urgence relative";
  if (raw.includes("Impliqué")) return "Impliqué / indemne";
  if (raw.includes("Décédé")) return "Décédé";

  return raw || "Non concerné";
}

function NoviBadge({ value }) {
  const cleanValue = normalizeNovi(value);

  const styles = {
    "Urgence absolue": "bg-red-600 text-white border-red-700",
    "Urgence relative": "bg-yellow-400 text-slate-900 border-yellow-500",
    "Impliqué / indemne": "bg-green-600 text-white border-green-700",
    Décédé: "bg-black text-white border-black",
    "Non concerné": "bg-slate-200 text-slate-800 border-slate-300",
  };

  const dots = {
    "Urgence absolue": "Rouge",
    "Urgence relative": "Jaune",
    "Impliqué / indemne": "Vert",
    Décédé: "Noir",
    "Non concerné": "Neutre",
  };

  return (
    <div
      className={`inline-flex min-h-11 items-center gap-3 rounded-lg border px-4 py-2.5 text-sm font-black shadow-sm ${
        styles[cleanValue] || styles["Non concerné"]
      }`}
    >
      <span>{dots[cleanValue] || "Neutre"}</span>
      <span>{cleanValue}</span>
    </div>
  );
}

function PrintRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 border-b border-slate-300">
      <div className="bg-slate-100 px-2 py-1 text-[11px] font-bold">
        {label}
      </div>
      <div className="col-span-2 px-2 py-1 text-[11px]">
        {txt(value) || "-"}
      </div>
    </div>
  );
}

function PrintableRefusEvacuation({ data, pageRef }) {
  const samu = data.samu ?? {};

  return (
    <div className="print-only">
      <div ref={pageRef} className="print-page">
        <header className="mb-4 border-b-2 border-black pb-3 text-center">
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Refus d'évacuation
          </h1>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-slate-600">
            Fiche séparée - support opérationnel provisoire
          </p>
        </header>

        <section className="mb-4 border border-slate-400">
          <h2 className="bg-black px-2 py-1 text-[11px] font-black uppercase tracking-wide text-white">
            Information victime
          </h2>
          <div className="p-3 text-[12px] leading-relaxed">
            La victime reconnaît avoir été informée de la nécessité d'une prise
            en charge médicale et refuse son évacuation.
          </div>
        </section>

        <section className="mb-4 border border-slate-400">
          <h2 className="bg-black px-2 py-1 text-[11px] font-black uppercase tracking-wide text-white">
            Signatures
          </h2>
          <PrintRow label="Nom victime" value={samu.refusNomVictime} />
          <PrintRow
            label="Signature victime"
            value={samu.refusSignatureVictime}
          />
          <PrintRow label="Nom témoin 1" value={samu.refusNomTemoin1} />
          <PrintRow
            label="Signature témoin 1"
            value={samu.refusSignatureTemoin1}
          />
          <PrintRow label="Nom témoin 2" value={samu.refusNomTemoin2} />
          <PrintRow
            label="Signature témoin 2"
            value={samu.refusSignatureTemoin2}
          />
        </section>

        <section className="border border-slate-400">
          <h2 className="bg-black px-2 py-1 text-[11px] font-black uppercase tracking-wide text-white">
            Observations
          </h2>
          <div className="min-h-28 whitespace-pre-wrap px-2 py-2 text-[11px] leading-snug">
            {txt(samu.refusObservations) || "-"}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function SamuTab({ data, set }) {
  const pageRef = useRef(null);
  const [openRefusModal, setOpenRefusModal] = useState(false);
  const [langue, setLangue] = useState("FR");

  const refusEvacuation =
    data.samu.vecteur === "Refus d'évacuation par la victime";

  const signaturePresente = Boolean(
    data.samu.refusSignatureVictime?.trim() ||
      data.samu.refusSignatureTemoin1?.trim() ||
      data.samu.refusSignatureTemoin2?.trim()
  );

  const refusTextes = {
    FR: `La victime reconnaît avoir été informée de la nécessité d'une prise en charge médicale et refuse son évacuation.`,
    EN: `The patient acknowledges having been informed of the need for medical care and refuses transportation.`,
  };

  const downloadRefusPdf = async () => {
    await downloadElementAsPdf(pageRef.current, "refus-evacuation.pdf");
  };

  return (
    <>
      <style>
        {`
          .print-only {
            display: none;
          }

          @media print {
            body {
              background: white !important;
            }

            body * {
              visibility: hidden !important;
            }

            .print-only,
            .print-only * {
              visibility: visible !important;
            }

            .print-only {
              display: block !important;
              position: absolute;
              inset: 0;
              background: white;
            }

            .print-page {
              width: 210mm;
              min-height: 297mm;
              padding: 10mm;
              margin: 0 auto;
              background: white;
              color: black;
              font-family: Arial, sans-serif;
            }

            @page {
              size: A4;
              margin: 0;
            }
          }
        `}
      </style>

      <CardBlock title="Transmission SAMU / devenir" icon={Radio} tone="blue">
        <div className="space-y-3">
          <div className="rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-900">
            Le tri NOVI sert au classement rapide en présence de nombreuses
            victimes. Il ne remplace pas la transmission du bilan au SAMU.
          </div>

          <NoviBadge value={data.samu.couleur} />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <SelectField
            label="Tri NOVI / nombreuses victimes"
            value={data.samu.couleur}
            onChange={(v) => set(["samu", "couleur"], v)}
            options={OPTIONS.novi}
          />

          <Field
            label="Heure transmission"
            type="time"
            value={data.samu.heureTransmission}
            onChange={(v) => set(["samu", "heureTransmission"], v)}
          />

          <Field
            label="Décision SAMU"
            value={data.samu.decision}
            onChange={(v) => set(["samu", "decision"], v)}
          />

          <Field
            label="Destination"
            value={data.samu.destination}
            onChange={(v) => set(["samu", "destination"], v)}
          />

          <SelectField
            label="Vecteur de transport"
            value={data.samu.vecteur}
            onChange={(v) => {
              set(["samu", "vecteur"], v);

              if (v === "Refus d'évacuation par la victime") {
                setOpenRefusModal(true);
              }
            }}
            options={OPTIONS.vecteurTransport}
          />

          <label className="block space-y-1 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">
              Consignes / notifications
            </span>

            <textarea
              value={data.samu.consignes ?? ""}
              onChange={(e) => set(["samu", "consignes"], e.target.value)}
              className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>

          {refusEvacuation ? (
            <>
              <div className="rounded-lg bg-white p-3 text-sm font-black md:col-span-2">
                {signaturePresente ? (
                  <span className="text-green-700">
                    Refus d'évacuation OK
                  </span>
                ) : (
                  <span className="text-red-700">
                    Refus d'évacuation à compléter
                  </span>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setOpenRefusModal(true)}>
                    Ouvrir fiche refus d'évacuation
                  </Button>
                  <Button variant="outline" onClick={downloadRefusPdf}>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger fiche refus
                  </Button>
                </div>
              </div>

              <Modal
                open={openRefusModal}
                title="Refus d'évacuation"
                onClose={() => setOpenRefusModal(false)}
              >
                <div className="mb-4 flex gap-2">
                  <Button
                    variant={langue === "FR" ? "solid" : "outline"}
                    onClick={() => setLangue("FR")}
                  >
                    Français
                  </Button>

                  <Button
                    variant={langue === "EN" ? "solid" : "outline"}
                    onClick={() => setLangue("EN")}
                  >
                    English
                  </Button>
                </div>

                <div className="mb-4 whitespace-pre-wrap rounded-lg bg-slate-100 p-4 text-sm">
                  {refusTextes[langue]}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Field
                    label="Nom victime"
                    value={data.samu.refusNomVictime}
                    onChange={(v) => set(["samu", "refusNomVictime"], v)}
                  />

                  <Field
                    label="Signature victime"
                    value={data.samu.refusSignatureVictime}
                    onChange={(v) =>
                      set(["samu", "refusSignatureVictime"], v)
                    }
                  />

                  <Field
                    label="Nom témoin 1"
                    value={data.samu.refusNomTemoin1}
                    onChange={(v) => set(["samu", "refusNomTemoin1"], v)}
                  />

                  <Field
                    label="Signature témoin 1"
                    value={data.samu.refusSignatureTemoin1}
                    onChange={(v) =>
                      set(["samu", "refusSignatureTemoin1"], v)
                    }
                  />

                  <Field
                    label="Nom témoin 2"
                    value={data.samu.refusNomTemoin2}
                    onChange={(v) => set(["samu", "refusNomTemoin2"], v)}
                  />

                  <Field
                    label="Signature témoin 2"
                    value={data.samu.refusSignatureTemoin2}
                    onChange={(v) =>
                      set(["samu", "refusSignatureTemoin2"], v)
                    }
                  />
                </div>

                <div className="mt-4">
                  <textarea
                    value={data.samu.refusObservations ?? ""}
                    onChange={(e) =>
                      set(["samu", "refusObservations"], e.target.value)
                    }
                    placeholder="Observations complémentaires"
                    className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  />
                </div>

                <div
                  className={`mt-4 rounded-lg p-3 text-sm font-black ${
                    signaturePresente
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {signaturePresente
                    ? "Fiche de refus d'évacuation OK"
                    : "Signature victime ou témoin requise"}
                </div>
              </Modal>
            </>
          ) : null}
        </div>
      </CardBlock>

      <PrintableRefusEvacuation data={data} pageRef={pageRef} />
    </>
  );
}
