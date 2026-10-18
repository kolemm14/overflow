# Diagnostic du crash AE 2020

Le rapport `AfterFX_2026-09-11_233856_KB--HP.crash` a été lu localement sans être envoyé ni modifié.

Constats :

- After Effects 17.7 a subi une `EXCEPTION_ACCESS_VIOLATION` ;
- le thread en faute se trouvait dans les routines de dessin `dvaui::controls` ;
- `ae_dvascriptui.dll` était chargé dans le processus ;
- le panneau KeyFlow 1.x utilisait précisément le rendu personnalisé et l'actualisation forcée de ScriptUI.

Correction retenue :

- remplacement complet de l'interface ScriptUI par une interface CEP/HTML Canvas ;
- absence de boucle de rafraîchissement ;
- aucune écriture dans le projet pendant le déplacement des poignées ;
- appels ExtendScript limités aux boutons Appliquer, Copier, Coller, Continu, Linéaire et Maintien ;
- chaque modification d'images clés reste contenue dans un groupe d'annulation AE.

