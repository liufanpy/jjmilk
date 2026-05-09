import { useState } from 'react'
import { saveSale, getSales, updateSale, deleteSale } from '../storage/db'
import type { Sale } from '../types'

const chLabel: Record<string, string> = { '铺货': '铺', '定奶': '定', '零售': '零' }

export function SalesForm() {
  const [date, setDate] = useState('')
  const [product, setProduct] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [channel, setChannel] = useState('铺货')
  const [paid, setPaid] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [, setSaved] = useState(0)

  const records = getSales()

  const resetForm = () => {
    setDate('')
    setProduct('')
    setQuantity('')
    setUnitPrice('')
    setChannel('铺货')
    setPaid(false)
    setEditId(null)
  }

  const handleSubmit = () => {
    const data = {
      date: date || new Date().toISOString().slice(0, 10),
      product,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      channel: channel as '铺货' | '定奶' | '零售',
      paid,
    }
    if (editId) {
      updateSale(editId, data)
    } else {
      saveSale(data)
    }
    resetForm()
    setSaved(n => n + 1)
  }

  const startEdit = (r: Sale) => {
    setEditId(r.id ?? null)
    setDate(r.date)
    setProduct(r.product)
    setQuantity(String(r.quantity))
    setUnitPrice(String(r.unitPrice))
    setChannel(r.channel)
    setPaid(r.paid)
  }

  const handleDelete = (id: string) => {
    deleteSale(id)
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
        <label>渠道
          <select value={channel} onChange={e => setChannel(e.target.value)}>
            <option>铺货</option>
            <option>定奶</option>
            <option>零售</option>
          </select>
        </label>
        <label>
          <input type="checkbox" checked={paid} onChange={e => setPaid(e.target.checked)} />
          已收款
        </label>
        <div className="form-actions">
          <button type="submit">{editId ? '更新' : '保存'}</button>
          {editId && <button type="button" className="btn-cancel" onClick={resetForm}>取消</button>}
        </div>
      </form>

      {records.length > 0 && (
        <>
          <h3>销售记录 ({records.length})</h3>
          <ul>
            {records.map((r) => (
              <li key={r.id}>
                <span>
                  <span className="tag">{chLabel[r.channel]}</span>
                  {r.date.slice(5)} {r.product} ×{r.quantity}
                </span>
                <div className="item-actions">
                  <span className={r.paid ? 'paid' : 'unpaid'}>
                    {r.amount?.toFixed(2)} {r.paid ? '已收' : '未收'}
                  </span>
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
