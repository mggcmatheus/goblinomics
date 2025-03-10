import betterSqlite3 from 'better-sqlite3'
import { IRepository } from './iRepository'
import sqliteDb from '../database'

export interface IPortfolio {
  portfolioId?: number
  userId: number
  name: string
  createdAt?: string
  updatedAt?: string
}

class PortfolioRepository implements IRepository<IPortfolio> {
  private db: betterSqlite3.Database

  constructor() {
    this.db = sqliteDb
    this.initialize()
  }

  // Inicializa a tabela de portfolios
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private initialize() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS portfolios (
        portfolio_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `
    this.db.prepare(createTableQuery).run()
  }

  // Cria uma nova carteira
  create(portfolio: IPortfolio): IPortfolio {
    const insertQuery = `
      INSERT INTO portfolios (user_id, name)
      VALUES (@user_id, @name)
    `
    const stmt = this.db.prepare(insertQuery)
    const info = stmt.run(portfolio)
    portfolio.portfolioId = Number(info.lastInsertRowid)
    return portfolio
  }

  // Lê uma carteira pelo ID
  read(portfolioId: number): IPortfolio | null {
    const selectQuery = 'SELECT * FROM portfolios WHERE portfolio_id = ?'
    const stmt = this.db.prepare(selectQuery)
    const portfolio = stmt.get(portfolioId) as IPortfolio | undefined
    return portfolio || null
  }

  // Atualiza uma carteira
  update(portfolioId: number, portfolio: IPortfolio): IPortfolio | null {
    const updateQuery = `
      UPDATE portfolios
      SET user_id = @user_id, name = @name
      WHERE portfolio_id = @portfolioId
    `
    const stmt = this.db.prepare(updateQuery)
    const result = stmt.run({ ...portfolio, portfolioId })
    if (result.changes > 0) {
      return { ...portfolio, portfolioId }
    }
    return null
  }

  // Deleta uma carteira
  delete(portfolioId: number): boolean {
    const deleteQuery = 'DELETE FROM portfolios WHERE portfolio_id = ?'
    const stmt = this.db.prepare(deleteQuery)
    const result = stmt.run(portfolioId)
    return result.changes > 0
  }
}

export default PortfolioRepository
