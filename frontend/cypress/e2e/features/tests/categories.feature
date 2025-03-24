# gerencia_categorias.feature
Feature: Gerência de Categorias
  Como administrador, desejo gerenciar as categorias do sistema para manter os dados organizados.

  Scenario: Visualizar lista de categorias existentes
    Given que estou logado como administrador
    And que estou na página de gerenciamento de categorias
    Then devo ver a lista de categorias cadastradas
    And cada categoria deve exibir nome e descrição

  Scenario: Adicionar nova categoria com sucesso
    Given que estou logado como administrador
    And que estou na página de gerenciamento de categorias
    When preencho o campo "Nome" com "Categoria Teste"
    And preencho o campo "Descrição" com "Descrição Teste"
    And clico no botão "Salvar"
    Then devo ver uma mensagem de sucesso
    And a categoria "Categoria Teste" deve aparecer na lista

  Scenario: Tentar adicionar categoria sem nome
    Given que estou logado como administrador
    And que estou na página de gerenciamento de categorias
    When deixo o campo "Nome" em branco
    And preencho o campo "Descrição" com "Alguma descrição"
    And clico no botão "Salvar"
    Then devo ver uma mensagem de erro indicando que o nome é obrigatório
    And a categoria não deve ser adicionada

  Scenario: Editar categoria existente
    Given que estou logado como administrador
    And que estou na página de gerenciamento de categorias
    And que existe uma categoria chamada "Brasileira"
    When clico no botão de edição dessa categoria
    And altero o campo "Nome" para "Categoria Editada"
    And clico no botão "Salvar"
    Then devo ver uma mensagem de sucesso
    And a categoria "Categoria Editada" deve aparecer na lista

  Scenario: Excluir categoria existente
    Given que estou logado como administrador
    And que estou na página de gerenciamento de categorias
    And que existe uma categoria chamada "Japonesa"
    When clico no botão de exclusão da categoria "Japonesa"
    And confirmo a exclusão
    Then a categoria "Japonesa" não deve mais aparecer na lista

  Scenario: Tentar adicionar categoria com nome duplicado
    Given que estou logado como administrador
    And que estou na página de gerenciamento de categorias
    And que existe uma categoria chamada "Massas"
    When preencho o campo "Nome" com "Massas"
    And preencho o campo "Descrição" com "Outra descrição"
    And clico no botão "Salvar"
    Then uma mensagem de erro indicando que o nome já existe deve ser exibida

  Scenario: Cancelar edição de categoria
    Given que estou logado como administrador
    And que estou na página de gerenciamento de categorias
    And que existe uma categoria chamada "Categoria Cancelar"
    When clico no botão de edição dessa categoria
    And clico no botão "Cancelar"
    Then a categoria deve manter o nome "Categoria Cancelar" na lista

  Scenario: Adicionar categoria com nome muito longo
    Given que estou logado como administrador
    And que estou na página de gerenciamento de categorias
    When preencho o campo "Nome" com um texto de 101 caracteres
    And preencho o campo "Descrição" com "Descrição longa"
    And clico no botão "Salvar"
    Then devo ver uma mensagem de erro sobre o tamanho do nome

