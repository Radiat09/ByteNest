"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { Provider } from "react-redux";
import { makeStore } from "@/redux/store";
import { useState, useEffect, useRef, createContext, useContext } from "react";
import { CartProvider } from "@/contexts/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const JwtSyncContext = createContext<{ synced: boolean }>({ synced: false });
export const useJwtSynced = () => useContext(JwtSyncContext);

function BackendJwtSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [jwtFetched, setJwtFetched] = useState(false);
  const [retry, setRetry] = useState(0);
  const prevEmailRef = useRef<string | null>(null);

  const synced = status === "unauthenticated" || jwtFetched;

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;
    if (prevEmailRef.current === session.user.email && jwtFetched) return;

    let cancelled = false;

    fetch(`${API_URL}/auth/jwt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: session.user.email }),
    })
      .then((res) => {
        if (cancelled) return;
        if (res.ok) {
          setJwtFetched(true);
          prevEmailRef.current = session.user.email ?? null;
        } else if (retry < 3) {
          setTimeout(() => setRetry((r) => r + 1), 1000);
        } else {
          setJwtFetched(true);
          prevEmailRef.current = session.user.email ?? null;
        }
      })
      .catch(() => {
        if (cancelled) return;
        if (retry < 3) {
          setTimeout(() => setRetry((r) => r + 1), 1000);
        } else {
          setJwtFetched(true);
          prevEmailRef.current = session.user.email ?? null;
        }
      });

    return () => { cancelled = true; };
  }, [session, status, jwtFetched, retry]);

  useEffect(() => {
    if (status === "unauthenticated" && prevEmailRef.current) {
      prevEmailRef.current = null;
      fetch(`${API_URL}/auth/clear`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    }
  }, [status]);

  return (
    <JwtSyncContext.Provider value={{ synced }}>
      {children}
    </JwtSyncContext.Provider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);

  return (
    <SessionProvider>
      <BackendJwtSync>
        <Provider store={store}>
          <CartProvider>{children}</CartProvider>
        </Provider>
      </BackendJwtSync>
    </SessionProvider>
  );
}
