const categories = [
  'Pièces agricoles',
  'Machinisme agricole',
  'Irrigation & pompage',
  'Pièces industrielles',
  'Droguerie pro',
  'Pièces auto',
]

function Header() {
  return (
    <header>
      <div className="wrap hr">
        <div className="logo">
          laalej<i>.</i>
          <small>AGRICOLE</small>
        </div>

        <div className="sb">
          <select aria-label="Catégorie">
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="text"
            aria-label="Rechercher"
            placeholder="Rechercher une pièce, une marque ou une référence"
          />
          <button type="button" aria-label="Rechercher">
            <svg className="i" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
          </button>
        </div>

        <button type="button" className="hb" aria-label="Compte et commandes">
          <svg className="i" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
          </svg>
          <span className="hb-copy">
            Bonjour, identifiez-vous
            <b>Compte et commandes</b>
          </span>
        </button>

        <button type="button" className="hb" aria-label="Favoris">
          <svg className="i" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z" />
          </svg>
          <span>Favoris</span>
          <b className="n">0</b>
        </button>

        <button type="button" className="hb" aria-label="Panier">
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
          <button type="button" className="all">
            <svg className="i" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            Toutes les catégories
          </button>
          <button type="button" className="red">
            Promotions
          </button>
          {categories.map((category) => (
            <button type="button" key={category}>
              {category}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
