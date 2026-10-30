
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchCategories, fetchProducts } from '../services/api'

const priceFormatter = new Intl.NumberFormat('fr-MA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatPrice(value) {
  const price = Number(value)

  if (value === null || value === undefined || value === '' || Number.isNaN(price)) {
    return 'Prix non renseigné'
  }

  return `${priceFormatter.format(price)} DH`
}

function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoriesError, setCategoriesError] = useState(null)

  const search = searchParams.get('search')?.trim() ?? ''
  const selectedCategory = searchParams.get('category_id') ?? ''

  useEffect(() => {
    let active = true

    async function loadCategories() {
      try {
        const data = await fetchCategories()

        if (active) {
          setCategories(Array.isArray(data) ? data : (data.data ?? []))
        }
      } catch {
        if (active) {
          setCategoriesError('Impossible de charger les catégories.')
        }
      }
    }

    loadCategories()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    async function loadProducts() {
      setLoading(true)
      setError(null)

      const params = {}

      if (search) params.search = search
      if (selectedCategory) params.category_id = selectedCategory

      try {
        const data = await fetchProducts(params)

        if (active) {
          setProducts(data.data ?? [])
        }
      } catch {
        if (active) {
          setProducts([])
          setError(
            'Impossible de charger le catalogue. Vérifiez que l’API Laravel est accessible.',
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      active = false
    }
  }, [search, selectedCategory])

  const hasActiveFilters = search !== '' || selectedCategory !== ''

  function handleCategoryChange(event) {
    const nextParams = new URLSearchParams(searchParams)
    const categoryId = event.target.value

    if (categoryId) {
      nextParams.set('category_id', categoryId)
    } else {
      nextParams.delete('category_id')
    }

    setSearchParams(nextParams)
  }

  function handleReset() {
    setSearchParams({})
  }

  return (
    <section className="catalogue">
      <div className="wrap">
        <Link to="/" className="catalogue-back">
          ← Retour à l’accueil
        </Link>

        <div className="catalogue-head">
          <div>
            <div className="ey">Catalogue</div>
            <h1>Nos produits disponibles</h1>
            <p>
              Découvrez les produits actuellement disponibles dans notre
              catalogue.
            </p>
          </div>

          {!loading && !error && products.length > 0 && (
            <span className="catalogue-count" aria-live="polite">
              {products.length} résultat{products.length > 1 ? 's' : ''} affiché
              {products.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="catalogue-filters">
          <select
            className="catalogue-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            aria-label="Filtrer par catégorie"
          >
            <option value="">Toutes les catégories</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="catalogue-reset"
            onClick={handleReset}
            disabled={!hasActiveFilters}
          >
            Réinitialiser
          </button>

          {categoriesError && (
            <p className="catalogue-filter-error">{categoriesError}</p>
          )}
        </div>

        {loading && (
          <div className="catalogue-status" role="status">
            <p>Chargement du catalogue…</p>
          </div>
        )}

        {!loading && error && (
          <div className="catalogue-status" role="alert">
            <h2>Catalogue indisponible</h2>
            <p>{error}</p>
            <Link to="/" className="btn">
              Retour à l’accueil
            </Link>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="catalogue-status">
            <h2>
              {hasActiveFilters ? 'Aucun résultat' : 'Aucun produit disponible'}
            </h2>
            <p>
              {hasActiveFilters
                ? 'Aucun produit ne correspond à votre recherche ou à la catégorie sélectionnée.'
                : 'Le catalogue ne contient aucun produit actif pour le moment.'}
            </p>

            {hasActiveFilters ? (
              <button type="button" className="btn" onClick={handleReset}>
                Réinitialiser les filtres
              </button>
            ) : (
              <Link to="/" className="btn">
                Retour à l’accueil
              </Link>
            )}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => {
              const stock = Number(product.stock)
              const inStock = stock > 0

              return (
                <article className="product-card" key={product.id}>
                  <div className="product-card-media">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                      />
                    ) : (
                      <span className="product-card-placeholder">
                        Image non disponible
                      </span>
                    )}
                  </div>

                  <div className="product-card-body">
                    <span className="product-card-category">
                      {product.category?.name || 'Catégorie non renseignée'}
                    </span>

                    <h2 className="product-card-name">{product.name}</h2>

                    <span className="product-card-brand">
                      {product.brand || 'Marque non renseignée'}
                    </span>

                    <div className="product-card-footer">
                      <span className="product-card-price">
                        {formatPrice(product.price)}
                      </span>

                      <span
                        className={`product-card-stock${inStock ? '' : ' is-out'}`}
                      >
                        {inStock ? `Stock : ${stock}` : 'Rupture de stock'}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default Catalogue
