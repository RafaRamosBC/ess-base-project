import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const fieldSelectors: Record<string, string> = {
  "Nome": "#name",
  "Categoria": "#category",
  "Ingredientes": "#ingredients"
};


Given("que estou na página de gerenciamento de pratos", () => {
    cy.get(".nav-links a").contains("Admin").click();
    cy.url().should("include", "/admin");
    cy.get(".admin-tab").contains("Pratos").click();
    cy.get(".admin-content h2").should("contain", "Adicionar Prato");
  });

Given("que existe um prato chamado {string}", (nome: string) => {
    cy.get(".admin-table tbody").then($body => {
      if (!$body.text().includes(nome)) {
        cy.get("#name").clear().type(nome);
        cy.contains("button", "Salvar").click();
        cy.get(".alert-success").should("be.visible");
      }
    });
    cy.get(".admin-table").should("contain", nome);
  });


When("clico no botão de edição desse prato", () => {
    cy.get(".admin-table tbody tr").first().within(() => {
      cy.get(".btn-edit").click();
    });
  });

When("clico no botão de exclusão do prato {string}", (nome: string) => {
    cy.get(".admin-table tbody tr")
      .contains("td", nome)
      .parent()
      .find(".btn-delete")
      .click();
});

When("preencho o campo nome com {string}, a categoria com {string} e os ingredientes com {string}", (nome: string, categoria: string, ingredientes: string) => {
  cy.get(fieldSelectors["Nome"]).clear().type(nome);
  cy.get(fieldSelectors["Categoria"]).select(categoria);
  cy.get(fieldSelectors["Ingredientes"]).clear().type(ingredientes);
});

When("troco o campo de {string} para {string} com categoria {string}", (campo: string, valor: string, categoria: string) => {
  cy.get(fieldSelectors[campo]).clear().type(valor);
  cy.get(fieldSelectors["Categoria"]).select(categoria);
});

Then("devo ver a lista de pratos cadastrados", () => {
    cy.get(".admin-table").should("be.visible");
  });
  
Then("cada prato deve exibir nome, categoria e ingredientes", () => {
    cy.get(".admin-table th").should("contain", "Nome");
    cy.get(".admin-table th").should("contain", "Categoria");
    cy.get(".admin-table th").should("contain", "Ingredientes");
    cy.get(".admin-table tbody tr").should("have.length.at.least", 1);
  });

Then("o prato {string} deve aparecer na lista", (nome: string) => {
    cy.get(".admin-table").should("contain", nome);
  });

Then("o prato {string} não deve mais aparecer na lista", (título: string) => {
    cy.get(".admin-table").should("not.contain", título);
  });


  