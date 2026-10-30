
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { fetchCategories } from '../services/api'

function Header() {
  const searchInputRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  const params = new URLSearchParams(location.search)
  const urlSearch = location.pathname === '/catalogue'
    ? params.get('search') ?? ''
    : ''

  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await fetchCategories()
        const data = Array.isArray(result) ? result : result.data ?? []
        setCategories(data)
      } catch (error) {
        console.error('Erreur chargement catégories:', error)
      }
    }

    loadCategories()
  }, [])

  useEffect(() => {
    setSelectedCategory(
      location.pathname === '/catalogue'
        ? params.get('category_id') ?? ''
        : '',
    )
  }, [location.pathname, location.search])

  function handleSearch(event) {
    event.preventDefault()

    const query = searchInputRef.current?.value.trim() ?? ''
    const searchParams = new URLSearchParams()

    if (query) searchParams.set('search', query)
    if (selectedCategory) searchParams.set('category_id', selectedCategory)

    navigate(`/catalogue${searchParams.toString() ? `?${searchParams}` : ''}`)
  }

  function openCategory(categoryId) {
    const searchParams = new URLSearchParams()

    if (urlSearch) searchParams.set('search', urlSearch)
    if (categoryId) searchParams.set('category_id', categoryId)

    navigate(`/catalogue${searchParams.toString() ? `?${searchParams}` : ''}`)
  }

  return (
    <header>
      <div className="wrap hr">
        <Link to="/" className="logo">
          laalej<i>.</i>
          <small>AGRICOLE</small>
        </Link>

        <form className="sb" role="search" onSubmit={handleSearch}>
          <select
            aria-label="Catégorie"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            key={`${location.pathname}:${urlSearch}`}
            ref={searchInputRef}
            type="text"
            defaultValue={urlSearch}
            aria-label="Rechercher"
            placeholder="Rechercher une pièce, une marque ou une référence"
          />

          <button type="submit" aria-label="Rechercher">
            <svg className="i" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
          </button>
        </form>

        <button
          type="button"
          className="hb"
          aria-label="Compte et commandes"
          onClick={() => navigate('/login')}
        >
          <svg className="i" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
          </svg>
          <span className="hb-copy">
            Bonjour, identifiez-vous
            <b>Compte et commandes</b>
          </span>
        </button>

        <button
          type="button"
          className="hb"
          aria-label="Favoris"
          onClick={() => navigate('/favoris')}
        >
          <svg className="i" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z" />
          </svg>
          <span>Favoris</span>
          <b className="n">0</b>
        </button>

        <button
          type="button"
          className="hb"
          aria-label="Panier"
          onClick={() => navigate('/panier')}
        >
          <svg className="i" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 4h3l2.5 11h10L21 7H7" />
            <circle cx="10" cy="20" r="1.4" />
            <circle cx="17" cy="20" r="1.4" />
          </svg>
          <span>Panier</span>
          <b className="n">0</b>
        </button>
      </div>

      <div className="nw">
        <nav className="wrap nav" aria-label="Navigation principale">
          <button
            type="button"
            className="all"
            onClick={() => navigate('/catalogue')}
          >
            <svg className="i" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            Toutes les catégories
          </button>

          <button
            type="button"
            className="red"
            onClick={() => navigate('/promotions')}
          >
            Promotions
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => openCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
