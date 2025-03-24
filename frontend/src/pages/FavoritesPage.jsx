// FavoritesPage.jsx
"use client"

import { useState, useEffect, useContext } from "react"
import { useAuth } from "../contexts/authContext"
import { AlertContext } from "../App"
import DishCard from "../components/DishCard"
import { dishesApi } from "../utils/api"
import { favoritesAdapter } from "../utils/authApi"
import "../styles/FavoritesPage.css"

const FavoritesPage = () => {
  const [favoriteDishes, setFavoriteDishes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, updateUser } = useAuth()
  const { showAlert } = useContext(AlertContext)

  // Carrega os favoritos na montagem do componente
  useEffect(() => {
    if (user) {
      loadFavorites()
    }
  }, [user, user?.favoritos])

  // Função para carregar os favoritos via API
  const loadFavorites = async () => {
    setIsLoading(true)
    try {
      const allDishes = await dishesApi.getAll()
      const userFavorites = user.favoritos || []
      const favorites = allDishes.filter((dish) => userFavorites.includes(dish.id))
      setFavoriteDishes(favorites)
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error)
      showAlert("error", "Erro ao carregar favoritos. Por favor, tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  // Função para alternar o status de favorito
  const handleFavoriteToggle = async (dishId, isFavorite) => {
    try {
      if (isFavorite) {
        await favoritesAdapter.addToFavorites(user.id, dishId)
      } else {
        await favoritesAdapter.removeFromFavorites(user.id, dishId)
        setFavoriteDishes((prevDishes) => prevDishes.filter((dish) => dish.id !== dishId))
      }
      const updatedUser = JSON.parse(localStorage.getItem("user"))
      if (updatedUser) {
        const newUser = { ...user, favoritos: updatedUser.favoritos }
        updateUser(newUser)
      }
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error)
      showAlert("error", "Erro ao atualizar favoritos. Por favor, tente novamente mais tarde.")
    }
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>Meus Favoritos</h1>
        <p>Aqui estão os pratos que você marcou como favoritos</p>
      </div>

      {isLoading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Carregando favoritos...</span>
        </div>
      ) : (
        <div className="favorites-container">
          {favoriteDishes.length > 0 ? (
            <div className="favorites-grid">
              {favoriteDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} onFavoriteToggle={handleFavoriteToggle} isFavorite={true} />
              ))}
            </div>
          ) : (
            <div className="empty-favorites">
              <div className="empty-favorites-content">
                <i className="far fa-heart empty-icon"></i>
                <h2>Nenhum favorito ainda</h2>
                <p>Você ainda não adicionou nenhum prato aos seus favoritos.</p>
                <p>Explore o feed e clique no ícone de coração para adicionar pratos aos seus favoritos.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage
