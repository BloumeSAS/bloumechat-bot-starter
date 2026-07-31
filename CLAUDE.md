# bloumechatbotexemple/ — Règles module (Bot Template de référence)

Ce fichier complète `CLAUDE.md` à la racine du repo — évite de perdre le contexte si une session démarre directement ici plutôt qu'à la racine.

## Mémoire persistante — TOUJOURS consulter en premier
1. `C:\Users\super\Documents\Obsidian\Bloume SAS\Bloume SAS\Context\Memory\BloumeChat.md` (index racine)
2. `C:\Users\super\Documents\Obsidian\Bloume SAS\Bloume SAS\Projects\bloumechat\botexemple\Memory.md` (MOC du module)

## Ce module
- Implémentation de référence utilisant le SDK **npm publié** `bloumechat` (voir règle #16 racine) — jamais la source locale `webapp/lib/sdk/` directement.
- Après CHAQUE bump du SDK publié, revérifier si des casts `as any`/workarounds temporaires dans ce repo peuvent être retirés (le SDK avance plus vite que ce template).
- Pattern de commande : toujours `export default command` (pas `export const command`).
- Un bot N'A PAS d'amis, ne rejoint pas lui-même un serveur (`joinServer` n'existe pas), et ne lit pas l'inbox du compte (pas de `fetchNotifications`) — décision produit stable du SDK, ne pas essayer de la contourner ici.

## Rappel
Fichier qui dépasse ~200 lignes ou mélange les responsabilités → split immédiat — règle #17.
