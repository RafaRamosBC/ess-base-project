import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("que estou logado como administrador", () => {
  // Realiza o login pelo fluxo de UI utilizando o backend real
  cy.visit("/login");
  cy.get("#login").type("juliana.ferreira");
  cy.get("#senha").type("jf987321");
  cy.get(".login-button").click();
  cy.url().should("not.include", "/login");
});

