export interface Purchase {
  id?: string
  date: string
  product: string
  quantity: number
  unitPrice: number
  amount?: number
}

export interface Sale {
  id?: string
  date: string
  product: string
  quantity: number
  unitPrice: number
  amount?: number
  channel: '铺货' | '定奶' | '零售'
  paid: boolean
}

export interface Loss {
  id?: string
  date: string
  product: string
  quantity: number
  reason: string
}
