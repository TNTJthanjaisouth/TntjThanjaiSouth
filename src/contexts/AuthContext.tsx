import { createContext, useContext, useState } from "react";
import { db, ref, get } from "../../Firebase/firebase.config";

import jwtEncode from "jwt-encode";

interface AuthContextType {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("auth_token")
  );

  const SECRET = "MY_SUPER_SECRET_KEY_123"; // replace later

  const login = async (username: string, password: string) => {
    try {
      const userRef = ref(db, `users/${username}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) return false;

      const data = snapshot.val();

      if (data.password !== password) return false;

      // ✅ Create JWT token
      const token = jwtEncode(
        {
          username,
          loginTime: Date.now(),
        },
        SECRET
      );

      // ✅ Store session
      localStorage.setItem("auth_token", token);
      localStorage.setItem("logged_user", username);

      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("logged_user");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
