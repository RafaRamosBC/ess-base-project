Feature: Pratos Mais Vistos
  Como usuário, desejo visualizar os pratos mais vistos para descobrir as opções mais populares.

  Scenario: Listar os pratos mais vistos
    Given que estou logado como administrador
    When eu clico no botão "Mais Vistos"
    Then a seção "Mais Vistos"

  Scenario: Listar os pratos mais vistos
    Given que estou logado como usuario
    When eu clico no botão "Mais Vistos"
    Then a seção "Mais Vistos"