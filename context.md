# Contexte — Portfolio Sébastien Thomas

## Produit

Portfolio professionnel one-page de Sébastien Thomas, concepteur-développeur web et mobile.

Séquence desktop :

1. Hero blanc.
2. Carte noire qui devient plein écran.
3. Méthode : Échange, Conception, Développement, Livraison.
4. Formulaire de devis.
5. Contact « Écrivons-nous. » et footer, toujours dans la carte noire.

Les anciennes sections Expérience, Formation, Créations, carousel et frise ne font plus partie du site. Le contenu professionnel retiré reste archivé dans `EXPERIENCES.md`.

## Stack

- Vite 7
- TypeScript 5.9 strict
- CSS modulaire
- Tailwind CSS 4 via le plugin Vite
- Déploiement GitHub Pages sur `https://sebthms.github.io/sebthms/`

## Responsive

Deux modes exclusifs sont définis par `src/scroll/mediaQueries.ts`.

- Scène scroll animée : largeur supérieure à 1024 px et hauteur supérieure à 720 px.
- Flux naturel : largeur inférieure ou égale à 1024 px ou hauteur inférieure ou égale à 720 px.

Le query CSS correspondant doit rester identique dans `src/styles/mobile-flow.css`.

Le mode flux :

- désactive les positions fixes et absolues de la scène ;
- affiche toutes les étapes Méthode dans l'ordre ;
- empile le formulaire, Contact et le footer ;
- utilise une navigation burger jusqu'à 1024 px ;
- conserve des champs de formulaire à 16 px minimum.

## Architecture scroll

`src/scroll/scrollEngine.ts` est l'unique orchestrateur desktop :

1. calcule la progression brute du conteneur ;
2. applique une inertie légère sauf avec `prefers-reduced-motion` ;
3. produit un `ScrollContext` unique ;
4. appelle les phases Hero, Carte, Méthode, Devis et Contact ;
5. synchronise navigation et header.

`src/scroll/flowLayout.ts` court-circuite les phases en mode flux et restaure les styles initiaux.

Phases définies dans `src/scroll/constants.ts` :

- Hero : `0 → 0.10`
- Carte plein écran : `0.10 → 0.18`
- Méthode : entrée à `0.18`, dock jusqu'à `0.64`, sortie jusqu'à `0.80`
- Devis : entrée `0.70 → 0.80`, sortie `0.88 → 0.94`
- Contact : entrée `0.88 → 0.94`, puis état final

## Formulaire

Le formulaire ne possède pas de backend.

`src/quoteForm.ts` :

- valide les champs avec les contrôles natifs ;
- construit un objet et un corps d'e-mail ;
- ouvre l'application e-mail via `mailto:`.

Aucune donnée du formulaire n'est envoyée ou stockée par le site.

## SEO et pages

Entrées Vite :

- `index.html`
- `mentions-legales.html`
- `politique-confidentialite.html`
- `404.html`

Fichiers publics :

- `robots.txt`
- `sitemap.xml`
- `CNAME`
- `favicon.svg`
- `apple-touch-icon.png`
- `og-image.png`
- `pp.jpg`
                             - polices WOFF2 locales

Les assets de profil et de partage sont temporaires et doivent être remplacés par les versions finales.

## Données légales

Les pages légales contiennent uniquement les informations professionnelles publiables fournies par Sébastien :

- entrepreneur individuel ;
- SIREN et SIRET ;
- téléphone et e-mail professionnels ;
- localisation limitée à `34070 Montpellier, France` à sa demande ;
- TVA non applicable, article 293 B du CGI ;
- hébergement GitHub Pages.

La localisation abrégée peut être insuffisante au regard des obligations françaises applicables aux professionnels.

## Contraintes

- Ne pas réintroduire Expérience, Formation, Créations, carousel ou progress bar.
- Ne pas ajouter de snap au dock Méthode.
- Garder une seule source de progression desktop.
- Ne jamais couper les descriptions par `clip`, largeur animée ou hauteur fixe.
- Respecter `prefers-reduced-motion`.
- Maintenir les pages légales et le sitemap lors de tout changement de domaine ou d'hébergeur.
