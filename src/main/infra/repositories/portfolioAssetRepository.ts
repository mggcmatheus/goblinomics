import betterSqlite3 from 'better-sqlite3'
import { IRepository } from './iRepository'
import sqliteDb from '../database'

export interface IPortfolioAsset {
  portfolioAssetId?: number
  portfolioId: number
  stockId: number
  quantity: number
  averagePrice: number
  createdAt?: string
  updatedAt?: string
}

class PortfolioAssetRepository implements IRepository<IPortfolioAsset> {
  private db: betterSqlite3.Database

  constructor() {
    this.db = sqliteDb
    this.initialize()
  }

  // Inicializa a tabela de portfolio_assets
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private initialize() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS portfolio_assets (
        portfolio_asset_id INTEGER PRIMARY KEY AUTOINCREMENT,
        portfolio_id INTEGER,
        stock_id INTEGER,
        quantity DECIMAL(10, 2),
        average_price DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(portfolio_id) REFERENCES portfolios(portfolio_id),
        FOREIGN KEY(stock_id) REFERENCES stocks(stock_id)
      );
    `
    this.db.prepare(createTableQuery).run()
  }

  // Cria um ativo em uma carteira
  create(portfolioAsset: IPortfolioAsset): IPortfolioAsset {
    const insertQuery = `
      INSERT INTO portfolio_assets (portfolio_id, stock_id, quantity, average_price)
      VALUES (@portfolio_id, @stock_id, @quantity, @average_price)
    `
    const stmt = this.db.prepare(insertQuery)
    const info = stmt.run(portfolioAsset)
    portfolioAsset.portfolioAssetId = Number(info.lastInsertRowid)
    return portfolioAsset
  }

  // Lê um ativo na carteira pelo ID
  read(portfolioAssetId: number): IPortfolioAsset | null {
    const selectQuery = 'SELECT * FROM portfolio_assets WHERE portfolio_asset_id = ?'
    const stmt = this.db.prepare(selectQuery)
    const portfolioAsset = stmt.get(portfolioAssetId) as IPortfolioAsset | undefined
    return portfolioAsset || null
  }

  // Atualiza um ativo na carteira
  update(portfolioAssetId: number, portfolioAsset: IPortfolioAsset): IPortfolioAsset | null {
    const updateQuery = `
      UPDATE portfolio_assets
      SET portfolio_id = @portfolio_id, stock_id = @stock_id,
          quantity = @quantity, average_price = @average_price
      WHERE portfolio_asset_id = @portfolioAssetId
    `
    const stmt = this.db.prepare(updateQuery)
    const result = stmt.run({ ...portfolioAsset, portfolioAssetId })
    if (result.changes > 0) {
      return { ...portfolioAsset, portfolioAssetId }
    }
    return null
  }

  // Deleta um ativo da carteira
  delete(portfolioAssetId: number): boolean {
    const deleteQuery = 'DELETE FROM portfolio_assets WHERE portfolio_asset_id = ?'
    const stmt = this.db.prepare(deleteQuery)
    const result = stmt.run(portfolioAssetId)
    return result.changes > 0
  }
}

export default PortfolioAssetRepository
