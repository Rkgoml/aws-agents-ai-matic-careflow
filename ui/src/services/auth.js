import api from "./api";

export async function loginUser(username, password) {
    const response = await api.post("/user/login", null, {
      params: { username, password },
    });
    return response.data;
  
}

export async function registerUser(username, password) {
  
    const response = await api.post("/user/register", null, {
      params: { username, password },
    });
    return response.data;
  
}
