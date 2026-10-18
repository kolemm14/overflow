# Fichiers créés et modifiés — Ease Pro 3.0.5

## Extension livrée

- `CSXS/manifest.xml` : identité CEP `com.easepro.ae2020`, menu Ease Pro et compatibilité After Effects 2020.
- `index.html` : structure responsive en trois zones.
- `css/style.css` : thème sombre proche d'After Effects et adaptation aux panneaux étroits.
- `js/curves.js` : bibliothèque originale de 55 courbes, incluant les graphes edit, impact et pro demandés.
- `js/graph-editor.js` : éditeur Bézier manuel, poignées déplaçables, miniatures et aperçu animé.
- `js/main.js` : sélection, filtrage, synchronisation des paramètres et commandes de l'interface.
- `js/bridge.js` : communication sécurisée entre l'interface CEP et After Effects.
- `js/presets.js` : sauvegarde locale et import/export JSON.
- `jsx/host.jsx` : application aux keyframes, In/Out séparés, copier/coller et Custom Bounce Pro, avec groupes d'annulation.
- `README.md` : installation et utilisation.
- `CHANGELOG.md` : historique des versions.
- `DIAGNOSTIC-CRASH.md` : cause du crash de l'ancienne version ScriptUI et solution retenue.

## Paquets générés

- `EasePro-3.0.5-AE2020-stable.zip` : archive installable optimisée pour les longues sessions.

## Correctifs 3.0.5

- `js/graph-editor.js` : aperçu limité à 20 i/s et suspendu quand il n'est pas visible.
- `js/main.js` : reprise et suspension propres de l'aperçu.
- `js/bridge.js` et `jsx/host.jsx` : moteur hôte chargé une seule fois par session.
- `CSXS/manifest.xml`, `index.html`, `README.md`, `CHANGELOG.md` : version et documentation actualisées.
- Original 3.0.4 préservé dans `%APPDATA%\Adobe\CEP\extensions\_backups\com.easepro.ae2020-3.0.4-before-memory-fix-20260913`.
- `js/bridge.js` : chargement fiable de l’hôte ExtendScript avant chaque commande.
- `jsx/host.jsx` : application des courbes et détection sans doublon des propriétés sélectionnées.

## Originaux préservés

Les installations locales de Flow et Kease n'ont pas été modifiées. Aucun code, preset ou asset propriétaire n'a été copié. L'ancienne installation CEP KeyFlow a été déplacée dans une sauvegarde de travail avant l'installation d'Ease Pro.
