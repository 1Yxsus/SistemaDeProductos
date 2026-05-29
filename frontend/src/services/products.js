const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/api/productos`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "No se pudieron cargar los productos");
  }

  return data;
}
