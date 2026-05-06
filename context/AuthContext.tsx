import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Stack } from 'expo-router';

type AuthContextType = {
  isSupplier: boolean;
  loginAsSupplier: (password: string) => Promise<boolean>;
  logout: () => void;
};

// NOTE: Replace this client-side password check with a real auth API in production.
const SUPPLIER_PASSWORD = 'fournisseur123';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSupplier, setIsSupplier] = useState<boolean>(false);

  async function loginAsSupplier(password: string) {
    const ok = password === SUPPLIER_PASSWORD;
    setIsSupplier(ok);
    return ok;
  }

  function logout() {
    setIsSupplier(false);
  }

  return <AuthContext.Provider value={{ isSupplier, loginAsSupplier, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Component that returns the appropriate Stack.Screen depending on auth.
// It is intended to be rendered inside a parent <Stack> in the root layout.
// export function ProtectedStack() {
//   const { isSupplier } = useAuth();
//   return isSupplier ? (
//     <Stack.Screen name="fournisseurs" options={{ headerShown: false }} />
//   ) : (
//     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//   );
// }

export default AuthContext;
