# Changements

## 3.0.5 — 13 septembre 2026

- aperçu animé plafonné à 20 i/s au lieu d'un rafraîchissement continu à environ 60 i/s ;
- arrêt complet de l'animation quand l'aperçu est décoché ou que le panneau est masqué ;
- chargement unique du moteur ExtendScript par session, ce qui évite de recréer ses fonctions à chaque clic ;
- conservation en mémoire de l'easing copié entre les commandes Copier et Coller ;
- sauvegarde intacte de la version 3.0.4 avant correction.

## 3.0.4 — 13 septembre 2026

- Chargement explicite de `host.jsx` dans le moteur ExtendScript utilisé par chaque commande CEP.
- Suppression de l’erreur « Unable to execute script at line 1 » lors de l’application d’une courbe.
- Retour d’erreur lisible dans le panneau au lieu d’une boîte de dialogue de débogage.

## 3.0.2 — 12 septembre 2026

- bouton principal Appliquer déplacé directement sous le graphe ;
- commandes Appliquer In et Appliquer Out rapprochées de la zone de modification ;
- disposition compacte à deux lignes dans les panneaux étroits.

## 3.0.1 — 12 septembre 2026

- barre de défilement verticale réduite à 6 px ;
- piste blanche remplacée par une piste sombre assortie à After Effects ;
- boutons de défilement natifs masqués.

## 3.0.0 — 12 septembre 2026

- nouvelle identité Ease Pro ;
- interface dockable complète à trois colonnes ;
- bibliothèque filtrable avec miniatures ;
- éditeur Bézier agrandi avec barre d'outils ;
- sliders synchronisés Influence, Vitesse, Ease In et Ease Out ;
- application complète, In seulement ou Out seulement ;
- presets persistants et import/export JSON ;
- mise en page responsive pour panneaux étroits.

## 2.2.1 — 12 septembre 2026

- nom affiché simplifié de `KeyFlow 2` vers `KeyFlow` dans le menu, le panneau et les groupes d'annulation.

## 2.2.0 — 12 septembre 2026

- ajout de Flow Graph Pro avec vitesse non nulle aux extrémités ;
- ajout de Whip Surgical, Pump Pro et Twixtor Butter ;
- ajout de Custom Bounce Pro, générant trois clés intermédiaires amorties ;
- passage de 40 à 45 presets originaux.

## 2.1.0 — 12 septembre 2026

- passage de 16 à 40 presets originaux ;
- ajout de familles Impact, Cut, Shake, Zoom, Whip, Camera, Speed Ramp, Smooth, Text et Elastic ;
- plage verticale du graphe étendue de -1 à 2 pour modifier manuellement les overshoots forts ;
- aucun preset commercial tiers copié.

## 2.0.0 — 12 septembre 2026

- remplacement de l'interface ScriptUI instable par CEP/HTML Canvas ;
- ajout de deux poignées Bézier déplaçables manuellement ;
- synchronisation des poignées avec les coordonnées numériques ;
- ajout de 16 presets pour les edits : Impact, décélération, accélération, cloche, overshoot, anticipation, rebond, élastique, linéaire et maintien ;
- ajout des commandes miroir, continu, copier et coller ;
- ajout des presets personnels ;
- création d'un paquet ZXP signé pour After Effects 2020 / CEP 10 ;
- installation dans le dossier CEP utilisateur sans modifier Flow ni Kease.
## 3.0.3

- Correction de la détection des keyframes sélectionnées dans les calques et propriétés.
- Application In/Out limitée aux segments qui possèdent réellement une clé voisine.
- Les propriétés incompatibles sont ignorées sans bloquer les autres keyframes.
- Retour de statut plus clair après application.
- Retrait de l'ancienne signature CEP devenue invalide afin que le panneau puisse s'ouvrir en mode développement sur After Effects 2020.
