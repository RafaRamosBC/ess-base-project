Feature: Relatórios de Uso
    As um administrador do sistema
    I want gerar e visualizar relatórios detalhados sobre o uso do sistema, como pratos mais acessados ou categorias mais populares
    So that eu possa tomar decisões informadas para melhorar a experiência do usuário e otimizar o sistema.

Scenario: Gerar relatório de pratos mais acessados por categoria
    Given o administrador "Fernanda Rocha" está autenticado no sistema  
    And existem as seguintes categorias:  
        | Categoria   | 
        | Aves        | 
        | Sobremesas  | 
        | Italiana    | 
        | Saladas     |  
        | Japonesa    |
        | Brasileira  |
        | Carnes      |
        | Massas      |
        | Mexicana    |  
    When o administrador faz uma requisição "GET" para "/usage-report/mais-acessados" com os seguintes parâmetros:  
        | filtro      |
        | categoria   |
    Then o status da resposta deve ser "200"  
    And o JSON da resposta deve conter:  
        """
        {
            "relatorio": [
                { "categoria": "Aves", "acessos": 1000 },
                { "categoria": "Sobremesas", "acessos": 925 },
                { "categoria": "Italiana", "acessos": 521 },
                { "categoria": "Saladas", "acessos": 500 },
                { "categoria": "Japonesa", "acessos": 253 },
                { "categoria": "Brasileira", "acessos": 250 },
                { "categoria": "Carnes", "acessos": 12 }
            ]
        }
        """

Scenario: Filtrar relatório por categoria específica
    Given o administrador "Fernanda Rocha" está autenticado no sistema
    And existem as seguintes categorias:
        | Categoria   | 
        | Aves        | 
        | Sobremesas  | 
        | Italiana    | 
        | Saladas     |  
        | Japonesa    |
        | Brasileira  |
        | Carnes      |
        | Massas      |
        | Mexicana    |  
    When o administrador faz uma requisição "GET" para "/usage-report/mais-acessados" com os seguintes parâmetros:
        | filtro      |
        | Carnes      |
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter:
        """
        {
            "relatorio": [
                { "categoria": "Carnes", "acessos": 12 }
            ]
        }
        """

Scenario: Obter estatísticas do dashboard
    Given o administrador "Fernanda Rocha" está autenticado no sistema
    When o administrador faz uma requisição "GET" para "/usage-report/estatisticas"
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter:
        """
        {
            "totalDishes": 8,
            "totalCategories": 9,
            "totalUsers": 10,
            "totalNews": 2,
            "totalViews": 4099,
            "averageRating": 4.4,
            "totalFavorites": 17
        }
        """

Scenario: Obter os 5 pratos mais visualizados
    Given o administrador "Rafael Almeida" está autenticado no sistema
    And existem os seguintes pratos:
        | Pratos              | 
        | Frango à Parmegiana | 
        | Risoto de Cogumelos | 
        | Feijoada            | 
        | Tacos de Carne      |  
        | Bolo de Chocolate   |
        | Sushi Variado       |
        | Salada Caesar       | 
        | Lasanha de Carne    | 
    When o administrador faz uma requisição "GET" para "/usage-report/mais-acessados" com os seguintes parâmetros:
        | filtro              | limite              |
        | pratos              | 5                   |
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter:
        """
        [
            { "id": 1, "name": "Frango à Parmegiana", "views": 1000 },
            { "id": 8, "name": "Bolo de Chocolate", "views": 925 },
            { "id": 3, "name": "Salada Caesar", "views": 500 },
            { "id": 2, "name": "Lasanha de Carne", "views": 376 },
            { "id": 4, "name": "Sushi Variado", "views": 253 }
        ]
        """

Scenario: Obter os 5 pratos melhor avaliados
    Given o administrador "Rafael Almeida" está autenticado no sistema
    And existem os seguintes pratos:
        | Pratos              |
        | Frango à Parmegiana |
        | Lasanha de Carne    |
        | Salada Caesar       |
        | Sushi Variado       |
        | Feijoada            |
        | Risoto de Cogumelos |
        | Tacos de Carne      |
        | Bolo de Chocolate   |
    When o administrador faz uma requisição "GET" para "/usage-report/melhor-avaliado" com os seguintes parâmetros:
        | filtro              | limite |
        | rating              | 5      |
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter:
        """
        [
            { "id": 4, "name": "Sushi Variado", "rating": 4.8 },
            { "id": 5, "name": "Feijoada", "rating": 4.7 },
            { "id": 8, "name": "Bolo de Chocolate", "rating": 4.6 },
            { "id": 2, "name": "Lasanha de Carne", "rating": 4.5 },
            { "id": 6, "name": "Risoto de Cogumelos", "rating": 4.3 }
        ]
        """

