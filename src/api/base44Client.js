const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('auth_token');
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function createEntityClient(entityName) {
  return {
    async list(orderBy) {
      const params = orderBy ? `?order_by=${orderBy}` : '';
      const res = await fetch(`${API_BASE}/entities/${entityName}${params}`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`Failed to list ${entityName}`);
      return res.json();
    },

    async get(id) {
      const res = await fetch(`${API_BASE}/entities/${entityName}/${id}`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`Failed to get ${entityName}`);
      return res.json();
    },

    async create(data) {
      const res = await fetch(`${API_BASE}/entities/${entityName}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to create ${entityName}`);
      return res.json();
    },

    async update(id, data) {
      const res = await fetch(`${API_BASE}/entities/${entityName}/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to update ${entityName}`);
      return res.json();
    },

    async delete(id) {
      const res = await fetch(`${API_BASE}/entities/${entityName}/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`Failed to delete ${entityName}`);
      return res.json();
    },
  };
}

export const base44 = {
  entities: new Proxy({}, {
    get(_, entityName) {
      return createEntityClient(entityName);
    },
  }),

  auth: {
    logout(redirectTo = '/login') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = redirectTo;
    },
  },
};
