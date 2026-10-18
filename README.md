# Suite Motion Design pour After Effects

Collection de panneaux CEP et de plugins natifs pour accelerer l'animation, les operations de calques et la creation d'effets dans Adobe After Effects. Les fonctions ci-dessous decrivent les fichiers presents dans ce depot ; les compatibilites indiquees sont celles declarees par les manifestes, pas une certification de test sur chaque version.

## Vue d'ensemble

| Outil | Domaine | Contenu disponible |
| --- | --- | --- |
| Curve Fusion | Courbes d'animation | Editeur de courbe Bezier, presets et commandes d'interpolation. |
| Ease Pro | Easing et images cles | Bibliotheque de courbes, edition Bezier et application d'easing. |
| EditTools Free | Productivite | Dix modules construits avec les effets natifs d'After Effects. |
| FXP Twitch | Effets dynamiques | Panneau de controle Blur, Color, Light, Scale, Slide et Time. |
| FXP Twitch 3 | Effets dynamiques | Variante de developpement avec controles Slide, Scale, Rotation, Light, Blur, Color et RGB. |
| OVER FLOW | Outils d'animation | Courbes, interpolation, calques, presets simples et commandes de composition. |
| PulseForge FX | Effets creatifs | Camera Pulse, Luma Bloom, Optical Retime, Vector Trail, Mirror Zoom et Spectrum Split. |
| FX Pro Native | Plugins natifs | Sept effets `.aex` pour After Effects 2020. |

Les noms FXP Twitch et FXP Twitch 3 designent ici les panneaux de ce depot. Ils ne sont pas le produit officiel Twitch de Video Copilot et ne doivent pas etre confondus avec celui-ci.

## Outils

### Curve Fusion 2018

Editeur CEP de courbes Bezier avec points de controle manipulables, presets et options entree/sortie. Les commandes incluent appliquer, miroir, copier/coller l'easing, lineaire, maintien, vitesse nulle et continuite.

Compatibilite declaree : After Effects 15.x (CC 2018).

### Ease Pro

Panneau CEP d'interpolation et d'easing : courbes integrees, poignees Bezier, application complete ou partielle, copie/collage, inversion, adoucissement, accentuation, linearisation et Custom Bounce Pro. L'extension comprend egalement des presets utilisateur.

Compatibilite declaree : After Effects 15.x a 18.x. La documentation du paquet decrit surtout AE 2020 ; verifiez le comportement dans votre version.

### EditTools Free

Panneau CEP qui compose des piles avec les effets natifs d'After Effects. Ses modules couvrent Impact FX, Core FX, Style Lab, Motion Flow, Color Lab, Lens Light, Pixel Shift, Signal Clean, Glitch Stack et Poly Trace. Motion Flow depend notamment de Pixel Motion et peut demander un pre-rendu sur certains plans.

Compatibilite declaree : After Effects 17.x a 18.x.

### FXP Twitch

Panneau de controle avec six groupes de reglages : Blur, Color, Light, Scale, Slide et Time. Il cree un calque d'ajustement et configure des effets et controles natifs pour produire des variations dynamiques. Ce paquet est distinct du plugin commercial Video Copilot Twitch.

Compatibilite declaree : After Effects 17.x a 18.x.

### FXP Twitch 3

Variante de developpement independante. Sa documentation decrit des styles Slide, Scale, Rotation, Light, Blur, Color et RGB, avec vitesse, graine aleatoire, chance, hold et decay. Le rendu complet et les performances ne sont pas valides ; travaille sur une copie du projet et teste avant usage en production.

Compatibilite declaree : After Effects 17.x a 18.x. Le test de creation documente a ete fait dans AE 2020, mais le test complet de rendu n'a pas abouti.

### OVER FLOW

Boite a outils CEP regroupant notamment l'edition de courbes Bezier, presets d'easing, commandes d'interpolation, centrage et point d'ancrage, creation de calques, bascule d'effets et de motion blur, renommage et Text Exploder.

Compatibilite declaree : After Effects 15.0 a 17.9. L'extension inclut une licence MIT.

Sous Windows, ferme After Effects et lance [l'installeur OVER FLOW](extensions/Overflow-AE2018/INSTALL_OVERFLOW.cmd). Relance After Effects puis ouvre **Window > Extensions > OVER FLOW**. Les autres panneaux disposent de leurs propres consignes dans les sous-dossiers.

### PulseForge FX

Panneau CEP qui construit des effets modifiables avec les outils natifs : Camera Pulse, Luma Bloom, Optical Retime, Vector Trail, Mirror Zoom et Spectrum Split. Il ajoute des controles et expressions aux calques pour regler les resultats dans Effect Controls. Les algorithmes et performances des plugins commerciaux cites dans la documentation ne sont pas reproduits.

Compatibilite declaree : After Effects 17.x a 18.x.

### FX Pro Native

Sept plugins natifs compiles pour Windows et After Effects 2020 : AuraGlow, Impact, MotionBlur, RGBSplit, Shake, SmoothTime et ZoomWhip. Le dossier comprend aussi un visuel de marque.

![Logo FX Pro](plugins/FX%20Pro/fxpro-logo.png)

Copie le dossier `plugins/FX Pro/` dans le dossier `Plug-ins` d'After Effects 2020. Ces binaires ne sont pas fournis avec leur code source dans la version actuelle du depot.

## Apercus

Exemple de rendu texte fourni avec PulseForge FX :

![Exemple de texte metal bleu PulseForge FX](extensions/PulseForge-FX-AE2020/assets/presets/fxpro-metal-blue-text.png)

## Installation et compatibilite

Les dossiers de chaque extension contiennent leurs fichiers CEP et, lorsqu'ils existent, leur README ou leurs notes d'installation. Les plages de versions ci-dessus proviennent des manifestes. Elles ne remplacent pas des tests sur la version d'After Effects utilisee.

Les fichiers `.aex` du dossier FX Pro sont des plugins Windows. Aucun installateur commun n'est fourni pour l'ensemble de la suite.

## Contenu non inclus

- Keshav Velo : extension tierce installee localement avec de nombreux medias, presets et une police ; aucune autorisation de redistribution n'a ete identifiee.
- Les plugins tiers installes avec Adobe ou d'autres editeurs, les archives de migration et les anciens manifestes de sauvegarde.
- Les fichiers `.ffx` du dossier de presets utilisateur.

## Licences et attribution

La licence MIT d'OVER FLOW est incluse dans son dossier. Les autres extensions et les plugins FX Pro ne comportent pas de licence de redistribution explicite dans les fichiers publies. Leur presence dans ce depot public n'accorde pas de droits supplementaires ; verifie les autorisations avant redistribution ou reutilisation.

Les references a des produits commerciaux servent uniquement a situer certains usages. FXP Twitch n'est pas Video Copilot Twitch, et ces extensions ne pretendent pas reproduire les algorithmes proprietaires de produits tiers.