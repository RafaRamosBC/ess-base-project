"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/authContext"
import "../styles/LoginPage.css"

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    login: "",
    senha: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(credentials)

      if (result.success) {
        navigate("/")
      } else {
        setError(result.error || "Credenciais inválidas. Por favor, tente novamente.")
      }
    } catch (error) {
      setError("Ocorreu um erro durante o login. Por favor, tente novamente.")
      console.error("Erro no login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>iLoveRU</h1>
          <p>Sistema de Avaliação de Pratos do Restaurante Universitário</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="login">Usuário</label>
            <input
              type="text"
              id="login"
              name="login"
              value={credentials.login}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input type="password" id="senha" name="senha" value={credentials.senha} onChange={handleChange} required />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2023 iLoveRU. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

