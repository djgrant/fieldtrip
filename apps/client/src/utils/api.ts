import { SERVER_URL } from "../config";

export const api = {
  fetch: (path: string, options: RequestInit = {}) => {
    return fetch(`${SERVER_URL}/api/${path}`, {
      ...options,
      credentials: "include",
    });
  },
  user: () => api.fetch("user"),
  courses: () => api.fetch("courses"),
  course: (id: string) => api.fetch(`courses/${id}`),
  enroll: (id: string) => api.fetch(`courses/${id}`, { method: "POST" }),
  delete: (id: string) => api.fetch(`courses/${id}`, { method: "DELETE" }),
  registerCourse: (course: string) =>
    api.fetch("courses", {
      method: "POST",
      body: JSON.stringify({ course }),
      headers: { "Content-Type": "application/json" },
    }),
};
