import React, { createContext, useState, useContext } from "react";

// Create Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <AuthContext.Provider value={{ visible, setVisible }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use Auth Context
export const useAuth = () => useContext(AuthContext);
