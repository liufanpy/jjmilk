import { useState } from 'react'
import { savePurchase, getPurchases, updatePurchase, deletePurchase } from '../storage/db'
import type { Purchase } from '../types'

export function PurchaseForm() {
  const [date, setDate] = useState('')
  const [product, setProduct] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [, setSaved] = useState(0)

  const records = getPurchases()

  const resetForm = () => {
    setDate('')
    setProduct('')
    setQuantity('')
    setUnitPrice('')
    setEditId(null)
  }

  const handleSubmit = () => {
    if (editId) {
      updatePurchase(editId, {
        date: date || undefined,
        product,
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
      })
    } else {
      savePurchase({
        date: date || new Date().toISOString().slice(0, 10),
        product,
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
      })
    }
    resetForm()
    setSaved(n => n + 1)
  }

  const startEdit = (r: Purchase) => {
    setEditId(r.id ?? null)
    setDate(r.date)
    setProduct(r.product)
    setQuantity(String(r.quantity))
    setUnitPrice(String(r.unitPrice))
  }

  const handleDelete = (id: string) => {
    deletePurchase(id)
    if (editId === id) resetForm()
    setSaved(n => n + 1)
  }

  return (
    <div>
      <form onSubmit={e => { e.preventDefault(); handleSubmit() }}>
        <label>日期 <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
        <label>品名 <input value={product} onChange={e => setProduct(e.target.value)} /></label>
        <label>数量 <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} /></label>
        <label>单价 <input type="number" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} /></label>
        <div className="form-actions">
          <button type="submit">{editId ? '更新' : '保存'}</button>
          {editId && <button type="button" className="btn-cancel" onClick={resetForm}>取消</button>}
        </div>
      </form>

      {records.length > 0 && (
        <>
          <h3>进货记录 ({records.length})</h3>
          <ul>
            {records.map((r) => (
              <li key={r.id}>
                <span>{r.date} {r.product} ×{r.quantity}</span>
                <div className="item-actions">
                  <span>{r.amount?.toFixed(2)}</span>
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
