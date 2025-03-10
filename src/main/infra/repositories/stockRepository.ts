import { IRepository } from './iRepository'
import sqliteDb from '../database'
import betterSqlite3 from 'better-sqlite3'

export interface IStock {
  stockId?: number
  ticker: string
  name: string
  sector: string
  exchange: string
  createdAt?: string
  updatedAt?: string
}

class StockRepository implements IRepository<IStock> {
  private db: betterSqlite3.Database

  constructor() {
    this.db = sqliteDb
    this.initialize()
  }

  // Inicializa a tabela de stocks
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private initialize() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS stocks (
        stock_id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticker TEXT NOT NULL,
        name TEXT NOT NULL,
        sector TEXT NOT NULL,
        exchange TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `
    this.db.prepare(createTableQuery).run()
  }

  // Cria uma nova ação
  create(stock: IStock): IStock {
    const insertQuery = `
      INSERT INTO stocks (ticker, name, sector, exchange)
      VALUES (@ticker, @name, @sector, @exchange)
    `
    const stmt = this.db.prepare(insertQuery)
    const info = stmt.run(stock)
    stock.stockId = Number(info.lastInsertRowid)
    return stock
  }

  // Lê uma ação pelo ID
  read(stockId: number): IStock | null {
    const selectQuery = 'SELECT * FROM stocks WHERE stock_id = ?'
    const stmt = this.db.prepare(selectQuery)
    const stock = stmt.get(stockId) as IStock | undefined
    return stock || null
  }

  // Atualiza uma ação
  update(stockId: number, stock: IStock): IStock | null {
    const updateQuery = `
      UPDATE stocks
      SET ticker = @ticker, name = @name, sector = @sector, exchange = @exchange
      WHERE stock_id = @stockId
    `
    const stmt = this.db.prepare(updateQuery)
    const result = stmt.run({ ...stock, stockId })
    if (result.changes > 0) {
      return { ...stock, stockId }
    }
    return null
  }

  // Deleta uma ação
  delete(stockId: number): boolean {
    const deleteQuery = 'DELETE FROM stocks WHERE stock_id = ?'
    const stmt = this.db.prepare(deleteQuery)
    const result = stmt.run(stockId)
    return result.changes > 0
  }
}

export default StockRepository
