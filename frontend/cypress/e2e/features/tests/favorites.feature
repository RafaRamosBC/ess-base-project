Feature: Favorites

    # GUI Scenarios

    Scenario: Adicionar prato aos favoritos
        Given que estou logado como administrador
        And que estou na página de feed
        When clico no botão de favoritar do prato "Feijoada"
        And vou para a página de favoritos
        Then devo ver o prato "Feijoada" na lista de favoritos

    Scenario: Remover prato dos favoritos
        Given que estou logado como administrador
        And que estou na página de favoritos
        And que existe um prato favoritado chamado "Feijoada"
        When clico no botão de favoritar do prato "Feijoada"
        Then o prato "Feijoada" não deve estar mais na lista de favoritos

    Scenario: Adicionar prato aos favoritos
        Given que estou logado como administrador
        And que estou na página de feed
        When clico no botão de favoritar do prato "Bolo de Chocolate"
        And vou para a página de favoritos
        Then devo ver o prato "Bolo de Chocolate" na lista de favoritos

    Scenario: Remover prato favorito da pagina de feed
        Given que estou logado como administrador
        And que estou na página de feed
        And que existe um prato favoritado chamado "Bolo de Chocolate" no feed
        When clico no botão de favoritar do prato "Bolo de Chocolate"
        And vou para a página de favoritos
        Then o prato "Bolo de Chocolate" não deve estar mais na lista de favoritos