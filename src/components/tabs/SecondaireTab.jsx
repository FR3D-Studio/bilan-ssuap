import {
  Activity,
  AlertTriangle,
} from "lucide-react";

import CardBlock from "../ui/CardBlock";
import Field from "../ui/Field";
import SelectField from "../ui/SelectField";
import Check from "../ui/Check";
import ScoreCard from "../ui/ScoreCard";

import { MALINAS } from "../../data/options";
import WallaceSection from "../secondary/WallaceSection";

import {
  calculateMalinas,
  isFastPositive,
} from "../../utils/scores";

export default function SecondaireTab({ data, set }) {
  const s = data.secondaire;

  const malinas = calculateMalinas(s);
  const fast = isFastPositive(s);

  return (
    <CardBlock
      title="Bilan secondaire : PQRST + MHTA + paramètres"
      icon={Activity}
      tone="green"
    >
      {/* PQRST + MHTA */}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-base font-bold text-slate-900">
            PQRST
          </h3>

          <div className="grid gap-3">
            <Field
              label="P - Provoqué par"
              value={s.pqrstP}
              onChange={(v) =>
                set(["secondaire", "pqrstP"], v)
              }
            />

            <Field
              label="Q - Qualité"
              value={s.pqrstQ}
              onChange={(v) =>
                set(["secondaire", "pqrstQ"], v)
              }
            />

            <Field
              label="R - Région / irradiation"
              value={s.pqrstR}
              onChange={(v) =>
                set(["secondaire", "pqrstR"], v)
              }
            />

            <Field
              label="S - Sévérité / EVN"
              value={s.pqrstS}
              onChange={(v) =>
                set(["secondaire", "pqrstS"], v)
              }
            />

            <Field
              label="T - Temps / évolution"
              value={s.pqrstT}
              onChange={(v) =>
                set(["secondaire", "pqrstT"], v)
              }
            />
          </div>
        </div>

        <div className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-base font-bold text-slate-900">
            MHTA
          </h3>

          <div className="grid gap-3">
            <Field
              label="M - Maladie / antécédents"
              value={s.maladie}
              onChange={(v) =>
                set(["secondaire", "maladie"], v)
              }
            />

            <Field
              label="H - Hospitalisations"
              value={s.hospitalisation}
              onChange={(v) =>
                set(["secondaire", "hospitalisation"], v)
              }
            />

            <Field
              label="T - Traitements"
              value={s.traitement}
              onChange={(v) =>
                set(["secondaire", "traitement"], v)
              }
            />

            <Field
              label="A - Allergies"
              value={s.allergie}
              onChange={(v) =>
                set(["secondaire", "allergie"], v)
              }
            />
          </div>
        </div>
      </div>

      {/* FAST */}

      <div className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-bold text-slate-900">
          FAST AVC
        </h3>

        <div className="grid gap-3 md:grid-cols-3">
          <Check
            label="Face"
            checked={s.fastFace}
            onChange={(v) =>
              set(["secondaire", "fastFace"], v)
            }
          />

          <Check
            label="Arm"
            checked={s.fastArm}
            onChange={(v) =>
              set(["secondaire", "fastArm"], v)
            }
          />

          <Check
            label="Speech"
            checked={s.fastSpeech}
            onChange={(v) =>
              set(["secondaire", "fastSpeech"], v)
            }
          />

          <Field
            label="Time / début symptômes"
            type="time"
            value={s.fastTime}
            onChange={(v) =>
              set(["secondaire", "fastTime"], v)
            }
          />
        </div>

        <div
          className={`mt-3 rounded-lg p-3 font-semibold ${
            fast
              ? "bg-red-600 text-white"
              : "bg-slate-100 text-slate-900"
          }`}
        >
          FAST : {fast ? "POSITIF" : "NÉGATIF / NON RETROUVÉ"}
        </div>
      </div>

      {/* MALINAS */}

      <ScoreCard
        title="Score de Malinas"
        value={`Malinas : ${malinas}`}
        danger={malinas >= 5}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <SelectField
            label="Parité"
            value={s.malinasParite}
            onChange={(v) =>
              set(["secondaire", "malinasParite"], v)
            }
            options={MALINAS.parite}
          />

          <SelectField
            label="Durée travail"
            value={s.malinasTravail}
            onChange={(v) =>
              set(["secondaire", "malinasTravail"], v)
            }
            options={MALINAS.travail}
          />

          <SelectField
            label="Durée contractions"
            value={s.malinasContractions}
            onChange={(v) =>
              set(["secondaire", "malinasContractions"], v)
            }
            options={MALINAS.contractions}
          />

          <SelectField
            label="Intervalle contractions"
            value={s.malinasIntervalle}
            onChange={(v) =>
              set(["secondaire", "malinasIntervalle"], v)
            }
            options={MALINAS.intervalle}
          />

          <SelectField
            label="Perte des eaux"
            value={s.malinasEaux}
            onChange={(v) =>
              set(["secondaire", "malinasEaux"], v)
            }
            options={MALINAS.eaux}
          />
        </div>

        {malinas >= 5 ? (
          <div className="mt-3 rounded-lg bg-red-100 p-3 text-center font-bold text-red-800">
            <AlertTriangle className="mr-2 inline h-5 w-5" />
            Accouchement imminent : préparer prise en charge sur
            place et prévenir rapidement le SAMU.
          </div>
        ) : null}
      </ScoreCard>

      {/* WALLACE */}

      <WallaceSection s={s} set={set} />

      {/* PARAMÈTRES */}

      <div className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-bold text-slate-900">
          Paramètres / examens complémentaires
        </h3>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Field
            label="EVN"
            value={s.evn}
            onChange={(v) =>
              set(["secondaire", "evn"], v)
            }
          />

          <Field
            label="Glycémie"
            value={s.glycemie}
            onChange={(v) =>
              set(["secondaire", "glycemie"], v)
            }
          />

          <Field
            label="Température"
            value={s.temperature}
            onChange={(v) =>
              set(["secondaire", "temperature"], v)
            }
          />
        </div>
      </div>
    </CardBlock>
  );
}
