import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const fieldSelectors: Record<string, string> = {
  "Nome": "#user-nome",
  "Login": "#user-login",
  "Senha": "#user-senha",
  "Permissão": "#user-role"
};

Given("estou na aba de administrar usuários", () => {
  cy.get(".nav-links a").contains("Admin").click();
  cy.url().should("include", "/admin");
  cy.get(".admin-tab").contains("Usuários").click();
  cy.get(".admin-content h2").should("contain", "Adicionar Usuário");
});

Given("existe um usuário chamado {string} com login {string}", (nomeUsuario: string, loginUser: string) => {
  cy.get(".admin-table tbody").then($body => {
    if (!$body.text().includes(nomeUsuario)) {
      cy.get("#user-nome").clear().type(nomeUsuario);
      cy.get("#user-login").clear().type(loginUser);
      cy.contains("button", "Salvar").click();
      cy.get(".alert-success").should("be.visible");
    }
  });
  cy.get(".admin-table").should("contain", nomeUsuario);
});

When("o usuário preenche o nome com {string}, o login com {string}, a senha com {string} e seleciona a permissão como {string}", (nome: string, login: string, senha: string, permissao: string) => {
  cy.get(fieldSelectors["Nome"]).clear().type(nome);
  cy.get(fieldSelectors["Login"]).clear().type(login);
  cy.get(fieldSelectors["Senha"]).clear().type(senha);
  cy.get(fieldSelectors["Permissão"]).select(permissao);
});

When("o usuário preenche o login com {string}, a senha com {string} e seleciona a permissão como {string}", (login: string, senha: string, permissao: string) => {
  cy.get(fieldSelectors["Login"]).clear().type(login);
  cy.get(fieldSelectors["Senha"]).clear().type(senha);
  cy.get(fieldSelectors["Permissão"]).select(permissao);
});

When("pressiono o botão {string}", (botao: string) => {
  cy.contains("button", botao).click();
});

When("clico no botão de edição desse usuário", () => {
  cy.get(".admin-table tbody tr").first().within(() => {
    cy.get(".btn-edit").click();
  });
});

When("clico no botão de exclusão do usuário {string}", (nome: string) => {
  cy.get(".admin-table tbody tr")
    .contains("td", nome)
    .parent()
    .find(".btn-delete")
    .click();
});

When("mudo o campo {string} para {string}", (campo: string, valor: string) => {
  cy.get(fieldSelectors[campo]).clear().type(valor);
});

Then("verei uma mensagem de sucesso", () => {
  cy.get(".alert-success").should("be.visible").and("contain", "sucesso");
});

Then("devo ver uma mensagem de erro sobre o tamanho da senha", () => {
  cy.get(".alert-error").should("be.visible").and("contain", "Por favor, corrija os erros no formulário.");
});

Then("verei uma mensagem de erro sobre o login já existente", () => {
  cy.get(".alert-error").should("be.visible").and("contain", "Já existe um usuário com esse login");
});

Then("verei uma mensagem de erro sobre o nome em branco", () => {
  cy.get(".alert-error").should("be.visible").and("contain", "Por favor, corrija os erros no formulário.");
});

Then("o usuário {string} deve aparecer na lista", (nomeUsuario: string) => {
  cy.get(".admin-table").should("contain", nomeUsuario);
});

Then("o usuário {string} não deve mais aparecer na lista", (nome: string) => {
  cy.get(".admin-table").should("not.contain", nome);
});

