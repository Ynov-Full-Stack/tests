describe('Test Navigation', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/tests');

        // Etat initial
        cy.contains('0 utilisateur inscrit');

        // Aller au formulaire
        cy.contains('Inscription').click();

        // Création utilisateur valide
        cy.get('input[name="firstname"]').type('John');
        cy.get('input[name="lastname"]').type('Doe');
        cy.get('input[name="email"]').type('john.doe@example.com');
        cy.get('input[name="birth"]').type('1990-01-01');
        cy.get('input[name="city"]').type('Paris');
        cy.get('input[name="postalCode"]').type('75000');

        cy.get('button[type="submit"]').click();

        // Vérifier retour accueil
        cy.url().should('eq', 'http://localhost:3000/tests');
        cy.contains('1 utilisateur inscrit');
    });

    // Scénario nominal
    it("Ajout d'un utilisateur valide et redirection vers la page d'accueil", () => {

        cy.contains('John Doe');
        cy.contains('john.doe@example.com');
    });

    // Scénario erreur (avec 1 utilisateur déjà présent)
    it("Tentative d'ajout d'un utilisateur invalide", () => {

        cy.contains('Inscription').click();

        cy.get('input[name="firstname"]').type('Jane');
        cy.get('input[name="lastname"]').type('Doe');
        cy.get('input[name="email"]').type('janedoeexample.com');
        cy.get('input[name="birth"]').type('1990-01-01');
        cy.get('input[name="city"]').type('Paris');
        cy.get('input[name="postalCode"]').type('75000');

        cy.get('button[type="submit"]').should('be.disabled');

        cy.contains('Email address must be in a valid format (example@domain.com)')
            .should('be.visible');

        cy.contains('Accueil').click();

        // Toujours 1 utilisateur
        cy.contains('1 utilisateur inscrit');
        cy.contains('John Doe');
    });

});
