import axios from 'axios'

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

export class BrapiService {
  async quoteList(): Promise<QuoteListResponse> {
    try {
      const response = await axios.get<QuoteListResponse>(
        `${process.env.BRAPI_API_BASE_URL}/quote/list/`,
        {
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
