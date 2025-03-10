import betterSqlite3 from 'better-sqlite3'
import { IRepository } from './iRepository'
import sqliteDb from '../database'

export interface IStockPrice {
  priceId?: number
  stockId: number
  date: string
  openPrice: number
  closePrice: number
  highPrice: number
  lowPrice: number
  volume: number
  createdAt?: string
}

class StockPriceRepository implements IRepository<IStockPrice> {
  private db: betterSqlite3.Database

  constructor() {
    this.db = sqliteDb
    this.initialize()
  }

  // Inicializa a tabela de stock_prices
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private initialize() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS stock_prices (
        price_id INTEGER PRIMARY KEY AUTOINCREMENT,
        stock_id INTEGER,
        date DATE,
        open_price DECIMAL(10, 2),
        close_price DECIMAL(10, 2),
        high_price DECIMAL(10, 2),
        low_price DECIMAL(10, 2),
        volume BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(stock_id) REFERENCES stocks(stock_id)
      );
    `
    this.db.prepare(createTableQuery).run()
  }

  // Cria um preço para um ativo
  create(price: IStockPrice): IStockPrice {
    const insertQuery = `
      INSERT INTO stock_prices (stock_id, date, open_price, close_price, high_price, low_price, volume)
      VALUES (@stock_id, @date, @open_price, @close_price, @high_price, @low_price, @volume)
    `
    const stmt = this.db.prepare(insertQuery)
    const info = stmt.run(price)
    price.priceId = Number(info.lastInsertRowid)
    return price
  }

  // Lê o preço de um ativo por ID
  read(priceId: number): IStockPrice | null {
    const selectQuery = 'SELECT * FROM stock_prices WHERE price_id = ?'
    const stmt = this.db.prepare(selectQuery)
    const price = stmt.get(priceId) as IStockPrice | undefined
    return price || null
  }

  // Atualiza o preço de um ativo
  update(priceId: number, price: IStockPrice): IStockPrice | null {
    const updateQuery = `
      UPDATE stock_prices
      SET stock_id = @stock_id, date = @date, open_price = @open_price,
          close_price = @close_price, high_price = @high_price,
          low_price = @low_price, volume = @volume
      WHERE price_id = @priceId
    `
    const stmt = this.db.prepare(updateQuery)
    const result = stmt.run({ ...price, priceId })
    if (result.changes > 0) {
      return { ...price, priceId }
    }
    return null
  }

  // Deleta o preço de um ativo
  delete(priceId: number): boolean {
    const deleteQuery = 'DELETE FROM stock_prices WHERE price_id = ?'
    const stmt = this.db.prepare(deleteQuery)
    const result = stmt.run(priceId)
    return result.changes > 0
  }
}

export default StockPriceRepository
