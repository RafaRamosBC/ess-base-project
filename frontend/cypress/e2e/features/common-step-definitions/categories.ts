import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const fieldSelectors: Record<string, string> = {
  "Nome": "#category-name",
  "Descrição": "#category-description"
};

Given("que estou na página de gerenciamento de categorias", () => {
  // Navega até a página de administração e, em seguida, para a aba de categorias
  cy.get(".nav-links a").contains("Admin").click();
  cy.url().should("include", "/admin");
  cy.get(".admin-tab").contains("Categorias").click();
  cy.get(".admin-content h2").should("contain", "Adicionar Categoria");
});

Then("devo ver a lista de categorias cadastradas", () => {
  cy.get(".admin-table").should("be.visible");
});

Then("cada categoria deve exibir nome e descrição", () => {
  cy.get(".admin-table th").should("contain", "Nome");
  cy.get(".admin-table th").should("contain", "Descrição");
  cy.get(".admin-table tbody tr").should("have.length.at.least", 1);
});

When("preencho o campo {string} com {string}", (campo: string, valor: string) => {
  cy.get(fieldSelectors[campo]).clear().type(valor);
});

When("deixo o campo {string} em branco", (campo: string) => {
  cy.get(fieldSelectors[campo]).clear();
});


Then("devo ver uma mensagem de sucesso", () => {
  cy.get(".alert-success").should("be.visible").and("contain", "sucesso");
});

Then("a categoria {string} deve aparecer na lista", (nomeCategoria: string) => {
  cy.get(".admin-table").should("contain", nomeCategoria);
});

Then("devo ver uma mensagem de erro indicando que o nome é obrigatório", () => {
  cy.get(".form-error").should("be.visible").and("contain", "Nome é obrigatório");
});

Then("a categoria não deve ser adicionada", () => {
  cy.get(".alert-success").should("not.exist");
});

Given("que existe uma categoria chamada {string}", (nomeCategoria: string) => {
  // Verifica se a categoria já existe; se não, cria-a via interface
  cy.get(".admin-table tbody").then($body => {
    if (!$body.text().includes(nomeCategoria)) {
      cy.get("#category-name").clear().type(nomeCategoria);
      cy.get("#category-description").clear().type("Descrição de teste");
      cy.contains("button", "Salvar").click();
      cy.get(".alert-success").should("be.visible");
    }
  });
  cy.get(".admin-table").should("contain", nomeCategoria);
});


When("altero o campo {string} para {string}", (campo: string, valor: string) => {
  cy.get(fieldSelectors[campo]).clear().type(valor);
});

When("clico no botão de exclusão da categoria {string}", (nomeDaCategoria: string) => {
    cy.get(".admin-table tbody tr")
      .contains("td", nomeDaCategoria)
      .parent()
      .find(".btn-delete")
      .click();
  });

  When("clico no botão de edição da categoria {string}", (nomeDaCategoria: string) => {
    cy.get(".admin-table tbody tr")
      .contains("td", nomeDaCategoria)
      .parent()
      .find(".btn-edit")
      .click();
  });
  

When("confirmo a exclusão", () => {
  cy.on("window:confirm", () => true);
});

Then("a categoria {string} não deve mais aparecer na lista", (nomeCategoria: string) => {
  cy.get(".admin-table").should("not.contain", nomeCategoria);
});

Then("uma mensagem de erro indicando que o nome já existe deve ser exibida", () => {
  cy.get(".alert-error").should("be.visible").and("contain", "já existe");
});

When("clico no botão {string}", (botao: string) => {
  cy.contains("button", botao).click();
});

Then("a categoria deve manter o nome {string} na lista", (nomeCategoria: string) => {
  cy.get(".admin-table").should("contain", nomeCategoria);
});

When("preencho o campo {string} com um texto de 101 caracteres", (campo: string) => {
  const textoLongo = "a".repeat(101);
  cy.get(fieldSelectors[campo]).clear().type(textoLongo);
});

Then("devo ver uma mensagem de erro sobre o tamanho do nome", () => {
  cy.get(".alert-error").should("be.visible").and("contain", "não pode ter mais que 50 caracteres");
});

Given("que existem várias categorias cadastradas", () => {
  // Verifica se já existem pelo menos 3 categorias; caso contrário, cria-as via interface
  cy.get(".admin-table tbody tr").then($rows => {
    if ($rows.length < 3) {
      cy.get("#category-name").clear().type("Categoria A");
      cy.get("#category-description").clear().type("Descrição A");
      cy.contains("button", "Salvar").click();
      cy.get(".alert-success").should("be.visible");

      cy.get("#category-name").clear().type("Categoria B");
      cy.get("#category-description").clear().type("Descrição B");
      cy.contains("button", "Salvar").click();
      cy.get(".alert-success").should("be.visible");

      cy.get("#category-name").clear().type("Vegetariano");
      cy.get("#category-description").clear().type("Pratos vegetarianos");
      cy.contains("button", "Salvar").click();
      cy.get(".alert-success").should("be.visible");
    }
  });
});

Given("que existe uma categoria chamada {string} que possui pratos associados", (nomeCategoria: string) => {
  cy.get(".admin-table tbody").then($body => {
    if (!$body.text().includes(nomeCategoria)) {
      cy.get("#category-name").clear().type(nomeCategoria);
      cy.get("#category-description").clear().type("Descrição de teste");
      cy.contains("button", "Salvar").click();
      cy.get(".alert-success").should("be.visible");
    }
  });
  cy.get(".admin-table").should("contain", nomeCategoria);
  // Associa um prato à categoria
  cy.get(".admin-tab").contains("Pratos").click();
  cy.get("#name").clear().type("Prato de Teste");
  cy.get("#description").clear().type("Descrição do prato de teste");
  cy.get("#category").select(nomeCategoria);
  cy.get("#ingredients").clear().type("Ingredientes de teste");
  cy.contains("button", "Salvar").click();
  cy.get(".alert-success").should("be.visible");
  cy.get(".admin-tab").contains("Categorias").click();
});

Then("uma mensagem de alerta sobre pratos associados deve ser exibida", () => {
  cy.get(".alert-error").should("be.visible").and("contain", "está vinculada a pratos");
});

Given("a categoria {string} não possui pratos cadastrados", (nomeCategoria: string) => {
  // Acessa a aba de "Pratos" no painel de administração
  cy.get(".admin-tab").contains("Pratos").click();
  // Verifica que nenhuma linha da tabela de pratos exibe o nome da categoria na coluna de "Categoria"
  cy.get(".admin-table tbody tr").each(($row) => {
    cy.wrap($row).find("td").eq(1).should("not.contain", nomeCategoria);
  });

  // Após a verificação, volta para a aba de Categorias
  cy.get(".admin-tab").contains("Categorias").click();
});
