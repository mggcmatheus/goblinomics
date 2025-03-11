import sqliteDb from '../database'
import betterSqlite3 from 'better-sqlite3'

export interface ITicker {
  id?: number
  stock: string
  name: string
  sector: string
  type: string
  createdAt?: string
  updatedAt?: string
}

class TickerRepository {
  private db: betterSqlite3.Database

  constructor() {
    this.db = sqliteDb
    this.initialize()
  }

  // Inicializa a tabela de tickers
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private initialize() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tickers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stock TEXT NOT NULL,
        name TEXT NOT NULL,
        sector TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `
    this.db.prepare(createTableQuery).run()
  }

  getAll(): ITicker[] {
    const selectQuery = 'SELECT * FROM tickers'
    const stmt = this.db.prepare(selectQuery)
    const tickers = stmt.all() as ITicker[]
    return tickers || null
  }

  // Cria uma nova ação
  add(ticker: ITicker): ITicker {
    const insertQuery = `
      INSERT INTO tickers (stock, name, sector, type)
      VALUES (@stock, @name, @sector, @type)
    `
    const stmt = this.db.prepare(insertQuery)
    const info = stmt.run(ticker)
    ticker.id = Number(info.lastInsertRowid)
    return ticker
  }

  // Lê uma ação pelo ID
  getById(id: number): ITicker | null {
    const selectQuery = 'SELECT * FROM tickers WHERE id = ?'
    const stmt = this.db.prepare(selectQuery)
    const ticker = stmt.get(id) as ITicker | undefined
    return ticker || null
  }

  // Lê uma ação pelo ticker
  getByStock(stock: string): ITicker | null {
    const selectQuery = 'SELECT * FROM tickers WHERE stock = ?'
    const stmt = this.db.prepare(selectQuery)
    const ticker = stmt.get(stock) as ITicker | undefined
    return ticker || null
  }

  // Atualiza uma ação
  update(id: number, ticker: ITicker): ITicker | null {
    const updateQuery = `
      UPDATE tickers
      SET stock = @stock, name = @name, sector = @sector, type = @type
      WHERE id = @id
    `
    const stmt = this.db.prepare(updateQuery)
    const result = stmt.run({ ...ticker, id })
    if (result.changes > 0) {
      return { ...ticker, id }
    }
    return null
  }

  // Deleta uma ação
  delete(id: number): boolean {
    const deleteQuery = 'DELETE FROM tickers WHERE id = ?'
    const stmt = this.db.prepare(deleteQuery)
    const result = stmt.run(id)
    return result.changes > 0
  }
}

export default TickerRepository
