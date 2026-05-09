import { useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { PurchaseForm } from './components/PurchaseForm'
import { SalesForm } from './components/SalesForm'
import { LossForm } from './components/LossForm'
import { seedData } from './storage/seed'
import './App.css'

const tabs = [
  { key: 'dashboard', label: '概览', Component: Dashboard },
  { key: 'purchase', label: '进货', Component: PurchaseForm },
  { key: 'sale', label: '销售', Component: SalesForm },
  { key: 'loss', label: '损耗', Component: LossForm },
] as const

function App() {
  const [tab, setTab] = useState('dashboard')
  const [seedKey, setSeedKey] = useState(0)

  const handleSeed = () => {
    seedData()
    setSeedKey(k => k + 1)
  }

  const Current = tabs.find(t => t.key === tab)?.Component ?? Dashboard

  return (
    <div className="app">
      <header className="app-header">
        <h1>金健牛奶</h1>
        <button className="seed-btn" onClick={handleSeed}>生成测试数据</button>
      </header>
      <main className="app-main" key={seedKey}>
        <Current />
      </main>
      <nav className="app-nav">
        {tabs.map(t => (
          <button
            key={t.key}
            className={tab === t.key ? 'active' : ''}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
