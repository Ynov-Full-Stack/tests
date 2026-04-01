# Test Plan - User Registration Form

## Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Tests Unitaires (UT)](#tests-unitaires-ut)
- [Tests d'Intégration (IT)](#tests-dintégration-it)
- [Couverture de Code](#couverture-de-code)
- [Stratégie de Test](#stratégie-de-test)
- [Mocks (IT & E2E)](#mocks)

---

## Vue d'ensemble

Ce projet implémente un formulaire d'inscription utilisateur avec validation en temps réel. La stratégie de test adopte une approche pyramidale :

- **Tests Unitaires (UT)** : Validation de la logique métier isolée (validators)
- **Tests d'Intégration (IT)** : Validation de l'interface utilisateur et de l'intégration des composants

**Total des tests** : 151 tests
**Couverture de code** : 100%

---

## Tests Unitaires (UT)

Les tests unitaires se concentrent sur la validation des règles métier de manière isolée, sans dépendance UI.

### 1. ageValidator.test.js (19 tests)

#### Scénarios couverts :

- **Validation basique**
    - Rejette une date de naissance undefined
    - Rejette une date de naissance null
    - Rejette un type non-Date (string, number, object, array)
    - Rejette une date invalide (Invalid Date)
- **Validation d'âge**
    - Rejette les utilisateurs de moins de 18 ans (0, 10, 17 ans)
    - Accepte les utilisateurs de 18 ans exactement
    - Accepte les utilisateurs de plus de 18 ans (19, 25, 50, 100 ans)
- **Edge cases temporels**
    - Gère correctement les anniversaires (1 jour avant 18 ans)
    - Gère les années bissextiles
    - Rejette les dates futures
    - Rejette les âges irréalistes (> 150 ans)

- **Date de référence custom**
    - Permet de spécifier une date de référence pour les calculs

### 2. emailValidator.test.js (26 tests)

#### Scénarios couverts :

- **Validation basique**
    - Rejette email undefined/null
    - Rejette types invalides (number, boolean, object, array)
    - Rejette chaînes vides ou whitespace uniquement
    - Rejette espaces avant/après
- **Format d'email**
    - Rejette emails sans @
    - Rejette emails sans domaine
    - Rejette domaines invalides (sans TLD, TLD court)
    - Accepte formats valides (simple, avec points, chiffres, tirets)
    - Accepte sous-domaines
- **Edge cases spécifiques**
    - Rejette points consécutifs (..)
    - Rejette point au début/fin de la partie locale
    - Rejette emails trop longs (> 254 caractères)
- **Sécurité**
    - Détecte tentatives XSS

### 3. identityValidator.test.js (36 tests)

#### Scénarios couverts :

- **Validation basique**
    - Rejette valeurs undefined/null
    - Rejette types non-string (number, boolean, object, array)
    - Rejette chaînes vides ou whitespace
    - Rejette espaces avant/après
- **Longueur**
    - Rejette noms trop courts (< 2 caractères)
    - Accepte longueurs valides (2-50 caractères)
    - Rejette noms trop longs (> 50 caractères)
- **Caractères autorisés**
    - Accepte lettres simples, accents, espaces, traits d'union, apostrophes
    - Accepte noms composés (Jean-Pierre, Marie Claire, O'Connor)
    - Rejette chiffres et caractères spéciaux (@, #, $, etc.)
- **Edge cases**
    - Gère correctement les caractères Unicode (émojis, caractères chinois)
- **Sécurité**
    - Détecte tentatives XSS multiples

### 4. postalCodeValidator.test.js (16 tests)

#### Scénarios couverts :

- **Validation basique**
    - Rejette valeurs undefined/null
    - Rejette types non-string
    - Rejette chaînes vides
- **Format**
    - Accepte codes valides (5 chiffres : 75001, 69001, 01000)
    - Rejette codes trop courts (< 5 chiffres)
    - Rejette codes trop longs (> 5 chiffres)
    - Rejette lettres et caractères spéciaux
    - Rejette espaces et tirets
- **Edge cases**
    - Accepte codes commençant par 0 (01000, 00100)

### 5. userValidator.test.js (39 tests)

#### Scénarios couverts :

- **Validation complète d'utilisateur**
    - Valide tous les champs simultanément
    - Rejette objets undefined/null/non-objet
    - Rejette champs manquants (firstName, lastName, email, birthDate, postalCode, city)
- **Validation individuelle des champs**
    - firstName invalide (trop court, chiffres, XSS)
    - lastName invalide (vide, type invalide, caractères spéciaux)
    - email invalide (format, XSS)
    - birthDate invalide (type, mineur, future)
    - postalCode invalide (format, longueur)
    - city invalide (chiffres, trop court)
- **Scénarios de succès**
    - Accepte utilisateurs valides (plusieurs profils types)

---

### 6. userValidator.test.js (19 tests)
#### Scénarios couverts :
- **Validation basique**
  - Accepte noms de villes non vides 
  - Supprime les espaces avant validation (trim)
  - Accepte villes composées d’une seule lettre 
  - Accepte villes avec espaces ou tirets 
  - Accepte caractères accentués et Unicode

- **Rejets des valeurs invalides**
  - Rejette null 
  - Rejette undefined 
  - Rejette chaîne vide ""
  - Rejette chaînes composées uniquement de whitespace 
  - Rejette types non-string (number, object, array)
  
- **Gestion des erreurs**
  - Lance une instance de ValidationError
  - Retourne le message "City must not be empty"
  - Edge cases
  - Gère correctement les caractères internationaux (São Paulo, 東京)
  - Rejette entrées avec uniquement espaces, tabulations ou sauts de ligne


## Tests d'Intégration (IT)

Les tests d'intégration valident l'interaction entre l'UI et la logique métier, simulant le comportement d'un utilisateur réel.

### UserForm.test.jsx (20 tests)

#### 1. Rendu et Structure du Formulaire

- Affiche tous les champs requis avec leurs labels
- Bouton submit désactivé initialement

#### 2. Validation en Temps Réel (Feedback immédiat)

- Affiche erreur pour firstName invalide (après blur)
- Affiche erreur pour lastName avec chiffres
- Affiche erreur pour email invalide
- Affiche erreur pour utilisateur mineur (< 18 ans)
- Affiche erreur pour code postal invalide

#### 3. Comportement Utilisateur "Chaotique"

- Gère corrections multiples : saisies invalides → corrections → re-saisies
    - Teste name : invalide → corrigé
    - Teste email : invalide → corrigé
    - Teste postalCode : lettres → chiffres valides
    - Vérifie que le bouton reste désactivé tant que formulaire incomplet

#### 4. Activation du Bouton Submit

- Active le bouton quand tous les champs sont valides

#### 5. Soumission du Formulaire

- Sauvegarde dans localStorage avec timestamp
- Vérifie structure des données sauvegardées
- Affiche toast de succès avec paramètres corrects
- Vide tous les champs après soumission
- Désactive à nouveau le bouton après reset

#### 6. Sécurité XSS

- Détecte et bloque tentatives XSS dans firstName

#### 7. Correction d'Erreurs

- Messages d'erreur disparaissent lors de la correction
- Peut afficher plusieurs erreurs simultanément

#### 8. Formulaires Partiels

- Bouton reste désactivé avec formulaire partiellement rempli

#### 9. Edge Cases Spécifiques

- Accepte utilisateur de exactement 18 ans
- Validation en temps réel après premier touch du champ
- Rejette dates de naissance futures
- Accepte codes postaux commençant par 0
- Rejette villes avec chiffres ou caractères spéciaux
- Rejette âges irréalistes (> 150 ans)

#### 10. Validation Négative

- Ne soumet pas le formulaire si données invalides (branche else du handleSubmit)

---

## Couverture de Code

```
-------------------------|---------|----------|---------|---------|-------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------------|---------|----------|---------|---------|-------------------
All files                |    92.3 |    91.77 |   88.23 |   93.33 |                   
 src                     |   81.81 |      100 |      50 |   81.81 |                   
  App.js                 |       0 |      100 |       0 |       0 | 8                 
  index.js               |       0 |      100 |     100 |       0 | 7-17              
  module.js              |     100 |      100 |     100 |     100 |                   
 src/components          |      90 |    78.84 |   88.23 |   92.95 |                   
  Homepage.jsx           |     100 |    66.66 |     100 |     100 | 5,31-32           
  RegistrationForm.jsx   |   89.33 |    81.39 |   86.66 |   92.42 | 63-66,74,94,133   
 src/context             |   85.18 |    66.66 |    87.5 |    82.6 |                   
  UserContext.js         |   85.18 |    66.66 |    87.5 |    82.6 | 12-13,32,35       
 src/validator           |     100 |      100 |     100 |     100 |                   
  ValidationError.js     |     100 |      100 |     100 |     100 |                   
  ageValidator.js        |     100 |      100 |     100 |     100 |                   
  cityValidator.js       |     100 |      100 |     100 |     100 |                   
  emailValidator.js      |     100 |      100 |     100 |     100 |                   
  identityValidator.js   |     100 |      100 |     100 |     100 |                   
  index.js               |       0 |        0 |       0 |       0 |                   
  postalCodeValidator.js |     100 |      100 |     100 |     100 |                   
  userValidator.js       |     100 |      100 |     100 |     100 |                   
-------------------------|---------|----------|---------|---------|-------------------

```

---

## Stratégie de Test

### Répartition des Responsabilités

#### Tests Unitaires (UT) - 138 tests

**Objectif** : Valider la logique métier de manière isolée

- **Validation des règles métier** : Formats, longueurs, types
- **Edge cases métier** : Dates limites, années bissextiles, caractères Unicode
- **Sécurité** : XSS, injections
- **Gestion d'erreurs** : Messages explicites, codes d'erreur
- **Indépendance** : Pas de dépendance UI, rapides à exécuter

#### Tests d'Intégration (IT) - 20 tests

**Objectif** : Valider l'intégration UI + logique métier

- **Interaction utilisateur** : Saisie clavier, focus, blur, click
- **Feedback visuel** : Affichage des erreurs, états du bouton
- **Flux complets** : Formulaire invalide → corrections → soumission
- **Intégrations externes** : localStorage, react-toastify
- **Accessibilité** : Rôles ARIA, labels


## End to End Tests (E2E) - 2 tests
Le test de bout en bout (E2E) est une méthode de test logiciel qui consiste à vérifier le workflow de l’application du début à la fin.

```
pnpm run cypress:open
```
_Scénarios testés :_

**Inscription d’un utilisateur valide**
* Remplissage du formulaire
* Soumission réussie
* Redirection vers la page d’accueil
* Vérification de l’affichage des informations

**Tentative d’inscription invalide**
* Email invalide
* Bouton de soumission désactivé
* Affichage du message d’erreur
* Vérification que l’utilisateur invalide n’est pas ajouté


## Mocks 

Les mocks permettent de :
* Isoler la logique testée
* Éviter les appels réseau réels
* Simuler différents scénarios (succès, erreur 400, erreur 500)
* Tester des comportements difficiles à reproduire
* Accélérer l’exécution des tests

**Mock des validateurs**
```
jest.mock("../validator", () => ({
    validatePostCode: jest.fn(() => {}),
    validateEmail: jest.fn(() => {}),
    validateIdentity: jest.fn(() => {}),
    cityValidator: jest.fn(() => {}),
}));
```

**Mock appel API** 

```
jest.mock("axios");
const mockedAxios = axios;
```

**Chargement d'un utilisateur** 

```
mockedAxios.get.mockResolvedValue({
    data: [
        { id: 1, email: "dupont@test.com", name: "Jean", username: "jdupont" },
    ],
});
```

**Simulation succès** 

```
mockedAxios.post.mockResolvedValue({ status: 201, data: { id: 2 } });
```

**Simulation POST 400 (email déjà utilise)**
```
expect(screen.getByRole("alert"))
    .toHaveTextContent("Cet email est déjà utilisé");
  ```

**Simulation POST 500 (erreur serveur)**
```
mockedAxios.post.mockRejectedValue({
    response: { status: 500 }
});
```

**Navigation** 

```
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
```

## Mocks E2E

```
cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', { body: [] });

cy.intercept('POST', 'https://jsonplaceholder.typicode.com/users', {
    statusCode: 201,
    body: { id: 1, success: true }
});
```

Pourquoi cy.intercept ?
* Empêcher les appels réels à l’API externe
* Contrôler totalement les réponses
* Garantir des tests stables
* Permettre l’exécution offline
