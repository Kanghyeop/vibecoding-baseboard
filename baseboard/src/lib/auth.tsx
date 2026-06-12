"use client";

// 페이크 로그인.
// 구글 버튼을 누르면 가상 유저 1명(u1, "졸린 쿠키")으로 즉시 로그인된다.
// 나중에 Supabase Auth로 교체할 때 이 파일과 LoginModal만 갈아끼우면 된다.

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export const ME = "u1";

interface AuthState {
  ready: boolean;
  loggedIn: boolean;
  userId: string | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  ready: false,
  loggedIn: false,
  userId: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(localStorage.getItem("bb-login") === "1");
    setReady(true);
  }, []);

  const login = useCallback(() => {
    // 탈퇴했던 계정이면 재가입으로 되살린다 (데모 루프가 끊기지 않도록)
    fetch(`/api/users/${ME}`, { method: "PATCH", body: JSON.stringify({ action: "rejoin" }) });
    localStorage.setItem("bb-login", "1");
    setLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("bb-login");
    setLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ ready, loggedIn, userId: loggedIn ? ME : null, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
