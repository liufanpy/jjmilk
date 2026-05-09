import '@testing-library/jest-dom'

// Mock localStorage for jsdom
const store = new Map<string, string>()
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, value) },
    removeItem: (key: string) => { store.delete(key) },
    clear: () => { store.clear() },
    get length() { return store.size },
    key: (i: number) => [...store.keys()][i] ?? null,
  },
  writable: true,
})
