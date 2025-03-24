"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/authContext"
import { PLACEHOLDER_IMAGE } from "../utils/api"
import "../styles/DishCard.css"

/**
 * DishCard component for iLoveRU application
 * Displays a dish with image, name, description, rating, and favorite button
 *
 * @param {Object} props - Component props
 * @param {Object} props.dish - Dish data
 * @param {function} props.onFavoriteToggle - Function to toggle favorite status
 * @param {boolean} props.isFavorite - Whether the dish is favorited
 * @param {boolean} props.isTrending - Whether the dish is trending (in /trending/em-alta)
 */
const DishCard = ({ dish, onFavoriteToggle, isFavorite = false, isTrending = false }) => {
  const [favorite, setFavorite] = useState(isFavorite)
  const [imageError, setImageError] = useState(false)
  const { user } = useAuth()

  // Update favorite state when user or isFavorite changes
  useEffect(() => {
    if (user && user.favoritos) {
      setFavorite(user.favoritos.includes(dish.id))
    } else {
      setFavorite(isFavorite)
    }
  }, [user, dish.id, isFavorite, user?.favoritos])

  // Handle favorite toggle
  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    const newFavoriteStatus = !favorite
    setFavorite(newFavoriteStatus)

    if (onFavoriteToggle) {
      onFavoriteToggle(dish.id, newFavoriteStatus)
    }
  }

  // Handle image error
  const handleImageError = () => {
    setImageError(true)
  }

  // Generate star rating display
  const renderRating = (rating) => {
    if (rating === undefined || rating === null) return []

    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>)
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>)
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>)
    }

    return stars
  }

  return (
    <div className="dish-card">
      {/* Dish Image */}
      <div className="dish-image">
        <img
          src={imageError ? PLACEHOLDER_IMAGE : dish.img || PLACEHOLDER_IMAGE}
          alt={dish.name}
          onError={handleImageError}
        />

        {/* Favorite Button */}
        <button
          className={`favorite-button ${favorite ? "favorited" : ""}`}
          onClick={handleFavoriteClick}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <i className={favorite ? "fas fa-heart" : "far fa-heart"}></i>
        </button>

        {/* Trending Badge - Only show if dish is in trending list */}
        {isTrending && (
          <div className="trending-badge">
            <i className="fas fa-fire"></i> Em Alta
          </div>
        )}
      </div>

      {/* Dish Content */}
      <div className="dish-content">
        <h3 className="dish-name">{dish.name}</h3>

        <div className="dish-rating">
          <div className="stars">{renderRating(dish.rating)}</div>
          <span className="rating-value">
            {dish.rating !== undefined && dish.rating !== null ? dish.rating.toFixed(1) : "N/A"}
          </span>
        </div>

        <p className="dish-description">{dish.description}</p>

        <div className="dish-meta">
          <span className="dish-views">
            <i className="fas fa-eye"></i> {dish.views || 0} visualizações
          </span>

          {dish.category && (
            <span className="dish-category">
              <i className="fas fa-tag"></i> {dish.category}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default DishCard