Scenario: Obter a distribuição de pratos em cada categoria
    Given o administrador "Rafael Almeida" está autenticado no sistema
    And existem as seguintes categorias:
        | Categoria   | 
        | Aves        | 
        | Sobremesas  | 
        | Italiana    | 
        | Saladas     |  
        | Japonesa    |
        | Brasileira  |
        | Carnes      |
        | Massas      |
        | Mexicana    |  
    And existem os seguintes pratos:
        | Pratos              | 
        | Frango à Parmegiana | 
        | Risoto de Cogumelos | 
        | Feijoada            | 
        | Tacos de Carne      |  
        | Bolo de Chocolate   |
        | Sushi Variado       |
        | Salada Caesar       | 
        | Lasanha de Carne    |
    When o administrador faz uma requisição "GET" para "/usage-report/distribuicao" com os seguintes parâmetros:
        | selecionado | filtro      |
        | categoria   | pratos      |
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter:
        """
        [
            { "categoria": "Italiana", "quantidade": 2 },
            { "categoria": "Aves", "quantidade": 1 },
            { "categoria": "Brasileira", "quantidade": 1 },
            { "categoria": "Carnes", "quantidade": 1 },
            { "categoria": "Japonesa", "quantidade": 1 },
            { "categoria": "Saladas", "quantidade": 1 },
            { "categoria": "Sobremesas", "quantidade": 1 },
            { "categoria": "Massas", "quantidade": 0 },
            { "categoria": "Mexicana", "quantidade": 0 }
        ]
        """

Scenario: Obter a distribuição de avaliações
    Given o administrador "Juliana Ferreira" está autenticado no sistema
    And existem os seguintes pratos:
        | Pratos              | 
        | Frango à Parmegiana | 
        | Risoto de Cogumelos | 
        | Feijoada            | 
        | Tacos de Carne      |  
        | Bolo de Chocolate   |
        | Sushi Variado       |
        | Salada Caesar       | 
        | Lasanha de Carne    | 
    When o administrador faz uma requisição "GET" para "/usage-report/distribuicao" com os seguintes parâmetros:
        | selecionado         | filtro      |
        | rating              | pratos      |
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter:
        """
        [
            { "rating": 5, "quantidade": 0 },
            { "rating": 4, "quantidade": 8 },
            { "rating": 3, "quantidade": 0 },
            { "rating": 2, "quantidade": 0 },
            { "rating": 1, "quantidade": 0 },
            { "rating": 0, "quantidade": 0 }
        ]
        """

Scenario: Obter os 5 pratos mais favoritados
    Given o administrador "Juliana Ferreira" está autenticado no sistema
    And existem os seguintes pratos:
        | Pratos              | 
        | Frango à Parmegiana | 
        | Risoto de Cogumelos | 
        | Feijoada            | 
        | Tacos de Carne      |  
        | Bolo de Chocolate   |
        | Sushi Variado       |
        | Salada Caesar       | 
        | Lasanha de Carne    |
    When o administrador faz uma requisição "GET" para "/usage-report/mais-favoritados" com os seguintes parâmetros:
        | filtro              | limite |
        | pratos              | 5      |
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter:
        """
        [
            { "id": 8, "name": "Bolo de Chocolate", "favoritos": 3 },
            { "id": 6, "name": "Risoto de Cogumelos", "favoritos": 3 },
            { "id": 1, "name": "Frango à Parmegiana", "favoritos": 2 },
            { "id": 2, "name": "Lasanha de Carne", "favoritos": 2 },
            { "id": 3, "name": "Salada Caesar", "favoritos": 2 }
        ]
        """

Scenario: Acesso não autorizado ao relatório
    Given o usuário comum "Lucas Pereira" está autenticado no sistema
    When o usuário tenta acessar a rota "/usage-report/mais-acessados"
    Then o status da resposta deve ser "403"
    And o JSON da resposta deve conter:
        """
        { "error": "Usuário com o nome \"Lucas Pereira\" não possuí permissões suficientes." }
        """