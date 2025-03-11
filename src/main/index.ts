import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import TickerRepository from './infra/repositories/TickerRepository'
import { FetchTickersAndUpdate } from './usecases/fetchTickersAndUpdate'
import dotenv from 'dotenv'

dotenv.config()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1030,
    height: 685,
    minWidth: 1030,
    minHeight: 685,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

const tickerRepo = new TickerRepository()
// 🔹 STOCKS
ipcMain.handle('ticker:add', async (_event, ticker) => tickerRepo.add(ticker))
ipcMain.handle('ticker:get-all', async () => tickerRepo.getAll())
ipcMain.handle('ticker:get-by-id', async (_event, id) => tickerRepo.getById(id))
ipcMain.handle('ticker:get-by-stock', async (_event, stock) => tickerRepo.getByStock(stock))
ipcMain.handle('ticker:update', async (_event, id, ticker) => tickerRepo.update(id, ticker))
ipcMain.handle('ticker:delete', async (_event, id) => tickerRepo.delete(id))

// Função para executar o caso de uso
async function fetchAndUpdateTickers(): Promise<void> {
  console.log('🔄 Atualizando tickers...')
  try {
    const useCase = new FetchTickersAndUpdate()
    await useCase.execute()
    console.log('✅ Atualização concluída com sucesso.')
  } catch (error) {
    console.error('❌ Erro ao atualizar tickers:', error)
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // 🔹 Executa imediatamente ao iniciar
  fetchAndUpdateTickers()

  // 🔹 Agendar a cada 24 horas (86.400.000 ms)
  const tickerUpdateInterval = setInterval(fetchAndUpdateTickers, 24 * 60 * 60 * 1000)

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      clearInterval(tickerUpdateInterval) // Limpar o intervalo quando o app for fechado
      app.quit()
    }
  })
})
