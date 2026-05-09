import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LossForm } from './LossForm'
import { getLosses } from '../storage/db'

beforeEach(() => {
  localStorage.clear()
})

describe('LossForm', () => {
  it('renders reason input and no price field', () => {
    render(<LossForm />)
    expect(screen.getByLabelText(/原因/)).toBeTruthy()
    expect(screen.queryByLabelText(/单价/)).toBeNull()
  })

  it('saves a loss record', () => {
    render(<LossForm />)
    fireEvent.change(screen.getByLabelText(/品名/), { target: { value: '鲜奶' } })
    fireEvent.change(screen.getByLabelText(/数量/), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText(/原因/), { target: { value: '过期' } })
    fireEvent.click(screen.getByText(/保存/))

    const list = getLosses()
    expect(list[0].product).toBe('鲜奶')
    expect(list[0].reason).toBe('过期')
  })

  it('shows saved records in a list', () => {
    render(<LossForm />)
    fireEvent.change(screen.getByLabelText(/品名/), { target: { value: '鲜奶' } })
    fireEvent.change(screen.getByLabelText(/数量/), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText(/原因/), { target: { value: '过期' } })
    fireEvent.click(screen.getByText(/保存/))

    expect(screen.getByText(/鲜奶/)).toBeTruthy()
    expect(screen.getByText(/过期/)).toBeTruthy()
  })

  it('deletes a record', () => {
    render(<LossForm />)
    fireEvent.change(screen.getByLabelText(/品名/), { target: { value: '鲜奶' } })
    fireEvent.change(screen.getByLabelText(/数量/), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/原因/), { target: { value: '过期' } })
    fireEvent.click(screen.getByText(/保存/))

    fireEvent.click(screen.getByText(/删除/))
    expect(getLosses()).toHaveLength(0)
  })

  it('edits a record', () => {
    render(<LossForm />)
    fireEvent.change(screen.getByLabelText(/品名/), { target: { value: '酸奶' } })
    fireEvent.change(screen.getByLabelText(/数量/), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/原因/), { target: { value: '破损' } })
    fireEvent.click(screen.getByText(/保存/))

    fireEvent.click(screen.getByText(/编辑/))
    fireEvent.change(screen.getByLabelText(/原因/), { target: { value: '过期' } })
    fireEvent.click(screen.getByText(/更新/))

    expect(getLosses()[0].reason).toBe('过期')
  })
})
