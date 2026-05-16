# Bilan SSUAP Mobile

Application web opérationnelle de structuration du bilan SSUAP destinée aux :
- sapeurs-pompiers ;
- primo-intervenants ;
- équipes VSAV ;
- secours aéroportuaires ;
- personnels de secours et d’assistance aux victimes.

Utilisable sur :
- smartphone ;
- tablette ;
- ordinateur.

Le projet est actuellement en développement actif mais déjà exploitable en tests terrain.

---

# Objectif du projet

L’application a pour objectif de :
- accélérer la réalisation du bilan ;
- structurer les transmissions ;
- limiter les oublis ;
- améliorer la lisibilité opérationnelle ;
- uniformiser les informations transmises au SAMU ;
- fournir un support mobile moderne utilisable sur intervention.

Le projet est conçu comme :

```text
un outil opérationnel d’aide à la structuration du bilan
```

et ne remplace jamais :
- les procédures en vigueur ;
- la régulation médicale ;
- les protocoles locaux ;
- la chaîne de commandement ;
- l’avis médical.

---

# Fonctionnalités principales

## Départ / intervention

Gestion :
- date / heure ;
- adresse ;
- nature d’intervention ;
- renforts ;
- dangers / contexte ;
- sécurité réalisée.

---

## Identification victime

Gestion :
- nom ;
- prénom ;
- âge ;
- sexe ;
- nationalité ;
- type de victime ;
- nature de victime ;
- société / environnement professionnel ;
- plainte principale.

---

## Circonstanciel

Gestion :
- circonstances ;
- mécanisme ;
- gestes témoins ;
- contexte opérationnel.

---

# Bilan primaire XABCDE

## X — Hémorragie massive
- hémorragie externe grave ;
- action réalisée ;
- alertes visuelles.

## A — Airway
- voies aériennes ;
- suspicion rachis ;
- stabilisation.

## B — Respiration
- qualité respiratoire ;
- fréquence respiratoire ;
- SpO₂ ;
- détresse respiratoire.

## C — Circulation
- pouls ;
- fréquence cardiaque ;
- tension artérielle ;
- TRC ;
- détresse circulatoire.

## D — Neurologique
- conscience ;
- Glasgow automatique ;
- signes neurologiques.

## E — Exposition / lésions
- lésions ;
- brûlures ;
- exposition.

---

# Bilan secondaire

## PQRST
- provoqué par ;
- qualité ;
- région ;
- sévérité ;
- temps / évolution.

## MHTA
- maladies ;
- hospitalisations ;
- traitements ;
- allergies.

---

# Scores et aides opérationnelles

## Glasgow
Calcul automatique du score de Glasgow.

Alerte automatique :

```text
Glasgow 3 à 7 = avis médical urgent
```

---

## FAST AVC

Détection :
- Face ;
- Arm ;
- Speech ;
- heure de début des symptômes.

Affichage automatique :

```text
FAST positif / négatif
```

---

## Score de Malinas

Calcul automatique du score.

Alerte :

```text
accouchement imminent
```

si score élevé.

---

## Règle de Wallace

Modes disponibles :
- adulte ;
- enfant ;
- paume = 1%.

Gestion :
- face antérieure ;
- face postérieure ;
- calcul automatique surface brûlée.

---

# Automatisations

## Détresse respiratoire

Si :
- respiration absente ;
- ou GASP ;

alors :
- détresse respiratoire cochée automatiquement ;
- affichage rouge ;
- alerte SAMU immédiate.

---

## Détresse circulatoire

Si :
- pouls non perçu ;

alors :
- détresse circulatoire cochée automatiquement ;
- affichage rouge ;
- alerte SAMU immédiate.

---

## Détresse vitale globale

Détection automatique :
- Glasgow sévère ;
- détresse respiratoire ;
- détresse circulatoire ;
- hémorragie massive.

Affichage :

```text
Détresse vitale potentielle
```

---

# Gestes réalisés

Gestion :
- oxygène ;
- débit O₂ ;
- positionnement ;
- immobilisation ;
- pansements ;
- ASU ;
- soins réalisés ;
- autres gestes.

