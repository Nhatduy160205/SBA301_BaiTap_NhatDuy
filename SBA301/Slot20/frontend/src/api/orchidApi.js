import { http } from "./httpClient";

// Step 3 & Step 4 - API module boundary
// Supporting both /orchids/ and /api/orchids/ contract seamlessly
export const getOrchids = (keyword = "") => {
  const params = keyword && keyword.trim() ? { name: keyword.trim() } : {};
  return http.get("/orchids/", { params });
};

export const getOrchid = (id) => {
  return http.get(`/orchids/${id}`);
};

export const createOrchid = (body) => {
  return http.post("/orchids/", body);
};

export const updateOrchid = (id, body) => {
  return http.put(`/orchids/${id}`, body);
};

export const deleteOrchid = (id) => {
  return http.delete(`/orchids/${id}`);
};

export const getCategories = () => {
  return http.get("/categories/");
};
