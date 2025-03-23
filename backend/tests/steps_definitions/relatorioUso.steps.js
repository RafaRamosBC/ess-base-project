// npx cucumber-js --require tests/steps_definitions tests/features/favoritos.feature

const { Given, When, Then } = require('@cucumber/cucumber');
const chai = require('chai');
const request = require('supertest');
const app = require('../../src/app.js');

const expect = chai.expect;

let userId;

const { users } = require('../../src/database/users_list.js');
const { categories } = require('../../src/database/categorias_aux.js');
const { dishes } = require('../../src/database/pratos_aux.js');

// Passos de Given (Pré-condições)
Given('o administrador {string} está autenticado no sistema', function (userName) {
    const user = users.find(u => u.nome === userName);
    if (user) {
        userId = user.id;
    } else {
        throw new Error(`Adminstrador com o nome "${userName}" não encontrado.`);
    }
});

Given('o usuário comum {string} está autenticado no sistema', function (userName) {    
    const user = users.find(u => u.nome === userName);
    if (user) {
        userId = user.id;
    } else {
        throw new Error(`Usuário comum com o nome "${userName}" não encontrado.`);
    }
});

Given('existem as seguintes categorias:', function (dataTable) {
    dataTable.hashes().forEach(row => {
        const categoriaNome = row.Categoria;

        const categoria = categories.find(c => c.name === categoriaNome);
        if (!categoria) {
            throw new Error(`Categoria "${categoriaNome}" não encontrada.`);
        }
    });
});

Given('existem os seguintes pratos:', function (dataTable) {
    const pratosListados = dataTable.hashes().map(row => row.Pratos); // Extrai os nomes dos pratos da tabela

    pratosListados.forEach(pratoNome => {
        const pratoExistente = dishes.find(dish => dish.name === pratoNome);
        if (!pratoExistente) {
            throw new Error(`Prato "${pratoNome}" não encontrado no banco de dados.`);
        }
    });
});

// Given('não existem registros de acessos nas categorias para o período solicitado', async function () {
//     // Limpa os acessos dos pratos no banco de dados
//     dishes.forEach(dish => {
//         dish.views = 0; // Define os acessos como 0
//     });
// });

// Passos de When (Ações)
When('o administrador faz uma requisição {string} para {string} com os seguintes parâmetros:', async function (method, endpoint, dataTable) {
    const params = dataTable.hashes()[0];

    response = await request(app)
        [method.toLowerCase()](endpoint) // Faz a requisição GET para a rota
        .query(params) // Passa os parâmetros corretos
        .set('Accept', 'application/json')
        .set('user-id', userId);
});

When('o administrador faz uma requisição {string} para {string}', async function (method, endpoint) {
    response = await request(app)
        [method.toLowerCase()](endpoint)
        .set('Accept', 'application/json')
        .set('user-id', userId);
});

When('o usuário tenta acessar a rota {string}', async function (rota) {
    response = await request(app)
        .get(rota)
        .set('user-id', userId);
});

// Passos de Then (Verificações)
Then('o status da resposta deve ser {string}', function (expectedStatus) {
    const statusCode = parseInt(expectedStatus);
    expect(response.status).to.equal(statusCode);
});

Then('o JSON da resposta deve conter:', function (expectedJson) {
    // Converte o JSON esperado de string para objeto
    const expected = JSON.parse(expectedJson);

    // Converte o JSON recebido para string e depois de volta para objeto
    const received = JSON.parse(JSON.stringify(response.body));

    // Compara os objetos normalizados
    expect(received).to.deep.equal(expected);
});

// Then('o relatório gerado deve refletir os dados do período {string} solicitado', function (periodo) {
//     // Verifica se o período no relatório corresponde ao período solicitado
//     expect(response.body.periodo).to.equal(periodo);
// });