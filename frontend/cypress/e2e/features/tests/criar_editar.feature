Feature: Sign Up

    # GUI Scenarios

    Scenario: Cadastro sem sucesso por senha pequena demais
        Given que estou logado como administrador
        And estou na aba de administrar usuários
        When o usuário preenche o nome com "Vaca", o login com "rfbc", a senha com "12345" e seleciona a permissão como "Usuário"
        And pressiono o botão "Salvar"
        Then devo ver uma mensagem de erro sobre o tamanho da senha

    Scenario: Cadastro com sucesso
        Given que estou logado como administrador
        And estou na aba de administrar usuários
        When o usuário preenche o nome com "Vaca", o login com "rfbc", a senha com "sa12303123123123" e seleciona a permissão como "Usuário"
        And pressiono o botão "Salvar"
        Then verei uma mensagem de sucesso

    Scenario: Cadastro sem sucesso por login já existente
        Given que estou logado como administrador
        And estou na aba de administrar usuários
        When o usuário preenche o nome com "Vaca", o login com "rfbc", a senha com "sa12303123123123" e seleciona a permissão como "Usuário"
        And pressiono o botão "Salvar"
        Then verei uma mensagem de erro sobre o login já existente
    
    Scenario: Cadastro sem sucesso por nome em branco
        Given que estou logado como administrador
        And estou na aba de administrar usuários
        When o usuário preenche o login com "rfbc", a senha com "sa12303123123123" e seleciona a permissão como "Usuário"
        And pressiono o botão "Salvar"
        Then verei uma mensagem de erro sobre o nome em branco

    Scenario: Editar usuário existente
        Given que estou logado como administrador
        And estou na aba de administrar usuários
        And existe um usuário chamado "João Silva" com login "joao.silva"
        When clico no botão de edição desse usuário
        And mudo o campo "Nome" para "Vaca Miss Eravel"
        And pressiono o botão "Salvar"
        Then devo ver uma mensagem de sucesso
        And o usuário "Vaca Miss Eravel" deve aparecer na lista

    Scenario: Excluir usuário existente
        Given que estou logado como administrador
        And estou na aba de administrar usuários
        And existe um usuário chamado "Vaca Miss Eravel" com login "joao.silva"
        When clico no botão de exclusão do usuário "Vaca Miss Eravel"
        And confirmo a exclusão
        Then o usuário "Vaca Miss Eravel" não deve mais aparecer na lista