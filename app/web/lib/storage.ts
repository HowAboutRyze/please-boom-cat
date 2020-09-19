/**
 * localStorage、sessionStorage 封装
 */
export const _local = {
  set(key, value) {
    const data = {
      value: value
    }
    localStorage.setItem(key, JSON.stringify(data));
  },
  get(key) {
    const data = localStorage.getItem(key);
    if (!data || data === "null") {
      return null;
    }
    return JSON.parse(data).value;
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  }
}

export const _session = {
  set(key, value) {
    const data = {
      value: value
    }
    sessionStorage.setItem(key, JSON.stringify(data));
  },
  get(key) {
    const data = sessionStorage.getItem(key);
    if (!data || data === "null") {
      return null;
    }
    return JSON.parse(data).value;
  },
  remove(key) {
    sessionStorage.removeItem(key);
  },
  clear() {
    sessionStorage.clear();
  }
};
