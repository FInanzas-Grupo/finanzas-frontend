import { http } from "./http.js";

export const authApi = {
  login: (payload) => http.post("/auth/login", payload),
  register: (payload) => http.post("/auth/register", payload),
  me: () => http.get("/auth/me")
};

export const clientesApi = {
  list: () => http.get("/clientes"),
  create: (payload) => http.post("/clientes", payload),
  update: (id, payload) => http.put(`/clientes/${id}`, payload),
  remove: (id) => http.delete(`/clientes/${id}`)
};

export const vehiculosApi = {
  list: () => http.get("/vehiculos"),
  create: (payload) => http.post("/vehiculos", payload),
  update: (id, payload) => http.put(`/vehiculos/${id}`, payload),
  remove: (id) => http.delete(`/vehiculos/${id}`)
};

export const simulacionesApi = {
  list: () => http.get("/simulaciones"),
  create: (payload) => http.post("/simulaciones", payload),
  get: (id) => http.get(`/simulaciones/${id}`)
};
