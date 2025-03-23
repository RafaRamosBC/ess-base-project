const express = require("express");
const router = express.Router();

const { users } = require('../database/users_list.js');
const { dishes } = require('../../src/database/pratos_aux.js');
const { categories } = require('../../src/database/categorias_aux.js');
const { news } = require('../database/noticias_aux.js');

// Middleware para verificar se o usuário é administrador
function verificarAdmin(req, res, next) {
    const userId = req.headers['user-id'];

    const user = users.find(u => u.id === parseInt(userId));
    if (!user || user.role === "user") {
        return res.status(403).json({ error: `Usuário com o nome "${user.nome}" não possuí permissões suficientes.` });
    }
    next();
}

// Rota para obter relatório de uso
router.get("/mais-acessados", verificarAdmin, (req, res) => {
    const { filtro, limite } = req.query;

    const totalAcessosPratos = dishes.reduce((acc, dish) => acc + (dish.views || 0), 0);

    // Se não houver acessos nos pratos, retorna erro
    if (totalAcessosPratos === 0) { return res.status(404).json({ error: "Nenhum dado disponível." }); }

    if (filtro === "categoria") {
        const relatorioPorCategoria = dishes.reduce((acc, dish) => {
            const categoria = dish.category;
            if (!acc[categoria]) { acc[categoria] = 0; }
            acc[categoria] += dish.views;
            return acc;
        }, {});

        const relatorio = Object.entries(relatorioPorCategoria)
            .map(([categoria, acessos]) => ({ categoria, acessos }))
            .sort((a, b) => b.acessos - a.acessos);

        res.json({
            relatorio
        });
    } else if (filtro !== "categoria" && filtro !== "pratos" && filtro) {
        const pratosFiltrados = dishes.filter(dish => dish.category === filtro);

        if (pratosFiltrados.length === 0) {
            return res.status(404).json({ error: `Nenhum prato encontrado para a categoria "${filtro}".` });
        }

        // Soma os acessos dos pratos da mesma categoria
        const totalAcessos = pratosFiltrados.reduce((acc, dish) => acc + (dish.views || 0), 0);

        if (totalAcessos === 0) {
            return res.status(404).json({ error: `Nenhum acesso registrado para a categoria "${filtro}".` });
        }

        // Retorna um único objeto com a soma dos acessos
        const relatorio = [{
            categoria: filtro,
            acessos: totalAcessos
        }];

        res.json({
            relatorio
        });
    } else if (filtro === "pratos" && limite) {
        // Ordena os pratos por views (do maior para o menor)
        const pratosOrdenados = dishes
            .sort((a, b) => b.views - a.views)
            .slice(0, parseInt(limite)); // Aplica o limite

        // Formata o relatório
        const relatorio = pratosOrdenados.map(dish => ({
            id: dish.id,
            name: dish.name,
            views: dish.views
        }));

        res.json(relatorio);
    } else {
        res.status(400).json({ error: "Filtro não fornecido" });
    }
});

// Rota para obter os pratos melhor avaliados
router.get("/melhor-avaliado", verificarAdmin, (req, res) => {
    const { filtro, limite } = req.query;

    // Verifica se o filtro é "rating" e se o limite foi fornecido
    if (filtro === "rating" && limite) {
        // Ordena os pratos por rating (do maior para o menor)
        const pratosOrdenados = dishes
            .sort((a, b) => b.rating - a.rating)
            .slice(0, parseInt(limite)); // Aplica o limite

        // Formata o relatório
        const relatorio = pratosOrdenados.map(dish => ({
            id: dish.id,
            name: dish.name,
            rating: dish.rating
        }));

        res.json(relatorio);
    } else {
        res.status(400).json({ error: "Filtro ou limite não fornecido corretamente." });
    }
});

