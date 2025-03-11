import { BrapiService } from '../infra/http/brapi/BrapiService'
import TickerRepository, { ITicker } from '../infra/repositories/TickerRepository'

export class FetchTickersAndUpdate {
  private brapiService: BrapiService
  private tickerRepository: TickerRepository

  constructor() {
    this.brapiService = new BrapiService()
    this.tickerRepository = new TickerRepository()
  }

  async execute(): Promise<void> {
    try {
      const data = await this.brapiService.quoteList()
      if (!data?.stocks || data.stocks.length === 0) {
        console.warn('Nenhum ticker encontrado na API externa.')
        return
      }

      for (const stock of data.stocks) {
        const existingTicker = this.tickerRepository.getByStock(stock.stock)

        const ticker: ITicker = {
          stock: stock.stock,
          name: stock.name,
          sector: stock.sector || 'Unknown',
          type: stock.type || 'stock'
        }

        if (existingTicker) {
          this.tickerRepository.update(existingTicker.id!, ticker)
        } else {
          this.tickerRepository.add(ticker)
        }
      }

      console.log('Tickers atualizados com sucesso!')
    } catch (error) {
      console.error('Erro ao buscar e atualizar tickers:', error)
    }
  }
}
