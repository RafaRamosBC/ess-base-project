// authContext.jsx
"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { authApi } from "../utils/authApi"

export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Carrega o usuário salvo ao iniciar a aplicação
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authApi.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Erro ao verificar usuário:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  // Sincroniza login/logout entre abas
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "user") {
        const storedUser = JSON.parse(localStorage.getItem("user"))
        setUser(storedUser)
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const login = async (credentials) => {
    try {
      const userData = await authApi.login(credentials)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
      return { success: true, user: userData }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    navigate("/login")
  }

  const isAuthenticated = () => !!user

  const isAdmin = () => user && user.role === "admin"

  const updateUser = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
