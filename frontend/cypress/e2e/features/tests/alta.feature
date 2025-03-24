Feature: Em alta
  Como usuário, desejo visualizar o conteúdo do em alta ordenado pela popularidade.

  Scenario: Visualizar lista de itens populares como usuário
    Given que eu estou logado como usuario
    When eu clico no botão "Em Alta"
    Then a seção "Em Alta"

  Scenario: Visualizar lista de itens populares como administrador
    Given que eu estou logado como administrador
    When eu clico no botão "Em Alta"
    Then a seção "Em Alta"

  Scenario: Avançar pelos itens em alta
    Given que eu estou logado como usuario
    When eu clico no botão "Em Alta"
    And eu clico na seta para avançar
    Then o próximo prato deve estar visível

  Scenario: Voltar pelos itens em alta
    Given que eu estou logado como usuario
    When eu clico no botão "Em Alta"
    And eu clico na seta para avançar
    And eu clico na seta para voltar
    Then o prato inicial deve estar visível
