import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const fieldSelectors: Record<string, string> = {
  "Título": "#news-title",
  "Subtítulo": "#news-subtitle",
  "Corpo": "#news-body"
};


Given("que estou na página de gerenciamento de notícias", () => {
    cy.get(".nav-links a").contains("Admin").click();
    cy.url().should("include", "/admin");
    cy.get(".admin-tab").contains("Notícias").click();
    cy.get(".admin-content h2").should("contain", "Adicionar Notícia");
  });

Given("que existe uma notícia chamada {string}", (título: string) => {
    cy.get(".admin-table tbody").then($body => {
      if (!$body.text().includes(título)) {
        cy.get("#news-title").clear().type(título);
        cy.contains("button", "Salvar").click();
        cy.get(".alert-success").should("be.visible");
      }
    });
    cy.get(".admin-table").should("contain", título);
  });


When("clico no botão de edição dessa notícia", () => {
    cy.get(".admin-table tbody tr").first().within(() => {
      cy.get(".btn-edit").click();
    });
  });

When("clico no botão de exclusão da notícia {string}", (título: string) => {
    cy.get(".admin-table tbody tr")
      .contains("td", título)
      .parent()
      .find(".btn-delete")
      .click();
});

When("preencho o campo título com {string}, o subtítulo com {string} e o corpo com {string}", (título: string, subtítulo: string, corpo: string) => {
  cy.get(fieldSelectors["Título"]).clear().type(título);
  cy.get(fieldSelectors["Subtítulo"]).clear().type(subtítulo);
  cy.get(fieldSelectors["Corpo"]).clear().type(corpo);
});

When("troco o campo {string} para {string}", (campo: string, valor: string) => {
  cy.get(fieldSelectors[campo]).clear().type(valor);
});

Then("devo ver a lista de notícias cadastradas", () => {
    cy.get(".admin-table").should("be.visible");
  });
  
Then("cada notícia deve exibir título e subtítulo", () => {
    cy.get(".admin-table th").should("contain", "Título");
    cy.get(".admin-table th").should("contain", "Subtítulo");
    cy.get(".admin-table tbody tr").should("have.length.at.least", 1);
  });

Then("a notícia {string} deve aparecer na lista", (nomeNotícia: string) => {
    cy.get(".admin-table").should("contain", nomeNotícia);
  });

Then("devo ver uma mensagem de erro indicando que o título ultrapassou o limite de caracteres", () => {
    cy.get(".alert-error").should("be.visible").and("contain", "O título é obrigatório e deve ter no máximo 50 caracteres.");
  });

Then("a notícia não deve ser adicionada", () => {
    cy.get(".alert-success").should("not.exist");
  });

Then("a notícia {string} não deve mais aparecer na lista", (título: string) => {
    cy.get(".admin-table").should("not.contain", título);
  });