import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface AuthResponse {
  token: string;
}

export default {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      process.env.API_URL as string,
      { email, password },
    );

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("token");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};
