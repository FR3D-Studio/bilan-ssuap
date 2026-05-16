import { FileText, Plane, Mail, Printer, Copy } from "lucide-react";

import CardBlock from "../ui/CardBlock";
import Field from "../ui/Field";
import Button from "../ui/Button";

import logoMedifire from "../../assets/logo-medifire.png";

const txt = (value) =>
  value === null || value === undefined ? "" : String(value);

function buildLiaison(data) {
  const id = data.identite ?? {};
  const c = data.circonstanciel ?? {};
  const s = data.secondaire ?? {};
  const aero = data.aeronautique ?? {};
  const surveillance = Array.isArray(data.surveillance)
    ? data.surveillance
    : [];

  const surveillanceText = surveillance.length
    ? surveillance
        .map(
          (x, index) =>
            `${index + 1}. ${txt(x?.heure)} | FR ${txt(x?.fr)} | SpO₂ ${txt(
              x?.spo2
            )} | FC ${txt(x?.fc)} | TA ${txt(x?.ta)} | Glasgow ${txt(
              x?.glasgow
            )} | EVN ${txt(x?.evn)} | ${txt(x?.notes)}`
        )
        .join("\n")
    : "Aucune surveillance renseignée";

  return `
FICHE DE LIAISON RFFS → SDIS

IDENTIFICATION VICTIME
Nom : ${txt(id.nom)}
Prénom : ${txt(id.prenom)}
Âge : ${txt(id.age)}
Sexe : ${txt(id.sexe)}
Nationalité : ${txt(id.nationalite)}
Adresse : ${txt(id.adresse)}

BILAN CIRCONSTANCIEL
Circonstances :
${txt(c.circonstances)}

Plainte principale :
${txt(c.plainte)}

Gestes témoins :
${txt(c.gestesTemoins)}

MHTA
Maladies : ${txt(s.maladie)}
Hospitalisations : ${txt(s.hospitalisation)}
Traitements : ${txt(s.traitement)}
Allergies : ${txt(s.allergie)}

SURVEILLANCE
${surveillanceText}

RÉFÉRENCES AÉRONAUTIQUES
Type d'avion : ${txt(aero.typeAvion)}
Compagnie aérienne : ${txt(aero.compagnie)}
Provenance : ${txt(aero.provenance)}
Destination : ${txt(aero.destination)}
N° de vol : ${txt(aero.numeroVol)}
Immatriculation : ${txt(aero.immatriculation)}
Nombre de PAX : ${txt(aero.nombrePax)}
Nombre de POB : ${txt(aero.nombrePob)}
`;
}

function PrintRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 border-b border-slate-300">
      <div className="bg-slate-100 px-2 py-1 text-[11px] font-bold">
        {label}
      </div>
      <div className="col-span-2 px-2 py-1 text-[11px]">
        {txt(value) || "—"}
      </div>
    </div>
  );
}

