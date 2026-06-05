// Thin wrapper around the backend REST API.

async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* ignore non-JSON error bodies */
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // foods
  listFoods: () => request('/foods'),
  createFood: (food) => request('/foods', { method: 'POST', body: JSON.stringify(food) }),
  deleteFood: (id) => request(`/foods/${id}`, { method: 'DELETE' }),

  // entries
  listEntries: (date) => request(`/entries?date=${date}`),
  addEntry: (entry) => request('/entries', { method: 'POST', body: JSON.stringify(entry) }),
  deleteEntry: (id) => request(`/entries/${id}`, { method: 'DELETE' }),

  // summary
  getSummary: (date) => request(`/summary?date=${date}`)
};
