/**
 * localStorage、sessionStorage 封装
 */
export const _local = {
  set(key: string, value: any): void {
    const data = {
      value: value,
    }
    localStorage.setItem(key, JSON.stringify(data));
  },
  get(key: string): any {
    const data = localStorage.getItem(key);
    if (!data || data === "null") {
      return null;
    }
    return JSON.parse(data).value;
  },
  remove(key: string): void {
    localStorage.removeItem(key);
  },
  clear(): void {
    localStorage.clear();
  },
}

export const _session = {
  set(key: string, value: any): void {
    const data = {
      value: value,
    }
    sessionStorage.setItem(key, JSON.stringify(data));
  },
  get(key: string): any {
    const data = sessionStorage.getItem(key);
    if (!data || data === "null") {
      return null;
    }
    return JSON.parse(data).value;
  },
  remove(key: string): void {
    sessionStorage.removeItem(key);
  },
  clear(): void {
    sessionStorage.clear();
  },
};
