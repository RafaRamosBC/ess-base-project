// FeedPage.jsx
"use client"

import { useState, useEffect, useContext } from "react"
import { useLocation } from "react-router-dom"
import { useAuth } from "../contexts/authContext"
import { AlertContext } from "../App"
import Button from "../components/Button"
import Carousel from "../components/Carousel"
import FeaturedCarousel from "../components/FeaturedCarousel"
import DishCard from "../components/DishCard"
import { dishesApi, trendingApi } from "../utils/api"
import { favoritesAdapter } from "../utils/authApi"
import "../styles/FeedPage.css"

const FeedPage = () => {
  const [dishes, setDishes] = useState([])
  const [trendingItems, setTrendingItems] = useState([])
  const [mostViewedDishes, setMostViewedDishes] = useState([])
  const [bestRatedDishes, setBestRatedDishes] = useState([])
  const [activeSection, setActiveSection] = useState("trending")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [searchParams, setSearchParams] = useState(null)

  const location = useLocation()
  const { user, updateUser } = useAuth()
  const { showAlert } = useContext(AlertContext)

  // Verifica se há resultados de busca no estado da location
  useEffect(() => {
    if (location.state) {
      if (location.state.searchResults) {
        setSearchResults(location.state.searchResults)
        setSearchParams(location.state.searchParams)
      } else if (location.state.searchError) {
        setSearchResults([])
        setError(location.state.searchError)
        setSearchParams(location.state.searchParams)
      }
      // Limpa o estado da location para evitar resultados repetidos após refresh
      window.history.replaceState({}, document.title)
    }
  }, [location])

  // Busca os pratos na montagem do componente
  useEffect(() => {
    fetchDishes()
  }, [])

  // Função para buscar pratos e outros dados via API
  const fetchDishes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const dishesData = await dishesApi.getAll()
      if (Array.isArray(dishesData)) {
        setDishes(dishesData)
      } else {
        console.error("Dados de pratos não são um array:", dishesData)
        setDishes([])
      }

      try {
        const mostViewedData = await dishesApi.getMostViewed()
        if (Array.isArray(mostViewedData)) {
          setMostViewedDishes(mostViewedData)
        } else {
          console.error("Dados dos pratos mais vistos não são um array:", mostViewedData)
          setMostViewedDishes([])
        }
      } catch (mostViewedError) {
        console.error("Erro ao buscar pratos mais vistos:", mostViewedError)
        setMostViewedDishes([])
      }

      try {
        const bestRatedData = await dishesApi.getBestRated()
        if (Array.isArray(bestRatedData)) {
          setBestRatedDishes(bestRatedData)
        } else {
          console.error("Dados dos pratos melhor avaliados não são um array:", bestRatedData)
          setBestRatedDishes([])
        }
      } catch (bestRatedError) {
        console.error("Erro ao buscar pratos melhor avaliados:", bestRatedError)
        setBestRatedDishes([])
      }

      try {
        const trendingData = await trendingApi.getTrending()
        if (Array.isArray(trendingData)) {
          setTrendingItems(trendingData)
        } else {
          console.error("Dados dos itens em alta não são um array:", trendingData)
          setTrendingItems([])
        }
      } catch (trendingError) {
        console.error("Erro ao buscar itens em alta:", trendingError)
        setTrendingItems([])
      }
    } catch (error) {
      console.error("Erro ao buscar pratos:", error)
      setError("Erro ao carregar os pratos. Por favor, tente novamente mais tarde.")
      setDishes([])
      setTrendingItems([])
      setMostViewedDishes([])
      setBestRatedDishes([])
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
      }
      // Atualiza o estado do usuário a partir do localStorage (que já foi atualizado pela API)
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

  // Verifica se um prato está na lista de itens em alta
  const isDishTrending = (dishId) => {
    return trendingItems.some(
      (item) =>
        item.id === dishId &&
        (item.type === "dish" || (!item.type && item.rating !== undefined))
    )
  }

  // Formata os parâmetros de busca para exibição
  const formatSearchParams = (params) => {
    if (!params) return ""
    const parts = []
    if (params.name) parts.push(`"${params.name}"`)
    if (params.category) parts.push(`Categoria: ${params.category}`)
    if (params.minNota) parts.push(`Nota mínima: ${params.minNota}`)
    if (params.maxNota) parts.push(`Nota máxima: ${params.maxNota}`)
    if (params.minViews) parts.push(`Views mínimas: ${params.minViews}`)
    if (params.maxViews) parts.push(`Views máximas: ${params.maxViews}`)
    return parts.join(", ")
  }

  // Limpa os resultados de busca
  const clearSearchResults = () => {
    setSearchResults(null)
    setSearchParams(null)
    setError(null)
  }

  // Renderiza o carrossel com base na seção ativa
  const renderCarousel = () => {
    if (activeSection === "trending") {
      return (
        <FeaturedCarousel
          items={trendingItems}
          title="Em Alta"
          description="Os itens que estão fazendo sucesso agora"
          onFavoriteToggle={handleFavoriteToggle}
          favorites={user?.favoritos || []}
        />
      )
    } else if (activeSection === "most-viewed") {
      return (
        <Carousel
          items={mostViewedDishes}
          title="Pratos Mais Vistos"
          description="Os pratos mais populares do Restaurante Universitário"
          onFavoriteToggle={handleFavoriteToggle}
          favorites={user?.favoritos || []}
          itemType="dish"
          trendingItems={trendingItems}
        />
      )
    } else if (activeSection === "best-rated") {
      return (
        <Carousel
          items={bestRatedDishes}
          title="Melhores Avaliados"
          description="Os pratos com as melhores avaliações dos usuários"
          onFavoriteToggle={handleFavoriteToggle}
          favorites={user?.favoritos || []}
          itemType="dish"
          trendingItems={trendingItems}
        />
      )
    }
    return (
      <FeaturedCarousel
        items={trendingItems}
        title="Em Alta"
        description="Os itens que estão fazendo sucesso agora"
        onFavoriteToggle={handleFavoriteToggle}
        favorites={user?.favoritos || []}
      />
    )
  }

  return (
    <div className="feed-page">
      {(searchResults || error) && searchParams && (
        <div className={`search-results-banner ${error ? "error" : ""}`}>
          <div className="search-results-content">
            {error ? (
              <h2>
                <i className="fas fa-exclamation-circle"></i> {error}
              </h2>
            ) : (
              <h2>
                <i className="fas fa-search"></i> Resultados da busca: {searchResults.length} prato(s) encontrado(s)
              </h2>
            )}
            <p>Parâmetros: {formatSearchParams(searchParams)}</p>
            <button onClick={clearSearchResults} className="clear-search-button">
              <i className="fas fa-times"></i> Limpar busca
            </button>
          </div>
        </div>
      )}

      {!searchResults && (
        <section className="hero-section">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">O que você procura?</h1>
              <div className="hero-buttons">
                <Button
                  text="Mais Vistos"
                  type={activeSection === "most-viewed" ? "primary" : "secondary"}
                  isActive={activeSection === "most-viewed"}
                  onClick={() => setActiveSection("most-viewed")}
                />
                <Button
                  text="Em Alta"
                  type={activeSection === "trending" ? "primary" : "secondary"}
                  isActive={activeSection === "trending"}
                  onClick={() => setActiveSection("trending")}
                />
                <Button
                  text="Melhores Avaliados"
                  type={activeSection === "best-rated" ? "primary" : "secondary"}
                  isActive={activeSection === "best-rated"}
                  onClick={() => setActiveSection("best-rated")}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {!searchResults && (
        <section className="carousel-section-container">
          {isLoading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Carregando...</span>
            </div>
          ) : error && !searchParams ? (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          ) : (
            renderCarousel()
          )}
        </section>
      )}

      <section className="dishes-grid-section">
        <div className="section-header">
          {searchResults ? (
            <h2>Resultados da Busca</h2>
          ) : (
            <>
              <h2>Todos os Pratos</h2>
              <p>Explore todos os pratos disponíveis no Restaurante Universitário</p>
            </>
          )}
        </div>

        {isLoading && !searchResults ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Carregando...</span>
          </div>
        ) : error && !searchParams ? (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        ) : (
          <div className="dishes-grid">
            {searchResults ? (
              searchResults.length > 0 ? (
                searchResults.map((dish, index) => (
                  <DishCard
                    key={`${dish.id}-${index}`}
                    dish={dish}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorite={user?.favoritos?.includes(dish.id) || false}
                    isTrending={isDishTrending(dish.id)}
                  />
                ))
              ) : (
                <div className="empty-grid">
                  <p>Nenhum prato encontrado com esses filtros</p>
                </div>
              )
            ) : dishes && dishes.length > 0 ? (
              dishes.map((dish, index) => (
                <DishCard
                  key={`${dish.id}-${index}`}
                  dish={dish}
                  onFavoriteToggle={handleFavoriteToggle}
                  isFavorite={user?.favoritos?.includes(dish.id) || false}
                  isTrending={isDishTrending(dish.id)}
                />
              ))
            ) : (
              <div className="empty-grid">
                <p>Nenhum prato disponível</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default FeedPage
