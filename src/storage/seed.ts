import { savePurchase, saveSale, saveLoss } from './db'

export function seedData() {
  const m = new Date().toISOString().slice(0, 7) // YYYY-MM

  // 进货
  savePurchase({ date: `${m}-03`, product: '纯牛奶（箱）', quantity: 30, unitPrice: 25 })
  savePurchase({ date: `${m}-05`, product: '鲜奶（瓶）', quantity: 200, unitPrice: 3 })
  savePurchase({ date: `${m}-08`, product: '酸奶（杯）', quantity: 100, unitPrice: 2.5 })
  savePurchase({ date: `${m}-10`, product: '纯牛奶（箱）', quantity: 20, unitPrice: 25 })

  // 铺货（赊账为主）
  saveSale({ date: `${m}-04`, product: '纯牛奶（箱）', quantity: 10, unitPrice: 40, channel: '铺货', paid: false })
  saveSale({ date: `${m}-04`, product: '酸奶（杯）', quantity: 30, unitPrice: 4, channel: '铺货', paid: false })
  saveSale({ date: `${m}-06`, product: '纯牛奶（箱）', quantity: 8, unitPrice: 40, channel: '铺货', paid: true })
  saveSale({ date: `${m}-06`, product: '鲜奶（瓶）', quantity: 50, unitPrice: 5, channel: '铺货', paid: false })
  saveSale({ date: `${m}-09`, product: '纯牛奶（箱）', quantity: 12, unitPrice: 40, channel: '铺货', paid: true })

  // 定奶（大部分已收）
  saveSale({ date: `${m}-03`, product: '鲜奶（瓶）', quantity: 60, unitPrice: 5, channel: '定奶', paid: true })
  saveSale({ date: `${m}-07`, product: '鲜奶（瓶）', quantity: 40, unitPrice: 5, channel: '定奶', paid: true })
  saveSale({ date: `${m}-09`, product: '酸奶（杯）', quantity: 20, unitPrice: 4.5, channel: '定奶', paid: true })
  saveSale({ date: `${m}-10`, product: '鲜奶（瓶）', quantity: 15, unitPrice: 5, channel: '定奶', paid: false })

  // 零售摆摊
  saveSale({ date: `${m}-05`, product: '鲜奶（瓶）', quantity: 30, unitPrice: 5, channel: '零售', paid: true })
  saveSale({ date: `${m}-08`, product: '酸奶（杯）', quantity: 20, unitPrice: 4, channel: '零售', paid: true })
  saveSale({ date: `${m}-09`, product: '鲜奶（瓶）', quantity: 25, unitPrice: 5, channel: '零售', paid: true })

  // 损耗
  saveLoss({ date: `${m}-07`, product: '鲜奶（瓶）', quantity: 8, reason: '过期' })
  saveLoss({ date: `${m}-10`, product: '酸奶（杯）', quantity: 5, reason: '运输破损' })
}
