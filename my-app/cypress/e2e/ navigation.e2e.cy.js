describe("Test Navigation - Backend réel", () => {
  const baseUrl = Cypress.config("baseUrl");

  beforeEach(() => {
    // Réinitialiser la base de données
    cy.request("DELETE", `${baseUrl.replace("/tests", "")}/testing/reset`);

    // Aller sur la page de test
    cy.visit("/tests");
  });

  it("Ajout utilisateur valide", () => {
    cy.contains("Inscription").click();

    cy.get('[name="name"]').type("John Doe");
    cy.get('[name="username"]').type("johndoe");
    cy.get('[name="email"]').type("john@example.com");
    cy.get('[name="city"]').type("Paris");
    cy.get('[name="postalCode"]').type("75001");

    cy.get('button[type="submit"]').click({ force: true });

    // Vérifier la confirmation
    cy.contains("User saved successfully!", { timeout: 20000 });

    // Vérifier que la liste affiche 1 utilisateur
    cy.contains("1 utilisateur inscrit", { timeout: 20000 });
  });

  it("Champs vides", () => {
    cy.contains("Inscription").click();
    cy.get('[name="name"]').focus().blur();
    cy.contains("Name must not be empty");
  });

  it("Email invalide", () => {
    cy.contains("Inscription").click();
    cy.get('[name="email"]').type("invalid");
    cy.get('[name="name"]').type("John Doe");
    cy.get('[name="username"]').type("johndoe");
    cy.get('[name="city"]').type("Paris");
    cy.get('[name="postalCode"]').type("75001");
    cy.get('button[type="submit"]').should("be.disabled");
  });

  it("Email déjà utilisé", () => {
    // Ajouter un utilisateur
    cy.request("POST", `${baseUrl.replace("/tests", "")}/users`, {
      username: "johndoe",
      name: "John Doe",
      email: "john@example.com",
      address: { city: "Paris", zipcode: "75001" },
    });

    // Essayer de réinscrire le même email
    cy.contains("Inscription").click();
    cy.get('[name="name"]').type("John Doe");
    cy.get('[name="username"]').type("johndoe");
    cy.get('[name="email"]').type("john@example.com");
    cy.get('[name="city"]').type("Paris");
    cy.get('[name="postalCode"]').type("75001");
    cy.get('button[type="submit"]').click({ force: true });

    cy.contains("User saved successfully!", { timeout: 20000 });
  });
});