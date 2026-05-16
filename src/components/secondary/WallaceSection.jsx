import Field from "../ui/Field";
import SelectField from "../ui/SelectField";
import Check from "../ui/Check";
import ScoreCard from "../ui/ScoreCard";

import { calculateWallace } from "../../utils/scores";

export default function WallaceSection({ s, set }) {
  const wallace = calculateWallace(s);
  const isEnfant = s.wallaceMode === "Enfant - règle adaptée";

  return (
    <ScoreCard
      title="Règle de Wallace"
      value={`Surface brûlée : ${wallace}%`}
      danger={false}
    >
      <p className="mb-3 rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-900">
        Contrôler systématiquement la face antérieure ET la face postérieure de
        la victime. Mode adulte et enfant disponibles selon l’âge de la victime.
      </p>

      <div className="mb-3">
        <SelectField
          label="Mode d’évaluation"
          value={s.wallaceMode}
          onChange={(v) => set(["secondaire", "wallaceMode"], v)}
          options={[
            "Adulte - règle des 9",
            "Enfant - règle adaptée",
            "Paume = 1%",
          ]}
        />
      </div>

      {s.wallaceMode === "Paume = 1%" ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <Field
            label="Nombre de paumes de la victime brûlées"
            value={s.wallacePaumes}
            onChange={(v) => set(["secondaire", "wallacePaumes"], v)}
            placeholder="1 paume = environ 1%"
          />

          <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-600">
            Méthode utile pour les petites brûlures : la paume de la victime
            représente environ 1% de la surface corporelle.
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="mb-3 font-bold text-slate-900">
              Face antérieure
            </h4>

            <div className="grid gap-3 md:grid-cols-2">
              <Check
                label={
                  isEnfant
                    ? "Tête / face avant 8,5%"
                    : "Tête / face avant 4,5%"
                }
                checked={s.wallaceTeteAvant}
                onChange={(v) => set(["secondaire", "wallaceTeteAvant"], v)}
              />

              <Check
                label="Bras droit avant 4,5%"
                checked={s.wallaceBrasDroitAvant}
                onChange={(v) =>
                  set(["secondaire", "wallaceBrasDroitAvant"], v)
                }
              />

              <Check
                label="Bras gauche avant 4,5%"
                checked={s.wallaceBrasGaucheAvant}
                onChange={(v) =>
                  set(["secondaire", "wallaceBrasGaucheAvant"], v)
                }
              />

              <Check
                label="Tronc avant 18%"
                checked={s.wallaceTroncAvant}
                onChange={(v) => set(["secondaire", "wallaceTroncAvant"], v)}
              />

              <Check
                label={
                  isEnfant
                    ? "Jambe droite avant 7%"
                    : "Jambe droite avant 9%"
                }
                checked={s.wallaceJambeDroiteAvant}
                onChange={(v) =>
                  set(["secondaire", "wallaceJambeDroiteAvant"], v)
                }
              />

              <Check
                label={
                  isEnfant
                    ? "Jambe gauche avant 7%"
                    : "Jambe gauche avant 9%"
                }
                checked={s.wallaceJambeGaucheAvant}
                onChange={(v) =>
                  set(["secondaire", "wallaceJambeGaucheAvant"], v)
                }
              />

              <Check
                label="Périnée 1%"
                checked={s.wallacePerinee}
                onChange={(v) => set(["secondaire", "wallacePerinee"], v)}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="mb-3 font-bold text-slate-900">
              Face postérieure
            </h4>

            <div className="grid gap-3 md:grid-cols-2">
              <Check
                label={isEnfant ? "Tête arrière 8,5%" : "Tête arrière 4,5%"}
                checked={s.wallaceTeteArriere}
                onChange={(v) => set(["secondaire", "wallaceTeteArriere"], v)}
              />

              <Check
                label="Bras droit arrière 4,5%"
                checked={s.wallaceBrasDroitArriere}
                onChange={(v) =>
                  set(["secondaire", "wallaceBrasDroitArriere"], v)
                }
              />

              <Check
                label="Bras gauche arrière 4,5%"
                checked={s.wallaceBrasGaucheArriere}
                onChange={(v) =>
                  set(["secondaire", "wallaceBrasGaucheArriere"], v)
                }
              />

              <Check
                label="Dos / tronc arrière 18%"
                checked={s.wallaceTroncArriere}
                onChange={(v) => set(["secondaire", "wallaceTroncArriere"], v)}
              />

              <Check
                label={
                  isEnfant
                    ? "Jambe droite arrière 7%"
                    : "Jambe droite arrière 9%"
                }
                checked={s.wallaceJambeDroiteArriere}
                onChange={(v) =>
                  set(["secondaire", "wallaceJambeDroiteArriere"], v)
                }
              />

              <Check
                label={
                  isEnfant
                    ? "Jambe gauche arrière 7%"
                    : "Jambe gauche arrière 9%"
                }
                checked={s.wallaceJambeGaucheArriere}
                onChange={(v) =>
                  set(["secondaire", "wallaceJambeGaucheArriere"], v)
                }
              />
            </div>

            <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-600">
              Retourner / inspecter la victime selon la situation et la
              sécurité, pour ne pas oublier les lésions postérieures.
            </div>
          </div>
        </div>
      )}
    </ScoreCard>
  );
}