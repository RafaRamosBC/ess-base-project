Feature: News

    # GUI Scenarios
    Scenario: Visualizar lista de pratos existentes
        Given que estou logado como administrador
        And que estou na página de gerenciamento de pratos
        Then devo ver a lista de pratos cadastrados
        And cada prato deve exibir nome, categoria e ingredientes

   Scenario: Adicionar nova notícia com sucesso
        Given que estou logado como administrador
        And que estou na página de gerenciamento de pratos
        When preencho o campo nome com "Prato Teste", a categoria com "Carnes" e os ingredientes com "Carnes Online"
        And clico no botão "Salvar" 
        Then devo ver uma mensagem de sucesso
        And o prato "Prato Teste" deve aparecer na lista
    
    Scenario: Editar prato existente
        Given que estou logado como administrador
        And que estou na página de gerenciamento de pratos
        And que existe um prato chamado "Sushi Variado" 
        When clico no botão de edição desse prato
        And troco o campo de "Nome" para "Prato Inovador" com categoria "Carnes"
        And clico no botão "Salvar"
        Then devo ver uma mensagem de sucesso
        And o prato "Prato Inovador" deve aparecer na lista

    Scenario: Excluir prato existente
        Given que estou logado como administrador
        And que estou na página de gerenciamento de pratos
        And que existe um prato chamado "Prato Inovador" 
        When clico no botão de exclusão do prato "Prato Inovador"
        And confirmo a exclusão
        Then o prato "Prato Inovador" não deve mais aparecer na lista