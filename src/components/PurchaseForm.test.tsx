import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PurchaseForm } from './PurchaseForm'
import { getPurchases, savePurchase } from '../storage/db'

beforeEach(() => {
  localStorage.clear()
})

function fillAndSave() {
  fireEvent.change(screen.getByLabelText(/品名/), { target: { value: '酸奶' } })
  fireEvent.change(screen.getByLabelText(/数量/), { target: { value: '10' } })
  fireEvent.change(screen.getByLabelText(/单价/), { target: { value: '2.5' } })
  fireEvent.click(screen.getByText(/保存/))
}

describe('PurchaseForm', () => {
  it('renders form fields', () => {
    render(<PurchaseForm />)
    expect(screen.getByLabelText(/日期/)).toBeTruthy()
    expect(screen.getByLabelText(/品名/)).toBeTruthy()
    expect(screen.getByLabelText(/数量/)).toBeTruthy()
    expect(screen.getByLabelText(/单价/)).toBeTruthy()
  })

  it('submits and saves a purchase record', () => {
    render(<PurchaseForm />)
    fireEvent.change(screen.getByLabelText(/品名/), { target: { value: '鲜奶' } })
    fireEvent.change(screen.getByLabelText(/数量/), { target: { value: '20' } })
    fireEvent.change(screen.getByLabelText(/单价/), { target: { value: '3' } })
    fireEvent.click(screen.getByText(/保存/))

    expect(getPurchases()).toHaveLength(1)
    expect(getPurchases()[0].product).toBe('鲜奶')
    expect(getPurchases()[0].amount).toBe(60)
  })

  it('clears form after submit', () => {
    render(<PurchaseForm />)
    const productInput = screen.getByLabelText(/品名/) as HTMLInputElement
    fireEvent.change(productInput, { target: { value: '酸奶' } })
    fireEvent.click(screen.getByText(/保存/))
    expect(productInput.value).toBe('')
  })

  it('shows saved records in a list', () => {
    render(<PurchaseForm />)
    fillAndSave()
    expect(screen.getByText(/酸奶/)).toBeTruthy()
    expect(screen.getByText(/10/)).toBeTruthy()
    expect(screen.getByText('25.00', { exact: false })).toBeTruthy()
  })

  it('shows existing records on mount', () => {
    savePurchase({ date: '2026-05-01', product: '纯牛奶', quantity: 5, unitPrice: 30 })
    render(<PurchaseForm />)
    expect(screen.getByText(/纯牛奶/)).toBeTruthy()
    expect(screen.getByText('150.00', { exact: false })).toBeTruthy()
  })

  it('deletes a record when clicking delete', () => {
    render(<PurchaseForm />)
    fillAndSave()
    expect(getPurchases()).toHaveLength(1)

    fireEvent.click(screen.getByText(/删除/))
    expect(getPurchases()).toHaveLength(0)
    expect(screen.queryByText(/酸奶/)).toBeNull()
  })

  it('enters edit mode and updates a record', () => {
    savePurchase({ date: '2026-05-01', product: '旧品名', quantity: 5, unitPrice: 30 })
    render(<PurchaseForm />)

    fireEvent.click(screen.getByText(/编辑/))

    const productInput = screen.getByLabelText(/品名/) as HTMLInputElement
    expect(productInput.value).toBe('旧品名')

    fireEvent.change(productInput, { target: { value: '新品名' } })
    fireEvent.click(screen.getByText(/更新/))

    const list = getPurchases()
    expect(list[0].product).toBe('新品名')
  })
})