---

# Surveillance

Ajout dynamique de surveillances :
- heure ;
- FR ;
- SpO₂ ;
- FC ;
- TA ;
- Glasgow ;
- EVN ;
- notes.

---

# Photos

Fonctionnalités :
- prise de photo smartphone/tablette ;
- ajout de photos locales ;
- suppression ;
- visualisation intégrée.

Les photos :
- restent locales ;
- ne sont pas envoyées automatiquement ;
- ne sont pas stockées à distance.

---

# Transmission SAMU / devenir

## Tri NOVI

Gestion :
- urgence absolue ;
- urgence relative ;
- impliqué / indemne ;
- décédé.

Affichage couleur automatique.

---

## Transmission SAMU

Gestion :
- heure transmission ;
- décision SAMU ;
- destination ;
- consignes ;
- notifications.

---

## Vecteurs de transport

Disponibles :
- SDIS ;
- ASSU ;
- moyen personnel ;
- refus d’évacuation.

---

# Refus d’évacuation

En cas de refus :
- ouverture d’une fiche dédiée ;
- modal intégrée ;
- support multilingue FR / EN ;
- signatures victime / témoins ;
- observations ;
- validation automatique si signature renseignée.

Le modèle actuel est provisoire dans l’attente du document officiel.

---

# Résumé / export

Fonctions disponibles :
- génération automatique du bilan ;
- copie presse-papier ;
- ouverture mail ;
- impression ;
- export PDF (amélioration en cours).

---

# Architecture projet

Le projet a été entièrement refactorisé vers une architecture modulaire.

## Structure actuelle

```text
src/
├── components/
│   ├── tabs/
│   │   ├── DepartTab.jsx
│   │   ├── PrimaireTab.jsx
│   │   ├── SecondaireTab.jsx
│   │   ├── GestesTab.jsx
│   │   ├── SamuTab.jsx
│   │   └── ResumeTab.jsx
│   │
│   ├── secondary/
│   │   └── WallaceSection.jsx
│   │
│   └── ui/
│       ├── Badge.jsx
│       ├── Button.jsx
│       ├── CardBlock.jsx
│       ├── Check.jsx
│       ├── Field.jsx
│       ├── Modal.jsx
│       ├── ScoreCard.jsx
│       └── SelectField.jsx
│
├── data/
├── utils/
```

---

# Technologies utilisées

- React
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React

---

# Workflow Git

Branches utilisées :

## main
Version stable.

## dev
Développement actif :
- nouvelles fonctionnalités ;
- refactorisation ;
- UI ;
- workflows opérationnels.

---

# Déploiement

Déployé via Vercel :

```text
https://bilan-ssuap.vercel.app
```

---

# Confidentialité

Les données :
- restent locales ;
- ne sont pas transmises automatiquement ;
- ne sont pas stockées sur serveur distant.

Aucune synchronisation distante n’est actuellement active.

---

# État du projet

La refactorisation structurelle principale est terminée.

Le projet dispose désormais :
- d’une architecture modulaire ;
- d’onglets indépendants ;
- d’une logique métier séparée ;
- d’une base stable et maintenable.

Le cœur opérationnel de l’application est fonctionnel.

---

# Roadmap

Fonctions prévues :
- amélioration export PDF ;
- signature tactile réelle ;
- fiche liaison SDIS ;
- optimisation impression A4 ;
- export bilan structuré ;
- mode hors ligne ;
- sauvegarde locale ;
- amélioration UX tablette ;
- application mobile native ;
- traduction multilingue étendue ;
- synchronisation sécurisée ;
- amélioration ergonomie terrain.

---

# Base documentaire

Le contenu et l’organisation du projet sont basés sur le GDTO SSUAP.

Ce projet reste :

```text
un outil d’aide opérationnel
```

et ne remplace jamais :
- les procédures officielles ;
- la régulation médicale ;
- les protocoles locaux ;
- les décisions du CA ;
- les décisions SAMU.