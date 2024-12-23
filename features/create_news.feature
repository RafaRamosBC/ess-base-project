Feature: Criar Notícias
    As a usuário administrador
    I want to criar notícias para informar os usuários do sistema
    So that os usuários possam visualizar novidades sobre o restaurante universitário

    Scenario: Criação de notícia com sucesso
        Given estou na página "Criar Notícia"
        When Eu preencho o "titulo" com "Novo prato disponível no RU", o "subtítulo" com "Prato vegetariano chega ao cardápio",
        o "corpo da notícia" com "O restaurante universitário agora oferece uma opção de prato vegetariano para atender a
        demanda dos estudantes.", a "data de publicação" com "15/12/2024"
        Then uma mensagem "Notícia publicada com sucesso" é exibida
        And a notícia aparece na página de notícias com o título "Novo prato disponível no RU" e a data de publicação "15/12/2024".

    Scenario: Criação de notícia com título ou corpo excedendo limite
        Given estou na página "Criar Notícia"
        When Eu preencho o "título" com "Esta notícia tem um título muito longo para passar do limite de 100 caracteres, portanto
        não será permitido", o "subtítulo" com "Exemplo de título muito longo", o "corpo da notícia" com "Texto válido"
        And Eu clico em "Publicar"
        Then uma mensagem "O título não pode exceder 100 caracteres" é exibida
        And sou retornado a página "Notícias"
        And a notícia não é publicadaaaaaaaaaaaa.
