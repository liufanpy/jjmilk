import { useState } from 'react'
import { saveLoss, getLosses, updateLoss, deleteLoss } from '../storage/db'
import type { Loss } from '../types'

export function LossForm() {
  const [date, setDate] = useState('')
  const [product, setProduct] = useState('')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [, setSaved] = useState(0)

  const records = getLosses()

  const resetForm = () => {
    setDate('')
    setProduct('')
    setQuantity('')
    setReason('')
    setEditId(null)
  }

  const handleSubmit = () => {
    const data = {
      date: date || new Date().toISOString().slice(0, 10),
      product,
      quantity: Number(quantity),
      reason,
    }
    if (editId) {
      updateLoss(editId, data)
    } else {
      saveLoss(data)
    }
    resetForm()
    setSaved(n => n + 1)
  }

  const startEdit = (r: Loss) => {
    setEditId(r.id ?? null)
    setDate(r.date)
    setProduct(r.product)
    setQuantity(String(r.quantity))
    setReason(r.reason)
  }

  const handleDelete = (id: string) => {
    deleteLoss(id)
    if (editId === id) resetForm()
    setSaved(n => n + 1)
  }

  return (
    <div>
      <form onSubmit={e => { e.preventDefault(); handleSubmit() }}>
        <label>日期 <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
        <label>品名 <input value={product} onChange={e => setProduct(e.target.value)} /></label>
        <label>数量 <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} /></label>
        <label>原因 <input value={reason} onChange={e => setReason(e.target.value)} /></label>
        <div className="form-actions">
          <button type="submit">{editId ? '更新' : '保存'}</button>
          {editId && <button type="button" className="btn-cancel" onClick={resetForm}>取消</button>}
        </div>
      </form>

      {records.length > 0 && (
        <>
          <h3>损耗记录 ({records.length})</h3>
          <ul>
            {records.map((r) => (
              <li key={r.id}>
                <span>{r.date.slice(5)} {r.product} ×{r.quantity}</span>
                <div className="item-actions">
                  <span className="reason">{r.reason}</span>
                  <button className="btn-sm" onClick={() => startEdit(r)}>编辑</button>
                  <button className="btn-sm btn-del" onClick={() => handleDelete(r.id!)}>删除</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
