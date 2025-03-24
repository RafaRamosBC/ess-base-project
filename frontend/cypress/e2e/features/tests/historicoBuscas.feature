Feature: Histórico de buscas e pesquisa de pratos
  Como usuário, quero buscar pratos e ver meu histórico de buscas para repetir pesquisas e limpar as que não preciso

  Scenario: Visualizar o histórico ao clicar na barra de busca
    Given que estou logado como usuário
    And estou na página inicial
    When foco na barra de busca
    Then o histórico de buscas deve ser exibido

  Scenario: Fazer uma busca simples sem filtro
    Given que estou logado como usuário
    And estou na página inicial
    When preencho o campo de busca com "Feijoada"
    And aperto ENTER no campo de busca
    Then devo ver o prato com nome "Feijoada" nos resultados
    And devo ver os parâmetros de busca contendo "Feijoada"

  Scenario: Persistência do histórico após atualização da página
    Given que estou logado como usuário
    And estou na página inicial
    When preencho o campo de busca com "Tacos"
    And aperto ENTER no campo de busca
    And atualizo a página
    And foco na barra de busca
    Then "Tacos" ainda deve aparecer no histórico

  Scenario: Fazer uma busca usando filtro de categoria
    Given que estou logado como usuário
    And estou na página inicial
    When clico no ícone de engrenagem para abrir os filtros
    And seleciono o filtro "Categoria" com valor "Italiana"
    And aperto ENTER no campo de busca
    Then devo ver somente pratos da categoria "Italiana" nos resultados
    And o histórico de buscas deve registrar o filtro { "category": "Italiana" }

  Scenario: Buscar um prato pelo nome e ver o histórico
    Given que estou logado como usuário
    And estou na página inicial
    When preencho o campo de busca com "Sushi"
    And aperto ENTER no campo de busca
    Then devo ver o prato com nome "Sushi Variado" nos resultados
    And devo ver os parâmetros de busca contendo "Sushi"

  Scenario: Buscar um prato que não existe
    Given que estou logado como usuário
    And estou na página inicial
    When preencho o campo de busca com "PratoInexistente"
    And aperto ENTER no campo de busca
    Then devo ver uma mensagem de erro "Nenhum prato encontrado"
    And devo ver os parâmetros de busca contendo "PratoInexistente"

  Scenario: Limpar todo o histórico de buscas
    Given que estou logado como usuário
    And estou na página inicial
    And o histórico de buscas já tem buscas
    When clico no botão "Limpar Tudo" no histórico
    Then o histórico de buscas deve estar vazio

  Scenario: Remover uma busca do histórico
    Given que estou logado como usuário
    And estou na página inicial
    And o usuário possui "Lasanha" em seu histórico de buscas
    When clico no ícone de exclusão ao lado de "Lasanha"
    Then "Lasanha" não deve mais aparecer no histórico


  Scenario: Não adicionar busca vazia
    Given que estou logado como usuário
    And estou na página inicial
    When preencho o campo de busca com ""
    And aperto ENTER no campo de busca
    Then o histórico de buscas não deve ser atualizado

  Scenario: Várias buscas em sequência
    Given que estou logado como usuário
    And estou na página inicial
    When preencho o campo de busca com "Tacos"
    And aperto ENTER no campo de busca
    And preencho o campo de busca com "Bolo"
    And aperto ENTER no campo de busca
    Then o item "Bolo" deve aparecer no topo do histórico de buscas

  Scenario: Não atualizar o histórico se ocorrer erro na busca
    Given que estou logado como usuário
    And estou na página inicial
    When preencho o campo de busca com "ErroBusca"
    And aperto ENTER no campo de busca
    Then devo ver uma mensagem de erro "Erro na busca"
    And o histórico de buscas não deve ser atualizado

  Scenario: Exportar o histórico de buscas
    Given que estou logado como usuário
    And estou na página inicial
    When clico no botão "Exportar Histórico"
    And seleciono o formato "CSV"
    Then um arquivo com o histórico de buscas deve ser baixado

  Scenario: Remover uma busca e ver a atualização do histórico
    Given que estou logado como usuário
    And estou na página inicial
    When preencho o campo de busca com "Churrasco"
    And aperto ENTER no campo de busca
    And clico no botão de excluir do item "Churrasco" no histórico
    Then "Churrasco" não deve aparecer mais no histórico

  Scenario: Fazer uma busca com vários filtros
    Given que estou logado como usuário
    And estou na página inicial
    When preencho o campo de busca com "La"
    And seleciono o filtro "Categoria" com valor "Italiana"
    And seleciono o filtro "Nota Mínima" com valor "4.0"
    And aperto ENTER no campo de busca
    Then devo ver um prato que contenha "La" no nome nos resultados
    And o histórico de buscas deve registrar "La" e os filtros { "category": "Italiana", "minNota": "4.0" }

  Scenario: Verificar número total de buscas
    Given que já fiz 3 buscas anteriormente
    When preencho o campo de busca com "Risoto"
    And aperto ENTER no campo de busca
    Then o número de itens no histórico deve ser 4
