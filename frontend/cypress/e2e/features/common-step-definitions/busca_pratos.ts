import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que existe um prato chamado {string}", (prato: string) => {
  cy.visit("/pratos");
  cy.get(".search-bar").type(prato);
  cy.get(".search-button").click();
  cy.get(".dishes-grid .dish-card").should("contain", prato);
});

When("eu pesquiso por {string} no campo de busca", (prato: string) => {
  cy.get(".search-bar").clear().type(prato);
  cy.get(".search-button").click();
});

Then("devo ver o prato {string} nos resultados", function (prato: string) {
    cy.get('.dishes-grid')  // Seletor para a área de pratos no seu layout
      .contains(prato)      // Verifica se o prato está presente na lista de pratos
      .should('be.visible'); // Verifica se o prato está visível
  });
  
  // Cenário: Buscar pratos por categoria
  Given('que existem pratos cadastrados na categoria {string}', (categoria: string) => {

  });
  
  When('eu seleciono a categoria {string} no filtro de busca', (categoria: string) => {
    cy.get('.filter-button').click();
    cy.get('select[name="category"]').should('be.visible');
    cy.get('select[name="category"]').select(categoria);
    cy.get('.search-button').click();
  });


  Then('devo ver apenas pratos da categoria {string} nos resultados', (categoria: string) => {
    cy.get('.dish-item').each(($el) => {
      cy.wrap($el).contains(categoria).should('exist'); // Verifica se todos os pratos são da categoria selecionada
    });
  });
  
  // Cenário: Buscar pratos por nota mínima
  Given('que existem pratos com diferentes avaliações', () => {

  });
  
  When('eu defino a nota mínima como {string} no filtro de busca', (notaMinima: string) => {
    cy.get('.filter-button').click();
    cy.get('input[name="minNota"]').should('be.visible');
    cy.get('input[name="minNota"]').clear().type(notaMinima);
    cy.get('.search-button').click();
  });
  
  
  Then('devo ver apenas pratos com nota igual ou superior a {string} nos resultados', (notaMinima: string) => {
    cy.get('.dish-item').each(($el) => {
      cy.wrap($el).find('.dish-rating').should('be.greaterThan', parseFloat(notaMinima)); // Verifica se a nota do prato é maior ou igual à mínima
    });
  });

  // Cenário: Buscar pratos mais vistos
  Given('que existem pratos com diferentes números de visualizações', () => {

  });

  When('eu defino o minimo de views como {string}', (minView: string) => {
    cy.get('.filter-button').click();
    cy.get('input[name="minViews"]').should('be.visible');
    cy.get('input[name="minViews"]').clear().type(minView);
    cy.get('.search-button').click();
  });

  
  Then('devo ver uma lista com os 5 pratos mais visualizados', () => {
    cy.get('.dish-item').should('have.length', 5); // Verifica se há 5 pratos nos resultados
    cy.get('.dish-item').first().find('.dish-views').should('be.greaterThan', 300); // Verifica se o prato com mais visualizações é o primeiro
  });
  
  // Cenário: Filtrar pratos utilizando múltiplos critérios
  Given('que existem pratos cadastrados com categorias e avaliações diversas', () => {

  });
  

  When('eu seleciono a categoria {string} e a nota mínima {string} no filtro de busca', (categoria: string, minView: string) => {
    cy.get('.filter-button').click(); // Clica no botão de filtro
    cy.get('select[name="category"]').should('be.visible'); // Verifica se o seletor de categoria está visível
    cy.get('select[name="category"]').select(categoria); // Seleciona a categoria do filtro
    cy.get('input[name="minViews"]').clear().type(minView); // Limpa e preenche o campo de "minViews" com a nota mínima
    cy.get('.search-button').click(); // Clica no botão de busca
  });
  
  
  Then('devo ver os pratos que correspondem aos critérios aplicados', () => {
    cy.get('.dish-item').each(($el) => {
      cy.wrap($el).contains('Brasileira').should('exist'); // Verifica se os pratos são da categoria selecionada
      cy.wrap($el).find('.dish-rating').should('be.greaterThan', 4.5); // Verifica se a nota do prato é maior que 4.5
    });
  });
  
  // Cenário: Filtrar pratos sem retorno de resultados
  Given('que não existem pratos cadastrados que atendam aos filtros aplicados', () => {

  });
  
  When('eu defino a nota mínima como {string}', (notaMinima: string) => {
    cy.get('input[name="minNota"]').type(notaMinima); // Define a nota mínima
    cy.get('.search-button').click(); // Clica no botão de busca
  });
  
  Then('devo ver a mensagem {string}', (mensagem: string) => {
    cy.get('.empty-grid p').contains(mensagem).should('exist'); // Verifica se a mensagem aparece dentro da div
  });
  
  
  // Cenário: Limpar filtros da busca
  Given('que existem filtros aplicados na busca', () => {
    cy.get('.filter-button').click();
    cy.get('input[name="minViews"]').should('be.visible');
    cy.get('input[name="minViews"]').clear().type("4");
    cy.get('.search-button').click();
  });
  
  When('eu clico no botão "Limpar filtros"', () => {
    cy.get('.clear-filters-button').click(); // Clica no botão para limpar filtros
  });
  
  Then('devo ver todos os pratos cadastrados na lista', () => {
    cy.get('.dish-item').should('have.length.greaterThan', 0); // Verifica se todos os pratos são mostrados
  });
  