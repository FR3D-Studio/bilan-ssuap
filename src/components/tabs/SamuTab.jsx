import { useRef, useState } from "react";
import { Download, Radio } from "lucide-react";

import CardBlock from "../ui/CardBlock";
import Field from "../ui/Field";
import SelectField from "../ui/SelectField";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Check from "../ui/Check";

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

function formatDate(value) {
  const raw = txt(value);
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) return raw;

  return `${match[3]}/${match[2]}/${match[1]}`;
}

function formatDateForInput(value) {
  return txt(value).slice(0, 10);
}

function ReadOnlyField({ label, value }) {
  return (
    <div className="block space-y-2">
      <span className="pl-0.5 text-sm font-bold leading-tight text-slate-700">
        {label}
      </span>
      <div className="min-h-12 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900">
        {txt(value) || "-"}
      </div>
    </div>
  );
}

function SignatureBox({ value }) {
  if (txt(value).startsWith("data:image/")) {
    return (
      <img
        src={value}
        alt=""
        className="mx-auto h-14 max-w-full object-contain"
      />
    );
  }

  return txt(value);
}

function SignaturePadModal({ open, title, value, onSave, onClose }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = event.touches?.[0] ?? event;

    return {
      x: ((point.clientX - rect.left) / rect.width) * canvas.width,
      y: ((point.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    context.lineWidth = 3;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#0f172a";

    if (value?.startsWith("data:image/")) {
      const image = new Image();
      image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
      image.src = value;
    }
  };

  const startDrawing = (event) => {
    event.preventDefault();
    setupCanvas();
    drawingRef.current = true;
    const context = canvasRef.current.getContext("2d");
    const point = getPoint(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const draw = (event) => {
    if (!drawingRef.current) return;
    event.preventDefault();
    const context = canvasRef.current.getContext("2d");
    const point = getPoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const stopDrawing = () => {
    drawingRef.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  };

  const save = () => {
    onSave(canvasRef.current.toDataURL("image/png"));
    onClose();
  };

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="space-y-4">
        <canvas
          ref={(canvas) => {
            canvasRef.current = canvas;
            setupCanvas();
          }}
          width={900}
          height={320}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="h-64 w-full touch-none rounded-xl border-2 border-slate-300 bg-white"
        />

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={clear}>
            Effacer
          </Button>
          <Button onClick={save}>Valider la signature</Button>
        </div>
      </div>
    </Modal>
  );
}

function PrintableRefusEvacuation({ data, pageRef }) {
  const samu = data.samu ?? {};
  const identite = data.identite ?? {};
  const aeronautique = data.aeronautique ?? {};
  const intervention = data.intervention ?? {};
  const victimeNomComplet = [identite.prenom, identite.nom]
    .map(txt)
    .filter(Boolean)
    .join(" ");
  const numeroVol = samu.refusNumeroVol || aeronautique.numeroVol;
  const refusDate =
    samu.refusDate || formatDateForInput(intervention.dateHeure);

  return (
    <div className="print-only">
      <div
        ref={pageRef}
        className="print-page refus-officiel-page relative h-[297mm] w-[210mm] overflow-hidden bg-white"
      >
        <img
          src="/refus-evacuation-officiel.png"
          alt=""
          className="absolute inset-0 h-full w-full object-fill"
        />

        <div className="absolute left-[76mm] top-[108mm] w-[92mm] font-serif text-[12px] font-semibold">
          {victimeNomComplet}
        </div>
        <div className="absolute left-[60mm] top-[121mm] w-[118mm] font-serif text-[12px] font-semibold">
          {txt(identite.adresse)}
        </div>
        <div className="absolute left-[80mm] top-[133mm] w-[70mm] font-serif text-[12px] font-semibold">
          {txt(numeroVol)}
        </div>

        {samu.refusAssistanceMedecin ? (
          <div className="absolute left-[51.6mm] top-[158.2mm] font-serif text-[12px] font-black">
            X
          </div>
        ) : null}
        {samu.refusTransport ? (
          <div className="absolute left-[51.6mm] top-[171.5mm] font-serif text-[12px] font-black">
            X
          </div>
        ) : null}

        <div className="absolute left-[50mm] top-[228mm] w-[40mm] font-serif text-[12px] font-semibold">
          {formatDate(refusDate)}
        </div>
        <div className="absolute left-[137mm] top-[236mm] w-[48mm] text-center font-serif text-[12px] font-semibold">
          <SignatureBox value={samu.refusSignatureVictime} />
        </div>

        <div className="absolute left-[26mm] top-[265mm] w-[70mm] font-serif text-[11px] font-semibold">
          {txt(samu.refusPompierIntervenant)}
          <SignatureBox value={samu.refusSignaturePompier} />
        </div>
        <div className="absolute left-[150mm] top-[265mm] w-[36mm] font-serif text-[11px] font-semibold">
          {txt(samu.refusCompteRendu)}
        </div>
      </div>
    </div>
  );
}

export default function SamuTab({ data, set }) {
  const pageRef = useRef(null);
  const [openRefusModal, setOpenRefusModal] = useState(false);
  const [signatureTarget, setSignatureTarget] = useState(null);
  const [langue, setLangue] = useState("FR");

  const refusEvacuation =
    data.samu.vecteur === "Refus d'évacuation par la victime";
  const identite = data.identite ?? {};
  const aeronautique = data.aeronautique ?? {};
  const intervention = data.intervention ?? {};
  const victimeNomComplet = [identite.prenom, identite.nom]
    .map(txt)
    .filter(Boolean)
    .join(" ");
  const refusDate =
    data.samu.refusDate || formatDateForInput(intervention.dateHeure);

  const signaturePresente = Boolean(
    data.samu.refusSignatureVictime?.trim() &&
      data.samu.refusPompierIntervenant?.trim() &&
      data.samu.refusSignaturePompier?.trim()
  );

  const refusTextes = {
    FR: `La victime reconnaît avoir été informée des risques encourus en l'absence d'examen médical et/ou d'hospitalisation. Elle refuse l'assistance médicale et/ou le transport vers un centre hospitalier, et assume la responsabilité de ce refus.`,
    EN: `The patient acknowledges having been informed of the risks involved without medical assessment and/or hospitalization. They refuse medical assistance and/or transportation to a hospital, and accept responsibility for this refusal.`,
    DE: `Die betroffene Person bestätigt, über die Risiken ohne ärztliche Untersuchung und/oder Krankenhausbehandlung informiert worden zu sein. Sie lehnt medizinische Hilfe und/oder den Transport in ein Krankenhaus ab und übernimmt die Verantwortung für diese Ablehnung.`,
    ES: `La víctima reconoce haber sido informada de los riesgos derivados de la ausencia de evaluación médica y/o hospitalización. Rechaza la asistencia médica y/o el traslado a un centro hospitalario, y asume la responsabilidad de esta negativa.`,
  };

  const downloadRefusPdf = async () => {
    await downloadElementAsPdf(pageRef.current, "refus-evacuation.pdf", {
      padding: "0",
    });
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

            .refus-officiel-page {
              position: relative;
              width: 210mm;
              height: 297mm;
              min-height: 297mm;
              overflow: hidden;
              padding: 0 !important;
              font-family: "Times New Roman", Times, serif;
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
                <div className="mb-4 rounded-lg bg-slate-100 p-4 text-sm font-semibold text-slate-800">
                  Les nom, prénom et adresse sont repris depuis la page Départ,
                  section Identification.
                </div>

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

                  <Button
                    variant={langue === "DE" ? "solid" : "outline"}
                    onClick={() => setLangue("DE")}
                  >
                    Deutsch
                  </Button>

                  <Button
                    variant={langue === "ES" ? "solid" : "outline"}
                    onClick={() => setLangue("ES")}
                  >
                    Español
                  </Button>
                </div>

                <div className="mb-4 whitespace-pre-wrap rounded-lg bg-blue-50 p-4 text-sm font-semibold text-blue-950">
                  {refusTextes[langue]}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <ReadOnlyField
                    label="Victime"
                    value={victimeNomComplet}
                  />

                  <ReadOnlyField
                    label="Adresse"
                    value={identite.adresse}
                  />

                  <Field
                    label="N° du vol (s'il y a lieu)"
                    value={data.samu.refusNumeroVol || aeronautique.numeroVol}
                    onChange={(v) => set(["samu", "refusNumeroVol"], v)}
                  />

                  <Field
                    label="Mérignac, le"
                    type="date"
                    value={refusDate}
                    onChange={(v) => set(["samu", "refusDate"], v)}
                  />

                  <Check
                    label="Refus de l'assistance d'un médecin"
                    checked={data.samu.refusAssistanceMedecin}
                    onChange={(v) =>
                      set(["samu", "refusAssistanceMedecin"], v)
                    }
                  />

                  <Check
                    label="Refus du transport vers un centre hospitalier"
                    checked={data.samu.refusTransport}
                    onChange={(v) => set(["samu", "refusTransport"], v)}
                  />

                  <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-sm font-bold text-slate-700">
                      Signature victime - Lu et approuvé
                    </div>
                    <div className="min-h-20 rounded-lg border border-dashed border-slate-300 bg-white p-2">
                      <SignatureBox value={data.samu.refusSignatureVictime} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => setSignatureTarget("victime")}>
                        Signer
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          set(["samu", "refusSignatureVictime"], "")
                        }
                      >
                        Effacer
                      </Button>
                    </div>
                  </div>

                  <Field
                    label="Nom du pompier intervenant"
                    value={data.samu.refusPompierIntervenant}
                    onChange={(v) =>
                      set(["samu", "refusPompierIntervenant"], v)
                    }
                  />

                  <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-sm font-bold text-slate-700">
                      Signature pompier intervenant
                    </div>
                    <div className="min-h-20 rounded-lg border border-dashed border-slate-300 bg-white p-2">
                      <SignatureBox value={data.samu.refusSignaturePompier} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => setSignatureTarget("pompier")}>
                        Signer
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          set(["samu", "refusSignaturePompier"], "")
                        }
                      >
                        Effacer
                      </Button>
                    </div>
                  </div>

                  <Field
                    label="N° de Compte-Rendu d'Intervention"
                    value={data.samu.refusCompteRendu}
                    onChange={(v) => set(["samu", "refusCompteRendu"], v)}
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
                    : "Signatures victime et pompier intervenant requises"}
                </div>
              </Modal>
            </>
          ) : null}
        </div>
      </CardBlock>

      <PrintableRefusEvacuation data={data} pageRef={pageRef} />
      <SignaturePadModal
        open={signatureTarget === "victime"}
        title="Signature victime"
        value={data.samu.refusSignatureVictime}
        onSave={(value) => set(["samu", "refusSignatureVictime"], value)}
        onClose={() => setSignatureTarget(null)}
      />
      <SignaturePadModal
        open={signatureTarget === "pompier"}
        title="Signature pompier intervenant"
        value={data.samu.refusSignaturePompier}
        onSave={(value) => set(["samu", "refusSignaturePompier"], value)}
        onClose={() => setSignatureTarget(null)}
      />
    </>
  );
}
