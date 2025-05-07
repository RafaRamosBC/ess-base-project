Feature: Busca de Pratos
  Como usuário, desejo buscar pratos por diferentes critérios para encontrar a melhor opção.

  Scenario: Buscar um prato pelo nome ADM
    Given que estou logado como administrador
    Given que existe um prato chamado "Bolo de Chocolate"
    When eu pesquiso por "Bolo de Chocolate" no campo de busca
    Then devo ver o prato "Bolo de Chocolate" nos resultados

  Scenario: Buscar pratos por categoria ADM
    Given que estou logado como administrador
    Given que existem pratos cadastrados na categoria "Italiana"
    When eu seleciono a categoria "Italiana" no filtro de busca
    Then devo ver o prato "Lasanha de Carne" nos resultados

  Scenario: Buscar pratos por uma nota mínima ADM
    Given que estou logado como administrador
    Given que existem pratos com diferentes avaliações
    When eu defino a nota mínima como "4.5" no filtro de busca
    Then devo ver o prato "Bolo de Chocolate" nos resultados

  Scenario: Buscar pratos com visualização minima ADM
    Given que estou logado como administrador
    Given que existem pratos com diferentes números de visualizações
    When eu defino o minimo de views como "500"
    Then devo ver o prato "Bolo de Chocolate" nos resultados

  Scenario: Filtrar pratos utilizando múltiplos critérios ADM
    Given que estou logado como administrador
    When eu seleciono a categoria "Italiana" e a nota mínima "4.5" no filtro de busca
    Then devo ver o prato "Lasanha de Carne" nos resultados

  Scenario: Filtrar pratos sem retorno de resultados ADM
    Given que estou logado como administrador
    Given que não existem pratos cadastrados que atendam aos filtros aplicados
    When eu defino a nota mínima como "5" no filtro de busca
    Then devo ver a mensagem "Nenhum prato encontrado com esses filtros"

  Scenario: Limpar filtros da busca ADM
    Given que estou logado como administrador
    Given que existem filtros aplicados na busca
    When eu clico no botão "Limpar filtros"
    Then devo ver o prato "Bolo de Chocolate" nos resultados

  Scenario: Buscar um prato pelo nome
    Given que estou logado como usuario
    Given que existe um prato chamado "Bolo de Chocolate"
    When eu pesquiso por "Bolo de Chocolate" no campo de busca
    Then devo ver o prato "Bolo de Chocolate" nos resultados

  Scenario: Buscar pratos por categoria
    Given que estou logado como usuario
    Given que existem pratos cadastrados na categoria "Italiana"
    When eu seleciono a categoria "Italiana" no filtro de busca
    Then devo ver o prato "Lasanha de Carne" nos resultados

  Scenario: Buscar pratos por nota mínima
    Given que estou logado como usuario
    Given que existem pratos com diferentes avaliações
    When eu defino a nota mínima como "4.5" no filtro de busca
    Then devo ver o prato "Bolo de Chocolate" nos resultados

  Scenario: Buscar pratos min views
    Given que estou logado como usuario
    Given que existem pratos com diferentes números de visualizações
    When eu defino o minimo de views como "500"
    Then devo ver o prato "Bolo de Chocolate" nos resultados

  Scenario: Filtrar pratos utilizando múltiplos critérios
    Given que estou logado como usuario
    When eu seleciono a categoria "Italiana" e a nota mínima "4.5" no filtro de busca
    Then devo ver o prato "Lasanha de Carne" nos resultados

  Scenario: Filtrar pratos sem retorno de resultados
    Given que estou logado como usuario
    Given que não existem pratos cadastrados que atendam aos filtros aplicados
    When eu defino a nota mínima como "5" no filtro de busca
    Then devo ver a mensagem "Nenhum prato encontrado com esses filtros"

  Scenario: Limpar filtros da busca
    Given que estou logado como usuario
    Given que existem filtros aplicados na busca
    When eu clico no botão "Limpar filtros"
    Then devo ver o prato "Bolo de Chocolate" nos resultados
