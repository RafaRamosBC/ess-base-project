// SearchBar.jsx
"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { searchApi, categoriesApi } from "../utils/api"
import "../styles/SearchBar.css"

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    category: "",
    minNota: "",
    maxNota: "",
    minViews: "",
    maxViews: "",
  })
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null)

  const searchBarRef = useRef(null)
  const filtersRef = useRef(null)
  const historyRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchSearchHistory()
    fetchCategories()

    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowHistory(false)
        setShowFilters(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (selectedHistoryItem) {
      setSearchTerm(selectedHistoryItem.termo || "")
      if (selectedHistoryItem.filtros) {
        setFilters((prev) => ({
          ...prev,
          ...selectedHistoryItem.filtros,
        }))
      }
      setShowHistory(false)
      setSelectedHistoryItem(null)
    }
  }, [selectedHistoryItem])

  const fetchSearchHistory = async () => {
    try {
      const history = await searchApi.getHistory()
      setSearchHistory(Array.isArray(history) ? history : [])
    } catch (error) {
      console.error("Erro ao buscar histórico de buscas:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const categoriesData = await categoriesApi.getAll()
      setCategories(categoriesData)
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchTerm.trim() && !Object.values(filters).some((v) => v)) return

    try {
      const searchParams = {
        name: searchTerm.trim(),
      }

      if (filters.category) {
        const selectedCategory = categories.find((cat) => cat.id.toString() === filters.category)
        if (selectedCategory) {
          searchParams.category = selectedCategory.name
        }
      }

      if (filters.minNota) searchParams.minNota = filters.minNota
      if (filters.maxNota) searchParams.maxNota = filters.maxNota
      if (filters.minViews) searchParams.minViews = filters.minViews
      if (filters.maxViews) searchParams.maxViews = filters.maxViews

      const searchResults = await searchApi.search(searchParams)

      // Aguarda um tempo para o backend salvar no histórico (caso ele salve automaticamente)
      await new Promise((resolve) => setTimeout(resolve, 200))

      // Atualiza o histórico antes de navegar
      await fetchSearchHistory()

      // Navega com resultados
      navigate("/", {
        state: {
          searchResults,
          searchParams,
        },
      })

      setSearchTerm("")
      setShowHistory(true)
      setShowFilters(false)
    } catch (error) {
      console.error("Erro ao realizar busca:", error)
      navigate("/", {
        state: {
          searchError: error.message || "Nenhum prato encontrado com esses filtros",
          searchParams: { name: searchTerm, ...filters },
        },
      })
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const deleteHistoryItem = async (index, e) => {
    e.stopPropagation()
    try {
      await searchApi.deleteFromHistory(index)
      fetchSearchHistory()
    } catch (error) {
      console.error("Erro ao deletar item do histórico:", error)
    }
  }

  const clearAllHistory = async () => {
    try {
      await searchApi.clearHistory()
      setSearchHistory([])
    } catch (error) {
      console.error("Erro ao limpar histórico:", error)
    }
  }

  const handleHistoryItemClick = (item) => {
    setSelectedHistoryItem(item)
  }

  return (
    <div className="search-bar" ref={searchBarRef}>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowHistory(true)}
            placeholder="Buscar pratos..."
            className="search-input"
          />

          <button type="button" className="filter-button" onClick={() => setShowFilters(!showFilters)}>
            <i className="fas fa-cog"></i>
          </button>

          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>

        {showFilters && (
          <div className="filters-dropdown" ref={filtersRef}>
            {/* ... filtros omitidos para foco no core ... */}
          </div>
        )}

        {showHistory && searchHistory.length > 0 && (
          <div className="history-dropdown" ref={historyRef}>
            <div className="history-header">
              <h3>Histórico de Buscas</h3>
              <button type="button" onClick={clearAllHistory} className="clear-history-button">
                Limpar Tudo
              </button>
            </div>

            <ul className="history-list">
              {searchHistory.map((item, index) => (
                <li key={index} onClick={() => handleHistoryItemClick(item)}>
                  <span className="history-item-text">
                    {item.termo || "Busca sem termo"}
                    {item.filtros && Object.values(item.filtros).some((v) => v) && (
                      <span className="history-item-filters">(com filtros)</span>
                    )}
                  </span>
                  <button type="button" onClick={(e) => deleteHistoryItem(index, e)} className="delete-history-item">
                    <i className="fas fa-times"></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchBar
