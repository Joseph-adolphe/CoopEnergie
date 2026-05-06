# CoopEnergie — Application mobile (Expo)

Prototype mobile créé avec Expo. Ce dépôt contient l'interface et le prototype de navigation pour l'application CoopEnergie.

## Démarrage rapide

1. Installer les dépendances

```bash
npm install
```

2. Lancer le projet

```bash
npx expo start
```

Ouvrez ensuite sur un simulateur, un appareil ou Expo Go selon vos besoins.

## Structure du projet

La structure principale du dépôt :

```
CoopEnergie/
   app/                   # Routes Expo (file-based routing)
      (tabs)/              # Layout tabs + dossiers de pages
         _layout.tsx
         accueil/
         onboarding/
         connexion/
         inscription/
         cooperative/
         marketplace/
         fournisseurs/
         compte/
   components/            # Composants réutilisables
      ui/                  # Composants UI (button, input, chart, card...)
      themed-text.tsx
      themed-view.tsx
      haptic-tab.tsx
   constants/
      theme.ts              # Tokens du design system (couleurs, espacements)
   hooks/                 # Hooks partagés (use-theme-color...)
   assets/                # Images et ressources
   package.json
   README.md
```

## Routage et pages

Ce projet utilise le routing basé sur le système de fichiers d'Expo Router. Chaque dossier sous `app/` peut contenir un `_layout.tsx` pour définir une stack ou un layout, et des fichiers `index.tsx` / `[id].tsx` pour les écrans.

Principaux espaces (onglets) : `accueil`, `marketplace`, `cooperative`, `fournisseurs`, `compte`.

Flows importants :

- `app/(tabs)/onboarding` — suites d'écrans d'onboarding (6 écrans)
- `app/(tabs)/connexion` — connexion, OTP, mot de passe oublié, réinitialisation
- `app/(tabs)/inscription` — inscription et OTP

## Design system

Les tokens de couleurs et d'espacement sont centralisés dans `constants/theme.ts`.

## Composants réutilisables

`components/ui` contient des composants prototypes utilisés dans l'app :

- `button.tsx` (primary, secondary, ghost, icon)
- `input.tsx`
- `chart-bar.tsx`, `chart-pie.tsx`
- `card.tsx`, `list-item.tsx`, `dialog.tsx`
- `tabs.tsx`, `avatar.tsx`, `icon-symbol.tsx`


## Identifiants de test

Utilisez ces mots de passe de test pour valider rapidement les redirections :

- Fournisseur : mot de passe `fournisseur123` (redirection vers `/fournisseurs`).
- Utilisateur standard : mot de passe `password123` (redirection vers `/accueil`).

> Important : ces mots de passe sont uniquement pour le prototype local. Ne laissez pas de secrets codés en dur en production.


