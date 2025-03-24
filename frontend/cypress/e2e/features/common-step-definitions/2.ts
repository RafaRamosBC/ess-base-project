import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given("estou na página inicial", () => {
  cy.visit("/");
});

