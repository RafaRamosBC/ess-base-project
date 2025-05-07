import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("que estou logado como usuário", () => {
  // Realiza o login pelo fluxo de UI utilizando o backend real
  cy.visit("/login");
  cy.get("#login").type("lucas.pereira");
  cy.get("#senha").type("lp789123");
  cy.get(".login-button").click();
  cy.url().should("not.include", "/login");
});
