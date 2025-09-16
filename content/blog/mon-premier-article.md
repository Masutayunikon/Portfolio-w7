---
title: "Créer un serveur multimédia automatisé avec Jellyfin et les apps *ARR*"
description: "Un guide pour installer Jellyfin, l’écosystème *ARR* et automatiser la gestion de votre médiathèque."
date: 2025-09-16
draft: false
tags: ["jellyfin", "runtipi", "arr", "automation", "sonarr", "radarr", "prowlarr", "qbittorrent"]
---




::div{.grid .space-y-4 .md:grid-cols-2 .gap-8 .my-6}
:::div{.space-y-4}
# 🎬 Créer un serveur multimédia automatisé

Pendant longtemps, j’ai cherché une solution simple pour gérer mes films et séries.

Avec **Jellyfin** et l’écosystème des apps *ARR*, j’ai pu construire un vrai Netflix maison 🚀.

Et grâce à **Runtipi**, le déploiement de toutes ces apps se fait en quelques clics.
:::


:::div{.bg-gray-900 .p-4 .rounded-lg .border .border-gray-700}
**Aperçu de la stack**
- Jellyfin (lecteur & médiathèque)
- Prowlarr / Sonarr / Radarr / FlareSolverr
- qBittorrent + VPN
- Runtipi (déploiement Docker)
- Wizard (gestion utilisateurs)
- Jellyseerr (demandes de contenu)
- Bazarr (sous-titres)
- Plugins Jellyfin (Intro Skipper, Media Cleaner, etc.)
::: 
::

---

::div{.grid .md:grid-cols-2 .gap-4 .my-6 .space-y-2}
:::div{.bg-gray-900 .p-4 .rounded-lg .border .border-gray-700}
## ⚡ Déploiement avec Runtipi
- Déploiement facile d’applications Dockerisées
- Store d’apps personnalisables
- Gestion centralisée des services
- Gestion des domains et proxy inverses intégrée
- Interface web intuitive

👉 J’ai même créé mon propre **App Store** pour y ajouter mes projets persos et des images custom [Masutayunikon/runtipi-appstore](https://github.com/Masutayunikon/runtipi-appstore){.inline-flex .items-center .gap-2 .px-3 .py-1 .rounded .bg-blue-600 .text-white .no-underline .hover:bg-blue-500}

:::

---

## 🎥 Installation de Jellyfin

::div{.grid .space-y-2 .md:grid-cols-2 .gap-4 .my-6}
:::div{.space-y-4}
Jellyfin est le **cœur** du serveur multimédia :

- Interface moderne et open-source
- Gestion multi-utilisateurs
- Support natif des plugins

Une fois installé via Runtipi, il suffit de configurer vos bibliothèques locales et… c’est parti 🍿.

---

## 🛠️ Les apps *ARR*


Pour automatiser la récupération de contenu, on s’appuie sur la famille des apps *ARR* :

::div{.grid .md:grid-cols-2 .gap-4 .my-6}
:::div{.bg-gray-900 .p-4 .rounded-lg .border .border-gray-700}
### 📡 Prowlarr
Indexeur centralisé qui alimente **Sonarr** et **Radarr**.
:::
:::div{.bg-gray-900 .p-4 .rounded-lg .border .border-gray-700}
### 📺 Sonarr
Automatise le téléchargement des **séries TV**.
:::
:::div{.bg-gray-900 .p-4 .rounded-lg .border .border-gray-700}
### 🎬 Radarr
Fait la même chose mais pour les **films**.
:::
:::div{.bg-gray-900 .p-4 .rounded-lg .border .border-gray-700}
### ☁️ FlareSolverr
Permet de contourner Cloudflare et facilite l’accès aux indexeurs.
:::


Et bien sûr :

::div{.bg-gray-900 .p-4 .rounded-lg .border .border-gray-700 .my-6}
### 🔒 qBittorrent + NordVPN
J’ai créé un conteneur custom qui combine **qBittorrent** avec **NordVPN**,  
afin de sécuriser mes téléchargements par défaut dispos via mon store Runtipi
::

---

## ⚙️ Automatisation complète

Une fois la stack mise en place, l’objectif est de **ne plus rien faire à la main** ✨.

### 🧙 Wizard
Permet d’envoyer un simple lien d’inscription à mes amis → création de compte Jellyfin et Jellyseerr instantanée.

### 🪼 Jellyseerr
Interface de demandes : les utilisateurs demandent un film ou une série,  
→ les requêtes sont automatiquement validées  
→ **Radarr** et **Sonarr** cherchent et téléchargent le contenu.

> 💡 Dans mon cas, j’ai configuré :
> -  -> Qualité max **1080p**
> -  -> Taille max **10 Go**

---

## 🧩 Plugins Jellyfin indispensables

::div{.grid .md:grid-cols-2 .gap-4 .my-6}
:::div{.bg-gray-900 .p-4 .rounded-lg .border .border-gray-700}
🎬 **Intro Skipper**  
Passe automatiquement les intros des séries.
:::
:::div{.bg-gray-900 .p-4 .rounded-lg .border .border-gray-700}
🧹 **Media Cleaner**  
Supprime les fichiers non lus depuis **X mois**.
:::
:::div{.bg-gray-900 .p-4 .rounded-lg .border .border-gray-700}
⏱ **Chapter Creator**  
Ajoute automatiquement des chapitres aux films et series.
:::
:::div{.bg-gray-900 .p-4 .rounded-lg .border .border-gray-700}
🖼 **Thumbnail Screenshots**  
Affiche une **prévisualisation image** au survol de la barre de lecture.
:::


Et pour les sous-titres : **Bazarr** gère leur téléchargement et leur synchro et opensubtitles pour le plugin **Subtitles** de Jellyfin.

---

## ✅ Conclusion

Avec cet écosystème, j’ai aujourd’hui :
- Un serveur multimédia complet
- Une automatisation **de la demande au visionnage**
- Une gestion simple des utilisateurs

👉 Résultat : je peux inviter mes amis avec Wizard,  
ils demandent un film, et en quelques minutes, il est dispo sur Jellyfin 🎉.

C’est un peu comme héberger son propre **Netflix personnalisé**.

Dans un prochain article, je détaillerai comment j’ai branché tout ça à **Traefik + Certbot** pour sécuriser l’accès avec HTTPS 🔐.
