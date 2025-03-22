const { users } = require("../database/users_list.js")

// Middleware para verificar se o usuário é admin
const isAdmin = (req, res, next) => {
  const { userId } = req.body

  if (!userId) {
    return res.status(400).send({ error: "Usuário não identificado" })
  }

  const user = users.find((u) => u.id === Number.parseInt(userId))

  if (!user) {
    return res.status(404).send({ error: "Usuário não encontrado" })
  }

  // Verifica se o usuário é admin
  if (user.role !== "admin") {
    return res.status(403).send({ error: "Acesso negado: permissão de administrador necessária" })
  }

  // Adiciona o usuário ao objeto de requisição para uso posterior
  req.user = user
  next()
}

module.exports = {
  isAdmin,
}

