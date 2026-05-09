import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Dashboard } from './Dashboard'
import { savePurchase, saveSale, saveLoss } from '../storage/db'

beforeEach(() => {
  localStorage.clear()
})

const thisMonth = new Date().toISOString().slice(0, 7) // YYYY-MM

describe('Dashboard', () => {
  it('shows zero state when no data', () => {
    render(<Dashboard />)
    expect(screen.getByText('本月概览')).toBeTruthy()
    // All amounts should be 0
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThan(0)
  })

  it('calculates profit = paid sales - purchases - loss cost', () => {
    savePurchase({ date: `${thisMonth}-05`, product: '纯牛奶', quantity: 10, unitPrice: 25 })  // cost=250
    saveSale({ date: `${thisMonth}-08`, product: '纯牛奶', quantity: 5, unitPrice: 4, channel: '铺货', paid: true })  // paid=20
    saveLoss({ date: `${thisMonth}-09`, product: '鲜奶', quantity: 1, reason: '过期' })

    render(<Dashboard />)

    // 利润 = 20 - 250 = -230
    expect(screen.getByText(/-230/)).toBeTruthy()
    expect(screen.getByText('20')).toBeTruthy()  // 销售额
    expect(screen.getByText('250')).toBeTruthy() // 进货额
  })

  it('excludes unpaid sales from revenue', () => {
    savePurchase({ date: `${thisMonth}-05`, product: '纯牛奶', quantity: 1, unitPrice: 10 }) // cost=10
    saveSale({ date: `${thisMonth}-08`, product: '酸奶', quantity: 2, unitPrice: 5, channel: '铺货', paid: false })

    render(<Dashboard />)
    // Revenue=0 (unpaid), cost=10 → profit=-10
    expect(screen.getByText(/-10/)).toBeTruthy()
  })

  it('shows unpaid sales as receivables', () => {
    saveSale({ date: `${thisMonth}-08`, product: '酸奶', quantity: 2, unitPrice: 5, channel: '铺货', paid: false })

    render(<Dashboard />)
    expect(screen.getByText(/酸奶/)).toBeTruthy()
    expect(screen.getByText(/未收/)).toBeTruthy()
  })
})
