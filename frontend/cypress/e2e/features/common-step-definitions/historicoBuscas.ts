import {Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("o histórico de buscas já tem buscas", () => {
  cy.get("input[type='search'], .search-input").focus();
  cy.get(".history-list li").should("have.length.at.least", 1);
});

Given("o usuário possui {string} em seu histórico de buscas", (termo: string) => {
    cy.get("input[type='search'], .search-input").focus();
    cy.get(".history-dropdown").should("contain", termo);
});

// Ações na barra de busca e filtros
When("foco na barra de busca", () => {
  // Não vi o componente de busca no FeedPage, talvez esteja em outro componente
  // Você precisará identificar o seletor correto
  cy.get("input[type='search'], .search-input").focus();
});

When("preencho o campo de busca com {string}", (termo: string) => {
  cy.get("input[type='search'], .search-input").clear().type(termo);
});

When("clico no ícone de engrenagem para abrir os filtros", () => {
  cy.get("button[type='button'], .filter-button").click();
});

When("atualizo a página", () => {
  cy.reload();
});

Then("{string} ainda deve aparecer no histórico", (termo: string) => {
  cy.get(".history-dropdown").should("contain", termo);
});

When("clico no ícone de exclusão ao lado de {string}", (termo: string) => {
  cy.get(".history-dropdown").contains("li", termo).find(".delete-history-item").click();
});

Then("{string} não deve mais aparecer no histórico", (termo: string) => {
  cy.get(".history-dropdown").should("not.contain", termo);
});

When("seleciono o filtro {string} com valor {string}", (filtro: string, valor: string) => {
  // Baseado na estrutura do componente de filtros
  const nomeFiltro = filtro.toLowerCase().replace(/\s/g, "-");
  
  // Para selects/dropdowns
  if (["categoria"].includes(nomeFiltro)) {
    cy.get(`select[name="${nomeFiltro}"], [data-testid="${nomeFiltro}-filter"]`).select(valor);
  } 
  // Para inputs numéricos (minNota, maxNota, minViews, maxViews)
  else if (["minnota", "maxnota", "minviews", "maxviews"].includes(nomeFiltro.replace("-", ""))) {
    cy.get(`input[name="${nomeFiltro}"], [data-testid="${nomeFiltro}-filter"]`).clear().type(valor);
  }
});


// Verificações nos resultados
Then("devo ver o prato com nome {string} nos resultados", (nomePrato: string) => {
  // Usando a classe correta de acordo com o FeedPage.jsx
  cy.get(".dishes-grid .dish-card").should("contain", nomePrato);
});

// Verificações no histórico de buscas (adapte conforme necessário)
Then("o histórico de buscas deve ser exibido", () => {
  cy.get(".history-dropdown, .search-history").should("be.visible");
});

Then("devo ver uma mensagem de erro {string}", (mensagem: string) => {
  // Verificando nas possíveis áreas de erro do FeedPage
  cy.get(".error-message, .empty-grid, .search-results-banner.error")
    .should("be.visible")
    .and("contain", mensagem);
});

Then("devo ver {int} prato(s) encontrado(s) nos resultados", (quantidade: number) => {
  // Contando os pratos na grade de resultados
  cy.get(".dishes-grid .dish-card").should("have.length", quantidade);
});

// Verificação geral para resultados de busca
Then("devo ver uma mensagem indicando {string} prato(s) encontrado(s)", (quantidade: string) => {
  cy.reload();
  cy.get(".search-results-content h2").should("contain", `${quantidade} prato(s) encontrado(s)`);
});

// Scenario: Usar item do histórico para realizar nova busca
Given("o usuário possui {string} em seu histórico de buscas", (termo: string) => {
  cy.get(".search-input").clear().type(termo);
  cy.get(".search-button").click();
  cy.get(".search-input").clear();
});

// Verificar os parâmetros de busca exibidos
Then("devo ver os parâmetros de busca contendo {string}", (parametro: string) => {
  cy.get(".search-results-content p").should("contain", parametro);
});

Then("o histórico de buscas deve estar vazio", () => {
  cy.get(".history-dropdown").should("not.exist");
});

When("clico no botão {string} no histórico", (botao: string) => {
  cy.get(".history-header").contains(botao).click();
});

// Limpar resultados de busca
When("clico no botão para limpar a busca", () => {
  cy.get(".clear-search-button").click();
});

// Verificar a navegação entre as seções do carrossel
When("clico no botão {string} na seção hero", (botao: string) => {
  cy.contains(".hero-buttons button", botao).click();
});

Then("devo ver o carrossel da seção {string}", (secao: string) => {
  // Mapeie os nomes das seções para os IDs ou classes que você usa
  const secaoMap = {
    "Em Alta": ".carousel-section-container .featured-carousel",
    "Mais Vistos": ".carousel-section-container .carousel",
    "Melhores Avaliados": ".carousel-section-container .carousel"
  };
  
  cy.get(secaoMap[secao]).should("be.visible");
});

// Verificação para favoritos
When("clico no botão de favorito do prato {string}", (nomePrato: string) => {
  cy.contains(".dish-card", nomePrato)
    .find(".favorite-button, [data-testid='favorite-button']")
    .click();
});

Then("o prato {string} deve estar marcado como favorito", (nomePrato: string) => {
  cy.contains(".dish-card", nomePrato)
    .find(".favorite-button.active, [data-testid='favorite-button'][data-favorite='true']")
    .should("exist");
});

When("aperto ENTER no campo de busca", () => {
  cy.get(".search-input").type("{enter}");
  });

  Then("o histórico de buscas deve mostrar {string} sem filtros", (termo: string) => {
    cy.get(".dish-grid").should("contain", termo);
    });