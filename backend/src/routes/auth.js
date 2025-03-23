const express = require("express")
const router = express.Router()
const { users } = require("../database/users_list.js")

// Rota de login
router.post("/login", (req, res) => {
  const { login, senha } = req.body

  // Validação básica
  if (!login || !senha) {
    return res.status(400).send({ error: "Login e senha são obrigatórios" })
  }

  // Busca o usuário pelo login
  const user = users.find((u) => u.login === login)

  // Verifica se o usuário existe e se a senha está correta
  if (!user || user.senha !== senha) {
    return res.status(401).send({ error: "Credenciais inválidas" })
  }

  // Cria um objeto de usuário para retornar (sem a senha)
  const userResponse = {
    id: user.id,
    nome: user.nome,
    login: user.login,
    role: user.role || "user", // Valor padrão caso não exista
    favoritos: user.favoritos || [],
  }

  // Retorna os dados do usuário
  res.status(200).send(userResponse)
})

// Rota para obter o usuário atual
router.post("/me", (req, res) => {
  const { userId } = req.body

  if (!userId) {
    return res.status(400).send({ error: "ID do usuário é obrigatório" })
  }

  const user = users.find((u) => u.id === Number.parseInt(userId))

  if (!user) {
    return res.status(404).send({ error: "Usuário não encontrado" })
  }

  // Cria um objeto de usuário para retornar (sem a senha)
  const userResponse = {
    id: user.id,
    nome: user.nome,
    login: user.login,
    role: user.role || "user", // Valor padrão caso não exista
    favoritos: user.favoritos || [],
  }

  res.status(200).send(userResponse)
})

module.exports = router

