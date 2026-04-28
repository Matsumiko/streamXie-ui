import { useCallback, useEffect, useState } from "react";
import { BRAND_NAME } from "@/lib/brand";
import { migrateLocalStorageKey } from "@/lib/storageKeys";

export type DemoUser = {
  name: string;
  email?: string;
};

type LoginOptions = {
  name?: string;
  email?: string;
};

const AUTH_USER_KEY = "streamxie-auth-user";
const LEGACY_AUTH_USER_KEY = "streamora-auth-user";
const listeners = new Set<() => void>();

const emitAuthChange = () => {
  listeners.forEach((listener) => listener());
};

const isBrowser = () => typeof window !== "undefined";

const readUser = (): DemoUser | null => {
  if (!isBrowser()) return null;

  try {
    migrateLocalStorageKey(AUTH_USER_KEY, LEGACY_AUTH_USER_KEY);
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeUser = (user: DemoUser | null) => {
  if (!isBrowser()) return;

  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.removeItem(LEGACY_AUTH_USER_KEY);
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(LEGACY_AUTH_USER_KEY);
  }

  emitAuthChange();
};

const getDisplayName = ({ name, email }: LoginOptions) => {
  const trimmedName = name?.trim();
  if (trimmedName) return trimmedName;

  const trimmedEmail = email?.trim();
  if (trimmedEmail) return trimmedEmail.split("@")[0] || trimmedEmail;

  return `${BRAND_NAME} Viewer`;
};

export const useAuth = () => {
  const [user, setUser] = useState<DemoUser | null>(() => readUser());
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const syncUser = () => setUser(readUser());

    listeners.add(syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      listeners.delete(syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const login = useCallback(async (options: LoginOptions = {}) => {
    setIsPending(true);

    try {
      const nextUser: DemoUser = {
        name: getDisplayName(options),
        email: options.email?.trim() || undefined,
      };

      writeUser(nextUser);
      setUser(nextUser);
      return nextUser;
    } finally {
      setIsPending(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsPending(true);

    try {
      writeUser(null);
      setUser(null);
    } finally {
      setIsPending(false);
    }
  }, []);

  return {
    user,
    isAnonymous: !user,
    isPending,
    login,
    logout,
  };
};
