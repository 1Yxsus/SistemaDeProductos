import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { loginUser, saveAuthenticatedUser } from "../services/auth";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "idle", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage({ type: "idle", text: "" });

    try {
      const result = await loginUser(username, password);
      saveAuthenticatedUser(result.usuario);
      window.location.href = "/dashboard";
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app-shell">
      <SiteHeader />

      <main className="page">
        <section className="login-page login-layout">
          <article className="login-card">
            <aside className="login-card__aside">
              <span className="login-card__badge">Acceso seguro</span>
              <div>
                <h1>Inicia sesión para administrar productos.</h1>
                <p className="login-copy">
                  Panel preparado para controlar catálogo, stock y acceso de
                  usuarios desde un solo lugar.
                </p>
              </div>

              <ul className="login-points" aria-label="Beneficios del sistema">
                <li>Control centralizado de productos</li>
                <li>Vista rápida de inventario</li>
                <li>Base lista para conectar Flask</li>
              </ul>

              <div className="login-mini-stats">
                <div>
                  <strong>24/7</strong>
                  <span>acceso al sistema</span>
                </div>
                <div>
                  <strong>1 paso</strong>
                  <span>para ingresar</span>
                </div>
              </div>
            </aside>

            <section className="login-card__panel">
              <div className="login-card__header">
                <h2>Usa tu cuenta para continuar.</h2>
                <p>
                  Ingresa tus credenciales para entrar al panel de productos.
                </p>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                <label>
                  Usuario
                  <input
                    type="text"
                    name="username"
                    placeholder="Tu usuario"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </label>

                <label>
                  Contraseña
                  <input
                    type="password"
                    name="password"
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </label>

                <button
                  type="submit"
                  className="login-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Ingresando..." : "Entrar"}
                </button>
              </form>

              {message.type !== "idle" ? (
                <p className={`login-message login-message--${message.type}`}>
                  {message.text}
                </p>
              ) : null}

              <div className="login-card__footer">
                <a href="/">Volver al inicio</a>
                <span>Panel listo para integrar autenticación real</span>
              </div>
            </section>
          </article>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;
