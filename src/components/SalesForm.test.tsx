import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SalesForm } from './SalesForm'
import { getSales } from '../storage/db'

beforeEach(() => {
  localStorage.clear()
})

describe('SalesForm', () => {
  it('renders channel selector and paid toggle', () => {
    render(<SalesForm />)
    expect(screen.getByLabelText(/渠道/)).toBeTruthy()
    expect(screen.getByLabelText(/已收款/)).toBeTruthy()
  })

  it('saves a sale with paid status', () => {
    render(<SalesForm />)
    fireEvent.change(screen.getByLabelText(/品名/), { target: { value: '鲜奶' } })
    fireEvent.change(screen.getByLabelText(/数量/), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/单价/), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText(/渠道/), { target: { value: '定奶' } })
    fireEvent.click(screen.getByLabelText(/已收款/))
    fireEvent.click(screen.getByText(/保存/))

    const list = getSales()
    expect(list[0].channel).toBe('定奶')
    expect(list[0].paid).toBe(true)
  })

  it('defaults to unpaid and 铺货 channel', () => {
    render(<SalesForm />)
    fireEvent.change(screen.getByLabelText(/品名/), { target: { value: '酸奶' } })
    fireEvent.change(screen.getByLabelText(/数量/), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/单价/), { target: { value: '5' } })
    fireEvent.click(screen.getByText(/保存/))

    const list = getSales()
    expect(list[0].paid).toBe(false)
    expect(list[0].channel).toBe('铺货')
  })

  it('shows saved records with channel tag and paid status', () => {
    render(<SalesForm />)
    fireEvent.change(screen.getByLabelText(/品名/), { target: { value: '酸奶' } })
    fireEvent.change(screen.getByLabelText(/数量/), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/单价/), { target: { value: '3' } })
    fireEvent.click(screen.getByText(/保存/))

    expect(screen.getByText(/酸奶/)).toBeTruthy()
    expect(screen.getByText(/未收/)).toBeTruthy()
  })

  it('deletes a record', () => {
    render(<SalesForm />)
    fireEvent.change(screen.getByLabelText(/品名/), { target: { value: '鲜奶' } })
    fireEvent.change(screen.getByLabelText(/数量/), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/单价/), { target: { value: '3' } })
    fireEvent.click(screen.getByText(/保存/))

    fireEvent.click(screen.getByText(/删除/))
    expect(getSales()).toHaveLength(0)
  })

  it('edits a record', () => {
    render(<SalesForm />)
    fireEvent.change(screen.getByLabelText(/品名/), { target: { value: '旧' } })
    fireEvent.change(screen.getByLabelText(/数量/), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/单价/), { target: { value: '5' } })
    fireEvent.click(screen.getByText(/保存/))

    fireEvent.click(screen.getByText(/编辑/))
    fireEvent.change(screen.getByLabelText(/品名/), { target: { value: '新' } })
    fireEvent.click(screen.getByText(/更新/))

    expect(getSales()[0].product).toBe('新')
  })
})
