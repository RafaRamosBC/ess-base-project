import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que estou na página de feed", () => {
    cy.get(".nav-links a").contains("Feed").click();
    cy.url().should("include", "/");
    cy.get(".dishes-grid-section h2").should("contain", "Todos os Pratos");
  });

Given("que estou na página de favoritos", () => {
    cy.get(".nav-links a").contains("Favorites").click();
    cy.url().should("include", "/favorites");
  });

Given("que existe um prato favoritado chamado {string} no feed", (dishName: string) => {
    cy.get(".dishes-grid").should("contain", dishName);
  });

Given("que existe um prato favoritado chamado {string}", (dishName: string) => {
    cy.get(".favorites-grid").should("contain", dishName);
  });

When("clico no botão de favoritar do prato {string}", (dishName: string) => {
    cy.contains(".dish-card", dishName).within(() => {
    cy.get(".favorite-button").click();
    });
  });
  
When("vou para a página de favoritos", () => {
    cy.get(".nav-links a").contains("Favorites").click();
    cy.url().should("include", "/favorites");
  });
  
Then("devo ver o prato {string} na lista de favoritos", (dishName: string) => {
    cy.get(".favorites-grid").should("contain", dishName);
  });

Then("o prato {string} não deve estar mais na lista de favoritos", (dishName: string) => {
    cy.get("body").then($body => {
      if ($body.find(".empty-favorites")) {
        cy.get(".empty-favorites").should("be.visible");
      } else {
        cy.get(".favorites-grid").should("not.contain", dishName);
      }
    });
  });