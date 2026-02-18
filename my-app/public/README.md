# TEST_PLAN.md

## Registration Module 

## 1️⃣ Objectif
- Intégrer une logique métier testée dans un composant React.
- Valider le comportement de l'interface (DOM) via des tests d'intégration.
- Garantir le feedback utilisateur (erreurs visuelles, états désactivés).
- Formaliser la stratégie de test via un plan de test.
- Integration Tests (IT) → interaction UI + logique


## 2️⃣ Stratégie globale
| Type de test | 	Objectif                                  |	Outil | 
|--------------|--------------------------------------------|--------|
|Unit Tests	 | Vérifier la logique métier pure	           | Jest
|Integration Tests	| Vérifier le comportement utilisateur	      |React Testing Library
|DOM Assertions | 	Vérifier affichage, erreurs, état bouton  |	RTL
| Persistence	| Vérifier localStorage	| Jest + jsdom

## 3️⃣ Unit Tests (UT)
### 3.1 validator.js

**validatePostCode**

_Cas couverts :_

* ✅ Code valide français (5 chiffres)
* ❌ Code trop court
* ❌ Code contenant des lettres
* ❌ Paramètre non string

**validateEmail**

_Cas couverts :_

* ✅ Email valide
* ❌ Email sans @
* ❌ Email sans domaine
* ❌ Email mal formaté
* ❌ Paramètre non string

**validateIdentity**

_Cas couverts :_

* ✅ Noms avec accents
* ✅ Noms avec espaces
* ❌ Caractères interdits (< >)
* ❌ Champ vide
* ❌ Paramètre non string

### 3.2 module.js – calculateAge

_Cas couverts :_

* ✅ Personne >= 18 ans
* ❌ Personne < 18 ans
* ❌ Date dans le futur
* ❌ Paramètre manquant
* ❌ Paramètre non objet
* ❌ birth non Date

## 4️⃣ Integration Tests (IT)
Les tests d’intégration vérifient la cohérence entre : **l'UI, la validation métier, le DOM  et localStorage**

### 4.1 Rendu du composant
* ✅ Le formulaire est présent dans le DOM
* ✅ Les champs sont affichés
* ✅ Le bouton Submit est visible

### 4.2 Validation utilisateur (chaotic user)
_Scénario simulé :_

* Utilisateur clique sur Submit sans remplir
* Les erreurs apparaissent
* Les erreurs sont affichées en rouge
* Le bouton est désactivé
* L’utilisateur corrige un champ
* L’erreur disparaît
* Le bouton devient actif si tout est valide

### 4.3 Validation au blur

* ✅ Erreur affichée après sortie du champ
* ✅ Validation en temps réel si champ déjà touché


### 4.4 Soumission valide


* ✅ Formulaire rempli correctement
* ✅ Aucune erreur affichée
* ✅ localStorage.setItem est appelé
* ✅ Données stockées en JSON
* ✅ Formulaire réinitialisé
* ✅ Message de succès affiché
