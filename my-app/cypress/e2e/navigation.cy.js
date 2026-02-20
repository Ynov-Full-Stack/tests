describe('Test Navigation', () => {
    beforeEach(() => {
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', { body: [] });
        cy.intercept('POST', 'https://jsonplaceholder.typicode.com/users', {
            statusCode: 201,
            body: { id: 1, success: true }
        });
        cy.visit('/tests');
    });

    it("Ajout utilisateur valide", () => {
        cy.contains('Inscription').click();

        cy.get('[name="name"]').type('John Doe');
        cy.get('[name="username"]').type('johndoe');
        cy.get('[name="email"]').type('john@example.com');
        cy.get('[name="city"]').type('Paris');
        cy.get('[name="postalCode"]').type('75001');

        cy.get('button[type="submit"]').click({ force: true });
        cy.contains('User saved successfully!', { timeout: 10000 });
        cy.contains('1 utilisateur inscrit', { timeout: 10000 });
    });

    it("Champs vides", () => {
        cy.contains('Inscription').click();
        cy.get('[name="name"]').focus().blur();
        cy.contains('Name must not be empty');
    });

    it("Email invalide", () => {
        cy.contains('Inscription').click();
        cy.get('[name="email"]').type('invalid');
        cy.get('[name="name"]').type('John Doe');
        cy.get('[name="username"]').type('johndoe');
        cy.get('[name="city"]').type('Paris');
        cy.get('[name="postalCode"]').type('75001');
        cy.get('button[type="submit"]').should('be.disabled');
    });
});
