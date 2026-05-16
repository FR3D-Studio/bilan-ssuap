import {
  FileText,
  Plane,
  Mail,
  Printer,
  Copy,
} from "lucide-react";

import CardBlock from "../ui/CardBlock";
import Field from "../ui/Field";
import Button from "../ui/Button";

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
            `${index + 1}. ${txt(x?.heure)} | FR ${txt(
              x?.fr
            )} | SpO₂ ${txt(x?.spo2)} | FC ${txt(
              x?.fc
            )} | TA ${txt(x?.ta)} | Glasgow ${txt(
              x?.glasgow
            )} | EVN ${txt(x?.evn)} | ${txt(x?.notes)}`
        )
        .join("\n")
    : "Aucune surveillance renseignée";

  return `
FICHE DE LIAISON SDIS

IDENTIFICATION VICTIME
Nom : ${txt(id.nom)}
Prénom : ${txt(id.prenom)}
Âge : ${txt(id.age)}
Sexe : ${txt(id.sexe)}
Nationalité : ${txt(id.nationalite)}

BILAN CIRCONSTANCIEL
Circonstances :
${txt(c.circonstances)}

Plainte principale :
${txt(c.plainte)}

Gestes témoins :
${txt(c.gestesTemoins)}

MHTA
Maladies :
${txt(s.maladie)}

Hospitalisations :
${txt(s.hospitalisation)}

Traitements :
${txt(s.traitement)}

Allergies :
${txt(s.allergie)}

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
    const subject = encodeURIComponent(
      "Fiche de liaison SDIS"
    );

    const body = encodeURIComponent(liaison);

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const printLiaison = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <CardBlock
        title="Références aéronautiques"
        icon={Plane}
        tone="blue"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label="Type d'avion"
            value={data.aeronautique.typeAvion}
            onChange={(v) =>
              set(["aeronautique", "typeAvion"], v)
            }
          />

          <Field
            label="Compagnie aérienne"
            value={data.aeronautique.compagnie}
            onChange={(v) =>
              set(["aeronautique", "compagnie"], v)
            }
          />

          <Field
            label="Provenance"
            value={data.aeronautique.provenance}
            onChange={(v) =>
              set(["aeronautique", "provenance"], v)
            }
          />

          <Field
            label="Destination"
            value={data.aeronautique.destination}
            onChange={(v) =>
              set(["aeronautique", "destination"], v)
            }
          />

          <Field
            label="N° de vol"
            value={data.aeronautique.numeroVol}
            onChange={(v) =>
              set(["aeronautique", "numeroVol"], v)
            }
          />

          <Field
            label="Immatriculation"
            value={data.aeronautique.immatriculation}
            onChange={(v) =>
              set(["aeronautique", "immatriculation"], v)
            }
          />

          <Field
            label="Nombre de PAX"
            value={data.aeronautique.nombrePax}
            onChange={(v) =>
              set(["aeronautique", "nombrePax"], v)
            }
          />

          <Field
            label="Nombre de POB"
            value={data.aeronautique.nombrePob}
            onChange={(v) =>
              set(["aeronautique", "nombrePob"], v)
            }
          />
        </div>
      </CardBlock>

      <CardBlock
        title="Fiche de liaison SDIS"
        icon={FileText}
        tone="amber"
      >
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
  );
}