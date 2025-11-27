export function setLocalStorage<T>(key: string, value: T): boolean {
  try {
    if (typeof window === "undefined") {
      console.warn("localStorage is not available in server environment");
      return false;
    }

    if (value === null || value === undefined) {
      window.localStorage.removeItem(key);
      return true;
    }

    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    return false;
  }
}

export function getLocalStorage<T>(
  key: string,
  defaultValue?: T
): T | undefined {
  try {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    const item = window.localStorage.getItem(key);

    if (item === null) {
      return defaultValue;
    }

    return JSON.parse(item) as T;
  } catch (error) {
    return defaultValue;
  }
}

export function removeLocalStorage(key: string): boolean {
  try {
    if (typeof window === "undefined") {
      return false;
    }

    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

export function clearLocalStorage(): boolean {
  try {
    if (typeof window === "undefined") {
      return false;
    }

    window.localStorage.clear();
    return true;
  } catch (error) {
    return false;
  }
}
