"use client"

import { useState, useEffect, createContext } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import Header from "./components/Header"
import Alert from "./components/Alert"
import FeedPage from "./pages/FeedPage"
import NewsPage from "./pages/NewsPage"
import FavoritesPage from "./pages/FavoritesPage"
import AdminPage from "./pages/AdminPage"
import LoginPage from "./pages/LoginPage"
import { AuthProvider, useAuth } from "./contexts/authContext"
import { checkBackendAvailability } from "./utils/api"
import "./styles/global.css"

export const AlertContext = createContext()

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-app">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Verificando autenticação...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" />
  }

  return children
}

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-app">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Verificando permissões...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" />
  }

  if (!isAdmin()) {
    return <Navigate to="/" />
  }

  return children
}

const AppContent = () => {
  const [backendAvailable, setBackendAvailable] = useState(true)
  const [isChecking, setIsChecking] = useState(true)
  const [alert, setAlert] = useState({ type: "", message: "" })
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const isLoginPage = location.pathname === "/login"

  useEffect(() => {
    const checkBackend = async () => {
      setIsChecking(true)
      const isAvailable = await checkBackendAvailability()
      setBackendAvailable(isAvailable)
      setIsChecking(false)

      if (!isAvailable) {
        console.warn("Backend não está disponível. Usando dados mockados.")
      }
    }

    checkBackend()
  }, [])

  const showAlert = (type, message) => {
    setAlert({ type, message })
  }

  const clearAlert = () => {
    setAlert({ type: "", message: "" })
  }

  if (isChecking) {
    return (
      <div className="loading-app">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Carregando aplicação...</span>
        </div>
      </div>
    )
  }

  return (
    <AlertContext.Provider value={{ showAlert, clearAlert }}>
      <div className="app">
        {!backendAvailable && (
          <div className="backend-warning">
            <i className="fas fa-exclamation-triangle"></i>
            Backend não disponível. Usando dados mockados.
          </div>
        )}

        {/* ✅ Header agora sempre renderiza, exceto na página de login */}
        {!isLoginPage && <Header />}

        {alert.message && <Alert type={alert.type} message={alert.message} onClose={clearAlert} />}

        <main className="main-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <FeedPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/news"
              element={
                <ProtectedRoute>
                  <NewsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AlertContext.Provider>
  )
}

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
