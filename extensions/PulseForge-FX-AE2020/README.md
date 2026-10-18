# PulseForge FX — After Effects 2020

PulseForge FX est un panneau CEP original et gratuit qui construit six effets avancés à partir des fonctions natives d'After Effects 2020.

## Modules

- **Camera Pulse** : shake organique en position et rotation, seed, fréquence, flou et décroissance automatique sur un nombre de frames réglable.
- **Luma Bloom** : double glow avec cœur, aura, seuil, rayon, exposition et gamma.
- **Optical Retime** : Time Remapping, ralentissement et interpolation Pixel Motion.
- **Vector Trail** : calque d'effet global utilisant Pixel Motion Blur ou CC Force Motion Blur selon les composants disponibles.
- **Mirror Zoom** : Motion Tile, Transform et flou radial pour les transitions zoom/whip sans bords noirs.
- **Spectrum Split** : deux copies rouge/bleue décalées avec masque périphérique progressif.

## Installation effectuée

Le panneau est installé dans `%APPDATA%\Adobe\CEP\extensions\com.pulseforge.fx.ae2020`.

Relancez After Effects puis choisissez **Window > Extensions > PulseForge FX**.

## Utilisation

1. Ouvrez une composition.
2. Sélectionnez un ou plusieurs calques, sauf pour Vector Trail qui crée son propre calque d'effet.
3. Choisissez un module et ajustez ses paramètres.
4. Cliquez sur **Appliquer l'effet**.
5. Animez ensuite les contrôles préfixés `PF` dans Effect Controls. Ease Pro peut servir à façonner leurs keyframes.

Chaque application est regroupée dans une seule opération d'annulation. Les résultats restent des piles d'effets natives modifiables ; ils ne reproduisent pas les algorithmes propriétaires de Sapphire, Deep Glow, Twixtor ou RSMB.
