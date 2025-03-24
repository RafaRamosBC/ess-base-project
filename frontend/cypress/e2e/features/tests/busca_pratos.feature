Feature: Busca de Pratos
  Como usuário, desejo buscar pratos por diferentes critérios para encontrar a melhor opção.

  Scenario: Buscar um prato pelo nome
    Given que estou logado como administrador
    Given que existe um prato chamado "Bolo de Chocolate"
    When eu pesquiso por "Bolo de Chocolate" no campo de busca

  Scenario: Buscar pratos por categoria
    Given que estou logado como administrador
    Given que existem pratos cadastrados na categoria "Italiana"
    When eu seleciono a categoria "Italiana" no filtro de busca
    Then devo ver apenas pratos da categoria "Italiana" nos resultados

  Scenario: Buscar pratos por nota mínima
    Given que estou logado como administrador
    Given que existem pratos com diferentes avaliações
    When eu defino a nota mínima como "4.5" no filtro de busca
    Then devo ver apenas pratos com nota igual ou superior a 4.5 nos resultados

  Scenario: Buscar pratos mais vistos
    Given que estou logado como administrador
    Given que existem pratos com diferentes números de visualizações
    When eu aplico o filtro "Mais vistos"
    Then devo ver uma lista com os 5 pratos mais visualizados

  Scenario: Filtrar pratos utilizando múltiplos critérios
    Given que estou logado como administrador
    Given que existem pratos cadastrados com categorias e avaliações diversas
    When eu seleciono a categoria "Brasileira"
    And eu defino a nota mínima como "4.5"
    Then devo ver os pratos que correspondem aos critérios aplicados

  Scenario: Filtrar pratos sem retorno de resultados
    Given que estou logado como administrador
    Given que não existem pratos cadastrados que atendam aos filtros aplicados
    When eu defino a nota mínima como "5"
    Then devo ver a mensagem "Nenhum prato encontrado com esses filtros"

  Scenario: Limpar filtros da busca
    Given que estou logado como administrador
    Given que existem filtros aplicados na busca
    When eu clico no botão "Limpar filtros"
    Then devo ver todos os pratos cadastrados na lista
