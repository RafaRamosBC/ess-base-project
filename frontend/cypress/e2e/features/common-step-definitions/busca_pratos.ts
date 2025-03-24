import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que existe um prato chamado {string}", (prato: string) => {
  cy.visit("/pratos");
  cy.get(".search-bar").type(prato);
  cy.get(".search-button").click();
});

When("eu pesquiso por {string} no campo de busca", (prato: string) => {
  cy.get(".search-bar").clear().type(prato);
  cy.get(".search-button").click();
});

Then("devo ver o prato {string} nos resultados", (prato: string) => {
  cy.get(".prato-item").should("contain", prato);
});

Given("que existem pratos cadastrados na categoria {string}", (categoria: string) => {
  cy.visit("/pratos");
  cy.get(".categoria-tag").contains(categoria).should("exist");
});

When("eu seleciono a categoria {string} no filtro de busca", (categoria: string) => {
  cy.get(".filtro-categoria").select(categoria);
  cy.get(".apply-filters").click();
});

Then("devo ver apenas pratos da categoria {string} nos resultados", (categoria: string) => {
  cy.get(".prato-item").each(($el) => {
    cy.wrap($el).find(".categoria").should("contain", categoria);
  });
});

Given("que existem pratos com diferentes avaliações", () => {
  cy.visit("/pratos");
  cy.get(".prato-item .nota").should("have.length.at.least", 1);
});

When("eu defino a nota mínima como {string} no filtro de busca", (nota: string) => {
  cy.get(".filtro-nota").clear().type(nota);
  cy.get(".apply-filters").click();
});

Then("devo ver apenas pratos com nota igual ou superior a {string} nos resultados", (nota: string) => {
  cy.get(".prato-item .nota").each(($el) => {
    cy.wrap($el).invoke("text").then(parseFloat).should("be.gte", parseFloat(nota));
  });
});

When("eu aplico o filtro {string}", (filtro: string) => {
  cy.get(".filtro-opcoes").select(filtro);
  cy.get(".apply-filters").click();
});

Then("devo ver uma lista com os {int} pratos mais visualizados", (quantidade: number) => {
  cy.get(".prato-item").should("have.length", quantidade);
});

When("eu clico no botão {string}", (botao: string) => {
  cy.contains("button", botao).click();
});

Then("devo ver todos os pratos cadastrados na lista", () => {
  cy.get(".prato-item").should("have.length.at.least", 1);
});

Then("devo ver a mensagem {string}", (mensagem: string) => {
  cy.get(".mensagem-busca").should("contain", mensagem);
});
