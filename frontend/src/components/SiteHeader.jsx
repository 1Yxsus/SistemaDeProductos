function SiteHeader({
  authLabel = "Iniciar sesión",
  authHref = "/login",
  onAuthClick,
}) {
  return (
    <header className="site-header">
      <a href="/" className="brand" aria-label="Ir al inicio">
        <span className="brand-mark">P</span>
        <span className="brand-text">
          <strong>ProdView</strong>
          <span>Catálogo inteligente</span>
        </span>
      </a>

      {onAuthClick ? (
        <button type="button" className="login-button" onClick={onAuthClick}>
          {authLabel}
        </button>
      ) : (
        <a href={authHref} className="login-button">
          {authLabel}
        </a>
      )}
    </header>
  );
}

export default SiteHeader;
