const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "No se pudo iniciar sesión");
  }

  return data;
}

export function saveAuthenticatedUser(user) {
  sessionStorage.setItem("prodviewUser", JSON.stringify(user));
}

export function getAuthenticatedUser() {
  const storedUser = sessionStorage.getItem("prodviewUser");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

export function clearAuthenticatedUser() {
  sessionStorage.removeItem("prodviewUser");
}
