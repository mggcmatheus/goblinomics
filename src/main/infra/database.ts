import Database, { Database as SQLiteDatabase } from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'

// Obtenha o caminho do diretório de dados do usuário
const userDataPath = app.getPath('userData')

// Crie o caminho do banco de dados dentro do diretório de dados do usuário
const dbPath = path.join(userDataPath, 'goblinomics.db')

// Criar e tipar a conexão com o SQLite
const sqliteDb: SQLiteDatabase = new Database(dbPath)

export default sqliteDb
