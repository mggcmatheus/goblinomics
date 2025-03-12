import axios from 'axios'
import * as https from 'node:https'

export interface QuoteListResponse {
  indexes: {
    stock: string
    name: string
  }[]
  stocks: {
    stock: string
    name: string
    close: number
    change: number
    volume: number
    market_cap: number
    logo: string
    sector: string
    type: string
  }[]
  availableSectors: string[]
  availableStockTypes: string[]
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

export class BrapiService {
  async quoteList(): Promise<QuoteListResponse> {
    try {
      const response = await axios.get<QuoteListResponse>(
        `${process.env.BRAPI_API_BASE_URL}/quote/list/`,
        {
          httpsAgent: httpsAgent,
          headers: {
            Authorization: `Bearer ${process.env.BRAPI_API_TOKEN_ID}`
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('Erro ao buscar dados externos:', error)
      throw error // Para que o erro possa ser tratado onde a função for chamada
    }
  }
}
