import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que o sistema possui os seguintes pratos cadastrados maisVistos", (datatable: any) => {
  cy.fixture("pratos").then(pratos => {
    pratos.forEach(prato => {
      cy.request('POST', '/pratos', prato); // Adiciona cada prato ao sistema
    });
  });
});

When("o usuário faz uma requisição GET para \"/most-viewed\"", () => {
  cy.request("/most-viewed").as("mostViewed");
});

Then("a resposta deve ser {string}", (status: string) => {
  cy.get("@mostViewed").its("status").should("eq", parseInt(status));
});

Then("a resposta deve conter os pratos ordenados por visualizações em ordem decrescente", (datatable: any) => {
  const pratos = datatable.hashes();
  cy.get("@mostViewed").its("body").then((body: any) => {
    body.forEach((prato: any, index: number) => {
      expect(prato.nome).to.eq(pratos[index].nome);
      expect(prato.visualizacoes).to.eq(parseInt(pratos[index].visualizacoes));
    });
  });
});

Given("que o prato {string} foi adicionado ao sistema com {int} visualizações", (nomePrato: string, visualizacoes: number) => {
  cy.request("POST", "/pratos", {
    nome: nomePrato,
    categoria: "Italiana",
    nota: 4.5,
    visualizacoes: visualizacoes,
    descricao: "Descrição do prato"
  });
});

Given("que o prato {string} foi removido do sistema", (nomePrato: string) => {
  cy.request("DELETE", `/pratos/${nomePrato}`);
});

Then("a resposta deve conter uma lista vazia", () => {
  cy.get("@mostViewed").its("body").should("be.empty");
});
