import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";


Then('a seção "Mais Vistos"', () => {
  cy.get('h2').contains('Pratos Mais Vistos').should('exist');
  cy.get('.carousel-section-container').should('be.visible');
  cy.get('.carousel-section-container .dish-card').should('have.length.greaterThan', 0);
});

When('eu clico no botão "Mais Vistos"', () => {
  cy.get('.hero-buttons button').contains('Mais Vistos').click();
});


Given("que estou logado como usuario", () => {
  cy.visit("/login");
  cy.get("#login").type("joao.silva");
  cy.get("#senha").type("js123456");
  cy.get(".login-button").click();
  cy.url().should("not.include", "/login");
});