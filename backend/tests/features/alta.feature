Feature: Seção "Em Alta"

  # Cenários de Exibição de Conteúdos com mais de cinco itens
  Scenario: Exibir lista de noticias em alta
    Given que existem mais de cinco noticias populares nas categorias "noticias"
    When faço uma requisição GET para "/trending/em-alta?type=noticias"
    Then devo receber uma lista das cinco noticias em alta
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes

  Scenario: Exibir lista de pratos em alta
    Given que existem mais de cinco pratos populares na categoria "pratos"
    When faço uma requisição GET para "/trending/em-alta?type=pratos"
    Then devo receber uma lista dos cinco pratos em alta
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes

  Scenario: Exibir lista de pratos em alta por categoria
    Given que existem mais de cinco itens populares na categoria "Italiana"
    When faço uma requisição GET para "/trending/em-alta?category=Italiana"
    Then devo receber uma lista das cinco noticias em alta
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes

  Scenario: Exibir conteúdos populares entre todos os usuários
    Given que existem mais de cinco conteúdos com alta visualização e interação de todos os usuários nas categorias "pratos" e "noticias"
    When faço uma requisição GET para "/trending/em-alta"
    Then devo receber os cinco conteúdos mais populares entre todos os usuários
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes

  # Cenários de Exibição com menos de cinco itens
  Scenario: Exibir lista de noticias em alta
    Given que existem menos de cinco noticias populares nas categorias "noticias"
    When faço uma requisição GET para "/trending/em-alta?type=noticias"
    Then devo receber uma lista das noticias em alta
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes

  Scenario: Exibir lista de pratos em alta
    Given que existem menos de cinco pratos populares na categoria "pratos"
    When faço uma requisição GET para "/trending/em-alta?type=pratos"
    Then devo receber uma lista dos pratos em alta
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes

  Scenario: Exibir lista de pratos em alta por categoria
    Given que existem menos de cinco itens populares na categoria "Italiana"
    When faço uma requisição GET para "/trending/em-alta?category=Italiana"
    Then devo receber uma lista das noticias em alta
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes

  Scenario: Exibir conteúdos populares entre todos os usuários
    Given que existem menos de cinco conteúdos com alta visualização e interação de todos os usuários nas categorias "pratos" e "noticias"
    When faço uma requisição GET para "/trending/em-alta"
    Then devo receber os conteúdos mais populares entre todos os usuários
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes

  # Cenários de Exibição com cinco itens
  Scenario: Exibir lista de noticias em alta
    Given que existem exatamente cinco noticias populares nas categorias "noticias"
    When faço uma requisição GET para "/trending/em-alta?type=noticias"
    Then devo receber uma lista das cinco noticias em alta
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes

  Scenario: Exibir lista de pratos em alta
    Given que existem exatamente cinco pratos populares na categoria "pratos"
    When faço uma requisição GET para "/trending/em-alta?type=pratos"
    Then devo receber uma lista dos cinco pratos em alta
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes

  Scenario: Exibir lista de pratos em alta por categoria
    Given que existem exatamente cinco itens populares na categoria "Italiana"
    When faço uma requisição GET para "/trending/em-alta?category=Italiana"
    Then devo receber uma lista das cinco noticias em alta
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes

  Scenario: Exibir conteúdos populares entre todos os usuários
    Given que existem exatamente cinco conteúdos com alta visualização e interação de todos os usuários nas categorias "pratos" e "noticias"
    When faço uma requisição GET para "/trending/em-alta"
    Then devo receber os cinco conteúdos mais populares entre todos os usuários
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes

  # Cenários de Exibição sem itens
  Scenario: Exibir lista de noticias em alta
    Given que não existem noticias populares nas categorias "noticias"
    When faço uma requisição GET para "/trending/em-alta?type=noticias"
    Then devo receber um alerta da ausência de itens
    And o código de status da resposta deve ser "200"

  Scenario: Exibir lista de pratos em alta
    Given que não existem pratos populares na categoria "pratos"
    When faço uma requisição GET para "/trending/em-alta?type=pratos"
    Then devo receber um alerta da ausência de itens
    And o código de status da resposta deve ser "200"

  Scenario: Exibir lista de pratos em alta por categoria
    Given que não existem itens populares na categoria "Italiana"
    When faço uma requisição GET para "/trending/em-alta?category=Italiana"
    Then devo receber um alerta da ausência de itens
    And o código de status da resposta deve ser "200"

  Scenario: Exibir conteúdos populares entre todos os usuários
    Given que não existem conteúdos com alta visualização e interação de todos os usuários nas categorias "pratos" e "noticias"
    When faço uma requisição GET para "/trending/em-alta"
    Then devo receber um alerta da ausência de itens
    And o código de status da resposta deve ser "200"

  # Cenários de Exibição com apenas um item
  Scenario: Exibir apenas uma noticia em alta
    Given que existe apenas uma noticia popular nas categorias "noticias"
    When faço uma requisição GET para "/trending/em-alta?type=noticias"
    Then devo receber um único item da categoria
    And o código de status da resposta deve ser "200"

  Scenario: Exibir apenas um prato em alta
    Given que existe apenas um prato popular na categoria "pratos"
    When faço uma requisição GET para "/trending/em-alta?type=pratos"
    Then devo receber um único item da categoria
    And o código de status da resposta deve ser "200"

  Scenario: Exibir apenas um prato em alta por categoria
    Given que existe apenas um iten popular na categoria "Italiana"
    When faço uma requisição GET para "/trending/em-alta?category=Italiana"
    Then devo receber um único item da categoria
    And o código de status da resposta deve ser "200"

  Scenario: Exibir apena um conteúdo populare entre todos os usuários
    Given que existe apenas um conteúdo com alta visualização e interação de todos os usuários nas categorias "pratos" e "noticias"
    When faço uma requisição GET para "/trending/em-alta"
    Then devo receber um único item da categoria
    And o código de status da resposta deve ser "200"

  # Cenários de Exibição de Conteúdos com mais de cinco itens das ultimas vinte e quatro horas
  Scenario: Exibir lista de noticias em alta
    Given que existem mais de cinco noticias populares nas categorias "noticias"
    When faço uma requisição GET para "/trending/em-alta?type=noticias"
    Then devo receber uma lista das noticias em alta das últimas vinte e quatro horas
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes

  Scenario: Exibir lista de pratos em alta
    Given que existem mais de cinco pratos populares na categoria "pratos"
    When faço uma requisição GET para "/trending/em-alta?type=pratos"
    Then devo receber uma lista dos pratos em alta das últimas vinte e quatro horas
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes

  Scenario: Exibir lista de pratos em alta por categoria
    Given que existem mais de cinco itens populares na categoria "Italiana"
    When faço uma requisição GET para "/trending/em-alta?category=Italiana"
    Then devo receber uma lista das noticias em alta das últimas vinte e quatro horas
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes

  Scenario: Exibir conteúdos populares entre todos os usuários
    Given que existem mais de cinco conteúdos com alta visualização e interação de todos os usuários nas categorias "pratos" e "noticias"
    When faço uma requisição GET para "/trending/em-alta"
    Then devo receber os conteúdos mais populares entre todos os usuários das últimas vinte e quatro horas
    And o código de status da resposta deve ser "200"
    And os conteúdos devem ser organizados por popularidade, com base nas visualizações recentes