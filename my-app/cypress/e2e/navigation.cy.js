describe('Test Navigation', () => {
    // Scénario ok
    it("Ajout d'un utilisateur valide et redirection vers la  page d'accueil", () => {
        // Etat initial
        cy.visit('/')
        cy.contains('0 utilisateur inscrit');

        // Formulaire d'inscription'
        cy.contains('Inscription').click();

        // Remplissage du formulaire
        cy.get('input[name="firstname"]').type('John');
        cy.get('input[name="lastname"]').type('Doe');
        cy.get('input[name="email"]').type('john.doe@example.com');
        cy.get('input[name="birth"]').type('1990-01-01');
        cy.get('input[name="city"]').type('Paris');
        cy.get('input[name="postalCode"]').type('75000');

        // Soumission
        cy.get('button[type="submit"]').click();

        cy.wait(500);

        // Redirection vers la page d'accueil et vérification du nombre d'utilisateurs'
        cy.url().should('eq', 'http://localhost:3000/');
        cy.contains('1 utilisateur inscrit', { timeout: 5000 });

        // Vérifier que l'utilisateur est présent dans la liste
        cy.contains('John Doe');
        cy.contains('john.doe@example.com');
    })

    // Scénario Erreur
    it("Tentative d'ajout d'un utilisateur invalide", () => {
        cy.visit('/');
        cy.contains('Inscription').click();

        // Remplir le formulaire avec un email vide
        cy.get('input[name="firstname"]').type('Jane');
        cy.get('input[name="lastname"]').type('Doe');
        cy.get('input[name="email"]').type('janedoeexample.com');
        cy.get('input[name="birth"]').type('1990-01-01');
        cy.get('input[name="city"]').type('Paris');
        cy.get('input[name="postalCode"]').type('75000');

        cy.get('button[type="submit"]').should('be.disabled');


        cy.contains('email must be a valid email address').should('be.visible');

        cy.contains('Accueil').click();

        cy.contains('1 utilisateur inscrit');
        cy.contains('John Doe');
    });
})