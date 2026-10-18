# EditTools Free — After Effects 2020

## Correctif 1.0.1

Le moteur After Effects est chargé explicitement lors de la première commande. Les boutons **Vérifier la sélection** et **Appliquer** fonctionnent ainsi dans le même contexte ExtendScript. Si un effet natif est indisponible, le panneau affiche maintenant son nom au lieu d'échouer silencieusement.

Panneau CEP original et gratuit qui construit des piles d'effets avec les outils natifs d'After Effects. Il ne contient aucun code, preset ou asset provenant des produits commerciaux auxquels il sert d'alternative.

## Modules

| Module gratuit | Besoin couvert |
|---|---|
| Impact FX | impacts, glows et distorsions de type Sapphire |
| Core FX | boîte à effets généraliste de type BCC |
| Style Lab | stylisation et finition de type Red Giant |
| Motion Flow | ralentis et speed ramps de type Twixtor, avec Pixel Motion natif |
| Color Lab | looks et étalonnage de type Magic Bullet Looks |
| Lens Light | flare lumineux de type Optical Flares |
| Pixel Shift | traînées et cassures de pixels de type Pixel Sorter |
| Signal Clean | glitch propre de type Signal |
| Glitch Stack | distorsion de type Glitchify |
| Poly Trace | contours graphiques de type Polytrace |

Ces modules visent les mêmes usages créatifs, mais ne reproduisent pas les algorithmes propriétaires. Motion Flow dépend notamment de la qualité du Pixel Motion d'After Effects et peut demander un pré-rendu sur les plans difficiles.

## Installation effectuée

Le panneau est installé dans `%APPDATA%\Adobe\CEP\extensions\com.edittools.free.ae2020`.

Fermez complètement After Effects, relancez-le, puis ouvrez **Window > Extensions > EditTools Free**.

## Utilisation

1. Ouvrez une composition et sélectionnez un ou plusieurs calques.
2. Choisissez un module.
3. Cliquez sur **Appliquer aux calques**.
4. Modifiez les effets créés, préfixés `ETF -`, dans Effect Controls.

Le bouton Lens Light crée son propre calque. Chaque application est regroupée en une seule opération `Ctrl+Z`.
