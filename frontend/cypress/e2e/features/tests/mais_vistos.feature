Feature: Pratos Mais Vistos
  Como usuário, desejo visualizar os pratos mais vistos para descobrir as opções mais populares.

  @maisVisto
  Scenario: Listar os pratos mais vistos
    Given que o sistema possui os seguintes pratos cadastrados maisVistos:
      | nome                  | categoria  | nota | visualizacoes | descricao                                                        |
      | Frango à Parmegiana  | Aves       | 4.2  | 1005          | Filé de frango empanado coberto com molho de tomate e queijo    |
      | Lasanha de Carne     | Italiana   | 4.5  | 385           | Camadas de massa intercaladas com molho de carne e queijo        |
      | Salada Caesar        | Saladas    | 4.0  | 503           | Salada clássica com alface, croutons e molho Caesar              |
      | Sushi Variado        | Japonês    | 4.8  | 256           | Seleção de sushi com peixes frescos e arroz temperado           |
      | Feijoada            | Brasileira | 4.7  | 250           | Prato tradicional brasileiro com feijão preto e carnes          |
      | Risoto de Cogumelos | Italiana   | 4.3  | 145           | Risoto cremoso preparado com cogumelos frescos                   |
      | Tacos de Carne      | Carnes Premium    | 4.1  | 12            | Tortilhas de milho recheadas com carne temperada                 |
      | Bolo de Chocolate   | Sobremesas | 4.6  | 930           | Bolo macio e úmido com cobertura de chocolate                   |
    When o usuário faz uma requisição GET para "/most-viewed" maisVisto
    Then a resposta deve ser "200" maisVisto
    And a resposta deve conter os pratos ordenados por visualizações em ordem decrescente:
      | nome                  | visualizacoes |
      | Frango à Parmegiana  | 1005          |
      | Bolo de Chocolate    | 930           |
      | Salada Caesar        | 503           |
      | Lasanha de Carne     | 385           |
      | Sushi Variado        | 256           |
      | Feijoada            | 250           |
      | Risoto de Cogumelos | 145           |
      | Tacos de Carne      | 12            |

  @maisVisto
  Scenario: Listar os pratos mais vistos após adicionar um novo prato
    Given que o prato "Pizza Margherita" foi adicionado ao sistema com 800 visualizações
    When o usuário faz uma requisição GET para "/most-viewed" maisVisto
    Then a resposta deve ser "200" maisVisto
    And a resposta deve conter os pratos ordenados por visualizações em ordem decrescente:
      | nome                  | visualizacoes |
      | Frango à Parmegiana  | 1005          |
      | Bolo de Chocolate    | 930           |
      | Pizza Margherita     | 800           |
      | Salada Caesar        | 503           |
      | Lasanha de Carne     | 385           |
      | Sushi Variado        | 256           |
      | Feijoada            | 250           |
      | Risoto de Cogumelos | 145           |
      | Tacos de Carne      | 12            |

  @maisVisto
  Scenario: Listar os pratos mais vistos após remover um prato
    Given que o prato "Pizza Margherita" foi removido do sistema
    When o usuário faz uma requisição GET para "/most-viewed" maisVisto
    Then a resposta deve ser "200" maisVisto
    And a resposta deve conter os pratos ordenados por visualizações em ordem decrescente:
      | nome                  | visualizacoes |
      | Frango à Parmegiana  | 1005          |
      | Bolo de Chocolate    | 930           |
      | Salada Caesar        | 503           |
      | Lasanha de Carne     | 385           |
      | Sushi Variado        | 256           |
      | Feijoada            | 250           |
      | Risoto de Cogumelos | 145           |
      | Tacos de Carne      | 12            |

  @maisVisto
  Scenario: Listar os pratos mais vistos sem pratos cadastrados
    Given que não há pratos cadastrados no sistema
    When o usuário faz uma requisição GET para "/most-viewed" maisVisto
    Then a resposta deve ser "200" maisVisto
    And a resposta deve conter uma lista vazia
