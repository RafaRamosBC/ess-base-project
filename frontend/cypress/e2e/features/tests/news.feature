Feature: News

    # GUI Scenarios
    Scenario: Visualizar lista de notícias existentes
        Given que estou logado como administrador
        And que estou na página de gerenciamento de notícias
        Then devo ver a lista de notícias cadastradas
        And cada notícia deve exibir título e subtítulo

    Scenario: Adicionar nova notícia com sucesso
        Given que estou logado como administrador
        And que estou na página de gerenciamento de notícias
        When preencho o campo título com "Notícia Teste", o subtítulo com "Subtítulo" e o corpo com "Corpo da notícia teste"
        And clico no botão "Salvar" 
        Then devo ver uma mensagem de sucesso
        And a notícia "Notícia Teste" deve aparecer na lista

    Scenario: Adicionar nova notícia com título acima do limite de caracteres
        Given que estou logado como administrador
        And que estou na página de gerenciamento de notícias
        When preencho o campo título com "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", o subtítulo com "Subtítulo" e o corpo com "Corpo da notícia teste"
        And clico no botão "Salvar" 
        Then devo ver uma mensagem de erro indicando que o título ultrapassou o limite de caracteres
        And a notícia não deve ser adicionada
    
    Scenario: Editar notícia existente
        Given que estou logado como administrador
        And que estou na página de gerenciamento de notícias
        And que existe uma notícia chamada "Novo cardápio no RU UFPE"
        When clico no botão de edição dessa notícia
        And troco o campo "Título" para "Notícia Editada"
        And clico no botão "Salvar"
        Then devo ver uma mensagem de sucesso
        And a notícia "Notícia Editada" deve aparecer na lista

    Scenario: Excluir notícia existente
        Given que estou logado como administrador
        And que estou na página de gerenciamento de notícias
        And que existe uma notícia chamada "Notícia Teste"
        When clico no botão de exclusão da notícia "Notícia Teste"
        And confirmo a exclusão
        Then a notícia "Notícia Teste" não deve mais aparecer na lista
        