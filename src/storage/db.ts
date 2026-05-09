import type { Purchase, Sale, Loss } from '../types'

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function read<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

function write<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data))
}

interface WithId {
  id?: string
}

function makeRepo<T extends WithId>(key: string, transform?: (item: T) => T) {
  return {
    save(item: T) {
      const list = read<T>(key)
      list.push({ ...(transform ? transform(item) : item), id: uid() })
      write(key, list)
    },
    update(id: string, patch: Partial<T>) {
      const list = read<T>(key)
      const i = list.findIndex((r: T) => r.id === id)
      if (i === -1) throw new Error(`Record ${id} not found`)
      list[i] = { ...list[i], ...patch }
      if (transform) list[i] = transform(list[i])
      write(key, list)
    },
    remove(id: string) {
      const list = read<T>(key)
      write(key, list.filter((r: T) => r.id !== id))
    },
    getAll(): T[] {
      return read<T>(key)
    },
    getById(id: string): T | undefined {
      return read<T>(key).find((r: T) => r.id === id)
    },
  }
}

export function clearAll() {}

const purchases = makeRepo<Purchase>('jjmilk_purchases', p => ({
  ...p,
  amount: p.quantity * p.unitPrice,
}))

export const savePurchase = purchases.save
export const updatePurchase = purchases.update
export const deletePurchase = purchases.remove
export const getPurchases = purchases.getAll

const sales = makeRepo<Sale>('jjmilk_sales', s => ({
  ...s,
  amount: s.quantity * s.unitPrice,
}))

export const saveSale = sales.save
export const updateSale = sales.update
export const deleteSale = sales.remove
export const getSales = sales.getAll

const losses = makeRepo<Loss>('jjmilk_losses')

export const saveLoss = losses.save
export const updateLoss = losses.update
export const deleteLoss = losses.remove
export const getLosses = losses.getAll
