# Ease Pro — After Effects 2020

Ease Pro est un panneau CEP dockable original pour créer, modifier et réutiliser des easings dans After Effects 2020.

## Fonctions principales

- interface responsive en trois zones : bibliothèque, éditeur et actions ;
- plus de 50 courbes intégrées, des bases aux graphes pour AMV/GMV/edits ;
- éditeur Bézier avec poignées directement déplaçables ;
- miniatures de courbes, catégories et trois vues de bibliothèque ;
- paramètres synchronisés : Influence, Vitesse, Ease In et Ease Out ;
- application complète, entrée seulement ou sortie seulement ;
- copie et collage d'easing ;
- inversion, adoucissement, accentuation et linéarisation ;
- Custom Bounce Pro avec trois clés intermédiaires amorties ;
- presets utilisateur persistants et import/export JSON ;
- groupes d'annulation After Effects.

## Ouvrir le panneau

La version livrée a déjà été installée pour l'utilisateur Windows actuel dans :

`%APPDATA%\Adobe\CEP\extensions\com.easepro.ae2020`

Fermez complètement After Effects, relancez-le, puis choisissez **Window > Extensions > Ease Pro**.

Pour une installation manuelle sur un autre ordinateur, installez le fichier signé `Ease-Pro-3.0.2-AE2020.zxp` avec un installateur ZXP compatible, redémarrez After Effects, puis ouvrez le même menu. Ne lancez plus l'ancien panneau **Window > KeyFlow.jsx**, qui correspond à la version ScriptUI instable conservée uniquement comme archive.

## Workflow rapide

1. Sélectionnez une ou plusieurs keyframes dans la composition active.
2. Choisissez une carte de courbe ou déplacez les poignées dans l'éditeur.
3. Ajustez Influence, Vitesse, Ease In ou Ease Out si nécessaire.
4. Cliquez sur **Appliquer aux keyframes**.

Les boutons **Appliquer In** et **Appliquer Out** ne remplacent que le côté correspondant de l'easing. `Ctrl+Z` annule une application entière en une fois.

## Custom Bounce Pro

Sélectionnez deux keyframes sur une même propriété, puis choisissez Custom Bounce Pro et appliquez. Ease Pro ajoute trois clés intermédiaires avec un rebond amorti. Cette opération est entièrement annulable en une étape.

## Compatibilité

- Adobe After Effects 2020, hôte 17.x ;
- CEP 10 et ExtendScript ;
- Position, Échelle, Rotation, Opacité, Point d'ancrage, effets et propriétés numériques compatibles ;
- dimensions séparées et sélections sur plusieurs propriétés prises en charge lorsque l'API AE le permet.

L'interface et le code sont originaux. Aucun fichier propriétaire de Flow, KeyEase ou d'un pack commercial n'est inclus.
