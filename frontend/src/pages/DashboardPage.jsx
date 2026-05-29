import { useEffect, useMemo, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { clearAuthenticatedUser, getAuthenticatedUser } from "../services/auth";
import { fetchProducts } from "../services/products";

const PRODUCTS_PER_PAGE = 5;

function DashboardPage() {
  const [user, setUser] = useState(() => getAuthenticatedUser());
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        const result = await fetchProducts();

        if (isMounted) {
          setProducts(result.productos || []);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.nombre.toLowerCase().includes(normalizedQuery) ||
        product.codigo.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [products, query]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginationItems = useMemo(() => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, index) => ({
        type: "page",
        value: index + 1,
      }));
    }

    const items = [{ type: "page", value: 1 }];

    const middlePages = new Set([safeCurrentPage, safeCurrentPage + 1]);

    const middleList = Array.from(middlePages)
      .filter((page) => page > 1 && page < totalPages)
      .sort((a, b) => a - b);

    if (middleList.length > 0 && middleList[0] > 2) {
      items.push({ type: "ellipsis", key: "start" });
    }

    middleList.forEach((pageNumber) => {
      items.push({ type: "page", value: pageNumber });
    });

    const lastKnownPage = middleList[middleList.length - 1] || 1;

    if (totalPages - lastKnownPage > 1) {
      items.push({ type: "ellipsis", key: "end" });
    }

    if (totalPages > 1) {
      items.push({ type: "page", value: totalPages });
    }

    return items;
  }, [safeCurrentPage, totalPages]);

  function getPageLabel(pageNumber) {
    if (pageNumber === totalPages && totalPages > 1) {
      return "Última";
    }

    return `Pag. ${pageNumber}`;
  }

  const visibleProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const totalStock = useMemo(() => {
    return products.reduce(
      (accumulator, product) => accumulator + product.stock,
      0,
    );
  }, [products]);

  function handleLogout() {
    clearAuthenticatedUser();
    window.location.href = "/login";
  }

  return (
    <div className="app-shell">
      <SiteHeader authLabel="Cerrar sesión" onAuthClick={handleLogout} />

      <main className="page dashboard-page">
        <section className="dashboard-shell">
          <div className="dashboard-hero">
            <div>
              <span className="eyebrow">Panel de productos</span>
              <h1>Bienvenido, {user?.username || "administrador"}.</h1>
              <p>
                Aquí puedes revisar todos los productos de tu base de datos y
                filtrarlos por nombre o código.
              </p>
            </div>

            <div className="dashboard-stats">
              <article>
                <strong>{products.length}</strong>
                <span>Productos totales</span>
              </article>
              <article>
                <strong>{filteredProducts.length}</strong>
                <span>Coincidencias</span>
              </article>
              <article>
                <strong>{totalStock}</strong>
                <span>Unidades en stock</span>
              </article>
            </div>
          </div>

          <section className="dashboard-panel">
            <div className="dashboard-panel__header">
              <div>
                <h2>Inventario</h2>
                <p>
                  Busca por nombre o código para encontrar productos rápido.
                </p>
              </div>

              <label className="dashboard-search">
                <span>Buscar</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Nombre o código"
                />
              </label>
            </div>

            {isLoading ? (
              <div className="dashboard-state">Cargando productos...</div>
            ) : error ? (
              <div className="dashboard-state dashboard-state--error">
                {error}
              </div>
            ) : (
              <>
                <div className="dashboard-table-wrap">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleProducts.length > 0 ? (
                        visibleProducts.map((product) => (
                          <tr key={product.codigo}>
                            <td>{product.codigo}</td>
                            <td>
                              <strong>{product.nombre}</strong>
                            </td>
                            <td>${Number(product.precio).toFixed(2)}</td>
                            <td>{product.stock}</td>
                            <td>
                              <span
                                className={`status-pill ${
                                  product.stock > 0
                                    ? "status-pill--ok"
                                    : "status-pill--low"
                                }`}
                              >
                                {product.stock > 0 ? "Disponible" : "Sin stock"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="dashboard-empty">
                            No se encontraron productos con ese filtro.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredProducts.length > 0 ? (
                  <div
                    className="dashboard-pagination"
                    aria-label="Paginación de productos"
                  >
                    <button
                      type="button"
                      className="dashboard-pagination__nav"
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      disabled={safeCurrentPage === 1}
                    >
                      Anterior
                    </button>

                    <div className="dashboard-pagination__pages">
                      {paginationItems.map((item) =>
                        item.type === "ellipsis" ? (
                          <span
                            key={item.key}
                            className="dashboard-pagination__ellipsis"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={item.value}
                            type="button"
                            className={`dashboard-pagination__page ${
                              item.value === safeCurrentPage
                                ? "dashboard-pagination__page--active"
                                : ""
                            }`}
                            onClick={() => setCurrentPage(item.value)}
                          >
                            {getPageLabel(item.value)}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      type="button"
                      className="dashboard-pagination__nav"
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      disabled={safeCurrentPage === totalPages}
                    >
                      Siguiente
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