// Rota para obter a distribuição de pratos por categoria
router.get("/distribuicao", verificarAdmin, (req, res) => {
    const { selecionado, filtro } = req.query;

    // Verifica se os parâmetros estão corretos
    if (selecionado === "categoria") {
        if (filtro === "pratos") {
            // Agrupa os pratos por categoria
            const distribuicaoCategorias = dishes.reduce((acc, dish) => {
                const categoria = dish.category;
                if (!acc[categoria]) {
                    acc[categoria] = 0;
                }
                acc[categoria] += 1; // Conta a quantidade de pratos por categoria
                return acc;
            }, {});

            // Garante que todas as categorias estejam no relatório, mesmo com quantidade zero
            categories.forEach(categoria => {
                if (!distribuicaoCategorias[categoria.name]) {
                    distribuicaoCategorias[categoria.name] = 0;
                }
            });

            // Converte o objeto em um array e ordena
            const relatorio = Object.entries(distribuicaoCategorias)
                .map(([categoria, quantidade]) => ({ categoria, quantidade }))
                .sort((a, b) => {
                    // Ordena primeiro por quantidade (decrescente)
                    if (b.quantidade !== a.quantidade) {
                        return b.quantidade - a.quantidade;
                    }
                    return a.categoria.localeCompare(b.categoria); // Em caso de empate, ordena por nome da categoria (alfabético)
                });

            res.json(relatorio);
        }
    } else if (selecionado === "rating") {
        if (filtro === "pratos") {
            // Inicializa um objeto para contar a quantidade de pratos por rating (0 a 5)
            const distribuicaoRatings = {};
            for (let i = 0; i <= 5; i++) {
                distribuicaoRatings[i] = 0; // Inicializa todas as ratings com quantidade zero
            }

            // Conta a quantidade de pratos para cada rating (parte inteira)
            dishes.forEach(dish => {
                const ratingInteiro = Math.floor(dish.rating);
                if (distribuicaoRatings.hasOwnProperty(ratingInteiro)) {
                    distribuicaoRatings[ratingInteiro] += 1;
                }
            });

            // Converte o objeto em um array
            const relatorio = Object.entries(distribuicaoRatings)
                .map(([rating, quantidade]) => ({
                    rating: parseInt(rating), // Converte o rating de string para número
                    quantidade
                }))
                .sort((a, b) => b.rating - a.rating); // Ordena pelo rating (decrescente)

            res.json(relatorio);
        }
    } else {
        res.status(400).json({ error: "Parâmetros inválidos." });
    }
});

// Rota para obter os pratos mais favoritados
router.get("/mais-favoritados", verificarAdmin, (req, res) => {
    const { filtro, limite } = req.query;

    try {
        // Verifica se o filtro é "pratos" e se o limite foi fornecido
        if (filtro === "pratos" && limite) {

            // Cria um mapa para contar a quantidade de favoritos por prato
            const contadorFavoritos = {};

            // Itera sobre a lista de usuários para contar os favoritos
            users.forEach(user => {
                // Garante que a propriedade favoritos seja um array
                if (!Array.isArray(user.favoritos)) {
                    user.favoritos = []; // Inicializa como array vazio se for undefined ou inválido
                }

                user.favoritos.forEach(pratoId => {
                    if (!contadorFavoritos[pratoId]) {
                        contadorFavoritos[pratoId] = 0;
                    }
                    contadorFavoritos[pratoId] += 1;
                });
            });

            // Mapeia os pratos com a quantidade de favoritos
            const pratosComFavoritos = dishes.map(dish => ({
                ...dish,
                favoritos: contadorFavoritos[dish.id] || 0
            }));

            // Ordena os pratos por favoritos (decrescente) e, em caso de empate, por nome (alfabético)
            const pratosOrdenados = pratosComFavoritos
                .sort((a, b) => {
                    if (b.favoritos !== a.favoritos) {
                        return b.favoritos - a.favoritos;
                    }
                    return a.name.localeCompare(b.name);
                })
                .slice(0, parseInt(limite));

            // Formata o relatório
            const relatorio = pratosOrdenados.map(dish => ({
                id: dish.id,
                name: dish.name,
                favoritos: dish.favoritos
            }));

            res.json(relatorio);
        } else {
            res.status(400).json({ error: "Filtro ou limite não fornecido corretamente." });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro interno ao gerar relatório." });
    }
});

// Rota para obter as estatísticas do dashboard
router.get("/estatisticas", verificarAdmin, (req, res) => {
    try {
        const totalDishes = dishes.length;

        const totalCategories = categories.length;

        const totalUsers = users.length;

        const totalNews = news.length;

        // Total de acessos/views (soma das views dos pratos e notícias)
        const totalViewsDishes = dishes.reduce((acc, dish) => acc + (dish.views || 0), 0);
        const totalViewsNews = news.reduce((acc, noticia) => acc + (noticia.views || 0), 0);
        const totalViews = totalViewsDishes + totalViewsNews;

        const totalRating = dishes.reduce((acc, dish) => acc + (dish.rating || 0), 0);
        const averageRating = totalRating / totalDishes;

        const totalFavorites = users.reduce((acc, user) => {
            // Garante que a propriedade favoritos seja um array
            if (!Array.isArray(user.favoritos)) {
                user.favoritos = []; // Inicializa como array vazio se for undefined ou inválido
            }
            return acc + user.favoritos.length;
        }, 0);

        res.json({
            totalDishes,
            totalCategories,
            totalUsers,
            totalNews,
            totalViews,
            averageRating: parseFloat(averageRating.toFixed(2)),
            totalFavorites
        });
    } catch (error) {
        res.status(500).json({ error: "Erro interno ao calcular estatísticas." });
    }
});

module.exports = router;