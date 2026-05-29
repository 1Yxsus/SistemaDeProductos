import SiteHeader from "../components/SiteHeader";
import { featureCards, productHighlights } from "../data/landingContent";

function LandingPage() {
  return (
    <div className="app-shell">
      <SiteHeader />

      <main className="page">
        <section className="landing">
          <div className="hero-grid">
            <div>
              <span className="eyebrow">Sistema para mostrar productos</span>
              <h1 className="hero-title">
                Un catálogo moderno para ver, organizar y controlar productos.
              </h1>
              <p className="hero-copy">
                ProdView es una base visual para mostrar productos de forma
                clara, rápida y ordenada. Ideal para inventarios, vitrinas
                digitales, paneles de administración o catálogos de venta.
              </p>

              <div className="hero-actions">
                <a href="/login" className="primary-button">
                  Iniciar sesión
                </a>
                <a href="#productos" className="secondary-button">
                  Ver productos
                </a>
              </div>

              <div className="stats-grid">
                <article className="stat-card">
                  <strong>+120</strong>
                  <p>productos listos para mostrar en catálogo</p>
                </article>
                <article className="stat-card">
                  <strong>24/7</strong>
                  <p>acceso a información desde cualquier dispositivo</p>
                </article>
                <article className="stat-card">
                  <strong>1 click</strong>
                  <p>para entrar al sistema desde el botón superior</p>
                </article>
              </div>
            </div>

            <aside
              className="system-panel"
              aria-label="Vista previa de productos"
            >
              <h2>Productos destacados</h2>
              <p>
                Una muestra de cómo se verán los artículos dentro del sistema.
              </p>

              <div className="product-list">
                {productHighlights.map((product) => (
                  <article className="product-item" key={product.name}>
                    <span
                      className="product-swatch"
                      style={{
                        "--swatch-start": product.swatchStart,
                        "--swatch-end": product.swatchEnd,
                      }}
                    />
                    <div>
                      <strong>{product.name}</strong>
                      <span>{product.description}</span>
                    </div>
                    <span className="product-tag">{product.tag}</span>
                  </article>
                ))}
              </div>
            </aside>
          </div>

          <section id="productos">
            <h2 className="section-title">Qué ofrece el sistema</h2>
            <div className="feature-grid">
              {featureCards.map((feature) => (
                <article className="feature-card" key={feature.title}>
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