function PrintSection({ title, children }) {
  return (
    <section className="break-inside-avoid border border-slate-400">
      <h2 className="bg-black px-2 py-1 text-[11px] font-black uppercase tracking-wide text-white">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

function PrintTextBlock({ value }) {
  return (
    <div className="min-h-14 whitespace-pre-wrap px-2 py-2 text-[11px] leading-snug">
      {txt(value) || "—"}
    </div>
  );
}

function PrintableLiaison({ data }) {
  const id = data.identite ?? {};
  const c = data.circonstanciel ?? {};
  const s = data.secondaire ?? {};
  const aero = data.aeronautique ?? {};
  const surveillance = Array.isArray(data.surveillance)
    ? data.surveillance
    : [];

  return (
    <div className="print-only">
      <div className="print-page">
        <header className="mb-3 border-b-2 border-black pb-3">
          <div className="grid grid-cols-[90px_1fr_90px] items-center">
            <div className="flex justify-start">
              <img
                src={logoMedifire}
                alt="Logo MédiFIRE"
                className="h-20 w-20 object-contain"
              />
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-black uppercase tracking-tight">
                Fiche de liaison
              </h1>

              <div className="text-5xl font-black uppercase leading-none">
                RFFS → SDIS
              </div>

              <p className="mt-2 text-[11px] font-bold uppercase tracking-wide">
                Identification victime — circonstanciel — MHTA — surveillance —
                références aéronautiques
              </p>
            </div>

            <div />
          </div>
        </header>

        <div className="grid gap-3">
          <PrintSection title="1. Identification victime">
            <div className="grid grid-cols-2">
              <PrintRow label="Nom" value={id.nom} />
              <PrintRow label="Prénom" value={id.prenom} />
              <PrintRow label="Âge" value={id.age} />
              <PrintRow label="Sexe" value={id.sexe} />
              <PrintRow label="Nationalité" value={id.nationalite} />
              <PrintRow label="Adresse" value={id.adresse} />
            </div>
          </PrintSection>

          <PrintSection title="2. Bilan circonstanciel">
            <div className="grid grid-cols-2">
              <div className="border-r border-slate-300">
                <div className="bg-slate-100 px-2 py-1 text-[11px] font-bold uppercase">
                  Circonstances
                </div>
                <PrintTextBlock value={c.circonstances} />
              </div>

              <div>
                <div className="bg-slate-100 px-2 py-1 text-[11px] font-bold uppercase">
                  Plainte principale
                </div>
                <PrintTextBlock value={c.plainte} />
              </div>
            </div>

            <div className="border-t border-slate-300">
              <div className="bg-slate-100 px-2 py-1 text-[11px] font-bold uppercase">
                Gestes témoins
              </div>
              <PrintTextBlock value={c.gestesTemoins} />
            </div>
          </PrintSection>

          <PrintSection title="3. MHTA">
            <PrintRow label="Maladies" value={s.maladie} />
            <PrintRow label="Hospitalisations" value={s.hospitalisation} />
            <PrintRow label="Traitements" value={s.traitement} />
            <PrintRow label="Allergies" value={s.allergie} />
          </PrintSection>

          <PrintSection title="4. Surveillance">
            {surveillance.length > 0 ? (
              <table className="w-full border-collapse text-[10px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-1 py-1">Heure</th>
                    <th className="border border-slate-300 px-1 py-1">FR</th>
                    <th className="border border-slate-300 px-1 py-1">SpO₂</th>
                    <th className="border border-slate-300 px-1 py-1">FC</th>
                    <th className="border border-slate-300 px-1 py-1">TA</th>
                    <th className="border border-slate-300 px-1 py-1">
                      Glasgow
                    </th>
                    <th className="border border-slate-300 px-1 py-1">EVN</th>
                    <th className="border border-slate-300 px-1 py-1">
                      Notes
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {surveillance.map((x, index) => (
                    <tr key={`print-surveillance-${index}`}>
                      <td className="border border-slate-300 px-1 py-1">
                        {txt(x?.heure) || "—"}
                      </td>
                      <td className="border border-slate-300 px-1 py-1">
                        {txt(x?.fr) || "—"}
                      </td>
                      <td className="border border-slate-300 px-1 py-1">
                        {txt(x?.spo2) || "—"}
                      </td>
                      <td className="border border-slate-300 px-1 py-1">
                        {txt(x?.fc) || "—"}
                      </td>
                      <td className="border border-slate-300 px-1 py-1">
                        {txt(x?.ta) || "—"}
                      </td>
                      <td className="border border-slate-300 px-1 py-1">
                        {txt(x?.glasgow) || "—"}
                      </td>
                      <td className="border border-slate-300 px-1 py-1">
                        {txt(x?.evn) || "—"}
                      </td>
                      <td className="border border-slate-300 px-1 py-1">
                        {txt(x?.notes) || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-2 py-2 text-[11px]">
                Aucune surveillance renseignée
              </div>
            )}
          </PrintSection>

          <PrintSection title="5. Références aéronautiques">
            <div className="grid grid-cols-2">
              <PrintRow label="Type avion" value={aero.typeAvion} />
              <PrintRow label="Compagnie" value={aero.compagnie} />
              <PrintRow label="Provenance" value={aero.provenance} />
              <PrintRow label="Destination" value={aero.destination} />
              <PrintRow label="N° vol" value={aero.numeroVol} />
              <PrintRow label="Immatriculation" value={aero.immatriculation} />
              <PrintRow label="Nombre PAX" value={aero.nombrePax} />
              <PrintRow label="Nombre POB" value={aero.nombrePob} />
            </div>
          </PrintSection>
        </div>
      </div>
    </div>
  );
}

export default function LiaisonSdisTab({ data, set }) {
  const liaison = buildLiaison(data);

  const copyLiaison = async () => {
    try {
      await navigator.clipboard.writeText(liaison);
    } catch {
      window.prompt("Copier la fiche :", liaison);
    }
  };

  const sendMail = () => {
    const subject = encodeURIComponent("Fiche de liaison RFFS → SDIS");
    const body = encodeURIComponent(liaison);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const printLiaison = () => {
    window.print();
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
              padding: 8mm;
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

      <div className="space-y-4">
        <CardBlock title="Références aéronautiques" icon={Plane} tone="blue">
          <div className="grid gap-3 md:grid-cols-2">
            <Field
              label="Type d'avion"
              value={data.aeronautique.typeAvion}
              onChange={(v) => set(["aeronautique", "typeAvion"], v)}
            />

            <Field
              label="Compagnie aérienne"
              value={data.aeronautique.compagnie}
              onChange={(v) => set(["aeronautique", "compagnie"], v)}
            />

            <Field
              label="Provenance"
              value={data.aeronautique.provenance}
              onChange={(v) => set(["aeronautique", "provenance"], v)}
            />

            <Field
              label="Destination"
              value={data.aeronautique.destination}
              onChange={(v) => set(["aeronautique", "destination"], v)}
            />

            <Field
              label="N° de vol"
              value={data.aeronautique.numeroVol}
              onChange={(v) => set(["aeronautique", "numeroVol"], v)}
            />

            <Field
              label="Immatriculation"
              value={data.aeronautique.immatriculation}
              onChange={(v) => set(["aeronautique", "immatriculation"], v)}
            />

            <Field
              label="Nombre de PAX"
              value={data.aeronautique.nombrePax}
              onChange={(v) => set(["aeronautique", "nombrePax"], v)}
            />

            <Field
              label="Nombre de POB"
              value={data.aeronautique.nombrePob}
              onChange={(v) => set(["aeronautique", "nombrePob"], v)}
            />
          </div>
        </CardBlock>

        <CardBlock title="Fiche de liaison RFFS → SDIS" icon={FileText} tone="amber">
          <div className="mb-4 flex flex-wrap gap-2">
            <Button onClick={copyLiaison}>
              <Copy className="mr-2 h-4 w-4" />
              Copier
            </Button>

            <Button onClick={sendMail}>
              <Mail className="mr-2 h-4 w-4" />
              Envoyer mail
            </Button>

            <Button onClick={printLiaison}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer / PDF
            </Button>
          </div>

          <textarea
            readOnly
            value={liaison}
            className="min-h-[700px] w-full rounded-3xl border border-slate-200 bg-white p-4 font-mono text-sm shadow-sm outline-none"
          />
        </CardBlock>
      </div>

      <PrintableLiaison data={data} />
    </>
  );
}