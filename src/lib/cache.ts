const memoryCache = new Map<string, unknown>();

const getLocalStorage = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch (err) {
    console.warn("localStorage unavailable", err);
    return null;
  }
};

const STORAGE_KEY = "bc-property-cache";

const loadStore = (): Record<string, unknown> => {
  const ls = getLocalStorage();
  if (!ls) return {};
  const raw = ls.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (err) {
    console.warn("Failed to parse cache", err);
    return {};
  }
};

const writeStore = (store: Record<string, unknown>) => {
  const ls = getLocalStorage();
  if (!ls) return;
  try {
    ls.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.warn("Failed to write cache", err);
  }
};

export const getCached = <T>(key: string): T | null => {
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }
  const store = loadStore();
  if (key in store) {
    const val = store[key] as T;
    memoryCache.set(key, val);
    return val;
  }
  return null;
};

export const setCached = (key: string, value: unknown) => {
  memoryCache.set(key, value);
  const store = loadStore();
  store[key] = value;
  writeStore(store);
};
