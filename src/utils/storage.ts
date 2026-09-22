export function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    console.error(`Failed to read ${key} from localStorage`, e);
    return null;
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch (e) {
    console.error(`Failed to write ${key} to localStorage`, e);
  }
}
