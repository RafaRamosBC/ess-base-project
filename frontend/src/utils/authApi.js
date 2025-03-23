import { API_BASE_URL } from "./api"

// Auth API
export const authApi = {
  // Login
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Falha na autenticação")
      }

      return data
    } catch (error) {
      console.error("Error during login:", error)
      // Dados mockados para quando o backend não estiver disponível
      if (credentials.login === "admin" && credentials.senha === "admin123") {
        return {
          id: 8,
          nome: "Fernanda Rocha",
          login: "admin",
          role: "admin",
          favoritos: [],
        }
      } else if (credentials.login === "user" && credentials.senha === "user123") {
        return {
          id: 1,
          nome: "João Silva",
          login: "user",
          role: "user",
          favoritos: [],
        }
      }
      throw error
    }
  },

  // Verificar usuário atual
  getCurrentUser: async () => {
    try {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        return null
      }

      const user = JSON.parse(storedUser)

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao obter usuário atual")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching current user:", error)
      // Retornar dados do localStorage em caso de erro
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        return JSON.parse(storedUser)
      }
      return null
    }
  },
}

// Adaptação da API de favoritos para trabalhar com o backend atual
export const favoritesAdapter = {
  // Adicionar prato aos favoritos
  addToFavorites: async (userId, dishId) => {
    try {
      // Primeiro, vamos obter os favoritos atuais do usuário
      const user = JSON.parse(localStorage.getItem("user"))

      // Usar a API de favoritos do backend
      const response = await fetch(`${API_BASE_URL}/favorites/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, dishId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao adicionar aos favoritos")
      }

      const result = await response.json()

      // Atualizar o usuário no localStorage
      if (user) {
        user.favoritos = result.favorites || []
        if (!user.favoritos.includes(dishId)) {
          user.favoritos.push(dishId)
        }
        localStorage.setItem("user", JSON.stringify(user))
      }

      return result
    } catch (error) {
      console.error("Error adding to favorites:", error)

      // Simulação para quando o backend não está disponível
      const user = JSON.parse(localStorage.getItem("user"))
      if (user) {
        if (!user.favoritos) {
          user.favoritos = []
        }

        if (!user.favoritos.includes(dishId)) {
          user.favoritos.push(dishId)
          localStorage.setItem("user", JSON.stringify(user))
        }

        return { success: true, message: "Prato adicionado aos favoritos (mock)", favorites: user.favoritos }
      }

      throw error
    }
  },

  // Remover prato dos favoritos
  removeFromFavorites: async (userId, dishId) => {
    try {
      // Primeiro, vamos obter os favoritos atuais do usuário
      const user = JSON.parse(localStorage.getItem("user"))

      // Usar a API de favoritos do backend
      const response = await fetch(`${API_BASE_URL}/favorites/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, dishId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao remover dos favoritos")
      }

      const result = await response.json()

      // Atualizar o usuário no localStorage
      if (user) {
        user.favoritos = result.favorites || []
        if (!result.favorites) {
          user.favoritos = user.favoritos.filter((id) => id !== dishId)
        }
        localStorage.setItem("user", JSON.stringify(user))
      }

      return result
    } catch (error) {
      console.error("Error removing from favorites:", error)

      // Simulação para quando o backend não está disponível
      const user = JSON.parse(localStorage.getItem("user"))
      if (user && user.favoritos) {
        user.favoritos = user.favoritos.filter((id) => id !== dishId)
        localStorage.setItem("user", JSON.stringify(user))

        return { success: true, message: "Prato removido dos favoritos (mock)", favorites: user.favoritos }
      }

      throw error
    }
  },
}

