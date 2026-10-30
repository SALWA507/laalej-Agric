
import heroImage from '../assets/hero/laalej-hero.jpg'

function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="ey">Pièces de rechange mécaniques</div>

        <h1>
          Chaque pièce.
          <br />
          Livrée sans attendre.
        </h1>

        <p>
          Plus de 25 000 références agricoles, industrielles et automobiles,
          des plus grandes marques, expédiées partout au Maroc.
        </p>

        <div className="ln">
          <button type="button" className="btn">
            Découvrir le catalogue
          </button>

          <button type="button" className="l">
            Voir les promotions ›
          </button>
        </div>

        <div className="stage">
          <img
            src={heroImage}
            alt="Pièces mécaniques et pièces de rechange"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
