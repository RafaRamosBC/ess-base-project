import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Then('a seção "Em Alta"', () => {
    cy.get('h2').contains('Em Alta').should('exist');
    cy.get('.carousel-section-container').should('be.visible');
    cy.get('.carousel-section-container .dish-card').should('have.length.greaterThan', 0);
})

When('eu clico no botão "Em Alta"', () => {
    cy.get('.hero-buttons button').contains('Em Alta').click();
})

Given("que eu estou logado como usuario", () => {
    cy.visit('/login');
    cy.get("#login").type("joao.silva");
    cy.get("#senha").type("js123456");
    cy.get(".login-button").click();
    cy.url().should("not.include", "/login")
})

Given("que eu estou logado como administrador", () => {
    cy.visit('/login');
    cy.get("#login").type("juliana.ferreira");
    cy.get("#senha").type("jf987321");
    cy.get(".login-button").click();
    cy.url().should("not.include", "/login")
})

When("eu clico na seta para avançar", () => {
    cy.get('.carousel-section-container .next-arrow').click();
});

Then("o próximo prato deve estar visível", () => {
    cy.get('.carousel-section-container .dish-card')
      .first() // Seleciona o primeiro item antes da navegação
      .invoke('attr', 'data-dish-id') // Obtém o ID do prato atual
      .then((firstDishId) => {
          cy.get('.carousel-section-container .next-arrow').click();
          cy.wait(500); // Pequeno delay para a transição
          cy.get('.carousel-section-container .dish-card')
            .first()
            .should('not.have.attr', 'data-dish-id', firstDishId);
      });
});

When("eu clico na seta para voltar", () => {
    cy.get('.carousel-section-container .prev-arrow').click();
});

Then("o prato inicial deve estar visível", () => {
    cy.get('.carousel-section-container .dish-card')
      .first() // Captura o primeiro item antes da navegação
      .invoke('attr', 'data-dish-id')
      .then((initialDishId) => {
          // Avança no carrossel
          cy.get('.carousel-section-container .next-arrow').click();
          cy.wait(500); // Aguarda a animação
          
          // Volta no carrossel
          cy.get('.carousel-section-container .prev-arrow').click();
          cy.wait(500);
          
          // Verifica se voltou ao item original
          cy.get('.carousel-section-container .dish-card')
            .first()
            .should('not.have.attr', 'data-dish-id', initialDishId);
      });
});
