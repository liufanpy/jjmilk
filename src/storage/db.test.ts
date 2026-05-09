import { describe, it, expect, beforeEach } from 'vitest'
import {
  savePurchase, getPurchases, updatePurchase, deletePurchase,
  saveSale, getSales,
  saveLoss, getLosses,
  clearAll,
} from './db'
import type { Purchase, Sale, Loss } from '../types'

beforeEach(() => {
  localStorage.clear()
  clearAll()
})

function samplePurchase(overrides?: Partial<Purchase>): Purchase {
  return { date: '2026-05-09', product: '纯牛奶', quantity: 10, unitPrice: 25, ...overrides }
}

function sampleSale(overrides?: Partial<Sale>): Sale {
  return { date: '2026-05-09', product: '纯牛奶', quantity: 1, unitPrice: 3, channel: '铺货', paid: false, ...overrides }
}

function sampleLoss(overrides?: Partial<Loss>): Loss {
  return { date: '2026-05-09', product: '鲜奶', quantity: 2, reason: '过期', ...overrides }
}

describe('savePurchase', () => {
  it('saves and retrieves a purchase', () => {
    savePurchase(samplePurchase())
    const list = getPurchases()
    expect(list[0].product).toBe('纯牛奶')
    expect(list[0].amount).toBe(250)
  })

  it('auto-calculates amount from quantity × unitPrice', () => {
    savePurchase(samplePurchase({ quantity: 5, unitPrice: 30 }))
    expect(getPurchases()[0].amount).toBe(150)
  })

  it('persists multiple purchases', () => {
    savePurchase(samplePurchase({ product: 'A' }))
    savePurchase(samplePurchase({ product: 'B' }))
    expect(getPurchases()).toHaveLength(2)
  })

  it('assigns a unique id to each record', () => {
    savePurchase(samplePurchase())
    const list = getPurchases()
    expect(list[0].id).toBeTruthy()
    expect(typeof list[0].id).toBe('string')
  })
})

describe('updatePurchase', () => {
  it('updates a purchase by id', () => {
    savePurchase(samplePurchase({ product: '旧名' }))
    const id = getPurchases()[0].id!
    updatePurchase(id, { product: '新名', quantity: 5, unitPrice: 10 })

    const list = getPurchases()
    expect(list[0].product).toBe('新名')
    expect(list[0].amount).toBe(50)
  })

  it('throws if id not found', () => {
    expect(() => updatePurchase('bad-id', {})).toThrow()
  })
})

describe('deletePurchase', () => {
  it('deletes a purchase by id', () => {
    savePurchase(samplePurchase({ product: 'A' }))
    savePurchase(samplePurchase({ product: 'B' }))
    const idA = getPurchases()[0].id!
    deletePurchase(idA)

    const list = getPurchases()
    expect(list).toHaveLength(1)
    expect(list[0].product).toBe('B')
  })
})

describe('saveSale', () => {
  it('saves and retrieves a sale with channel and paid status', () => {
    saveSale(sampleSale({ channel: '定奶', paid: true }))
    const list = getSales()
    expect(list).toHaveLength(1)
    expect(list[0].channel).toBe('定奶')
    expect(list[0].paid).toBe(true)
  })

  it('auto-calculates amount', () => {
    saveSale(sampleSale({ quantity: 3, unitPrice: 5 }))
    expect(getSales()[0].amount).toBe(15)
  })

  it('separates sales from purchases', () => {
    savePurchase(samplePurchase())
    saveSale(sampleSale())
    expect(getPurchases()).toHaveLength(1)
    expect(getSales()).toHaveLength(1)
  })
})

describe('saveLoss', () => {
  it('saves and retrieves a loss', () => {
    saveLoss(sampleLoss())
    const list = getLosses()
    expect(list).toHaveLength(1)
    expect(list[0].reason).toBe('过期')
    expect(list[0].quantity).toBe(2)
  })

  it('does not auto-calculate amount (loss has no unitPrice)', () => {
    saveLoss(sampleLoss())
    expect(getLosses()[0]).not.toHaveProperty('amount')
  })
})
