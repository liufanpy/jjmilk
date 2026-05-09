import { getPurchases, getSales, getLosses } from '../storage/db'

function thisMonth(dateStr: string): boolean {
  return dateStr.startsWith(new Date().toISOString().slice(0, 7))
}

const card = (label: string, value: number | string, unit = '元') => (
  <div className="card">
    <div className="card-label">{label}</div>
    <div className="card-value">{value}<span className="card-unit"> {unit}</span></div>
  </div>
)

export function Dashboard() {
  const sales = getSales().filter(s => thisMonth(s.date))
  const purchases = getPurchases().filter(p => thisMonth(p.date))
  const losses = getLosses().filter(l => thisMonth(l.date))

  const paidRevenue = sales.filter(s => s.paid).reduce((sum, s) => sum + (s.amount ?? 0), 0)
  const unpaidRevenue = sales.filter(s => !s.paid).reduce((sum, s) => sum + (s.amount ?? 0), 0)
  const purchaseCost = purchases.reduce((sum, p) => sum + (p.amount ?? 0), 0)
  const profit = paidRevenue - purchaseCost

  const unpaid = sales.filter(s => !s.paid)

  const channelRevenue = (ch: string) =>
    sales.filter(s => s.paid && s.channel === ch).reduce((sum, s) => sum + (s.amount ?? 0), 0)

  return (
    <div>
      <h2>本月概览</h2>

      <div className="card-row">
        {card('已收金额', paidRevenue)}
        {card('进货成本', purchaseCost)}
        {card('本月利润', profit)}
      </div>

      <div className="card-row secondary">
        {card('应收未收', unpaidRevenue)}
        {card('损耗笔数', losses.length, '笔')}
      </div>

      <div className="channel-breakdown">
        <h3>已收渠道分布</h3>
        <div className="channel-items">
          <div className="channel-item"><span>铺货</span><span>{channelRevenue('铺货')}元</span></div>
          <div className="channel-item"><span>定奶</span><span>{channelRevenue('定奶')}元</span></div>
          <div className="channel-item"><span>零售</span><span>{channelRevenue('零售')}元</span></div>
        </div>
      </div>

      {unpaid.length > 0 && (
        <div className="receivables">
          <h3>待收款</h3>
          <ul>
            {unpaid.map((s, i) => (
              <li key={i}>
                <span>{s.date.slice(5)} {s.product} ×{s.quantity}</span>
                <span className="amount">{s.amount}元</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
