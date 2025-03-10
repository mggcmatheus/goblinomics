import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import StockRepository from './infra/repositories/stockRepository'
import StockPriceRepository from './infra/repositories/stockPriceRepository'
import PortfolioRepository from './infra/repositories/portfolioRepository'
import PortfolioAssetRepository from './infra/repositories/portfolioAssetRepository'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

const stockRepo = new StockRepository()
const stockPriceRepo = new StockPriceRepository()
const portfolioRepo = new PortfolioRepository()
const portfolioAssetRepo = new PortfolioAssetRepository()

// 🔹 STOCKS
ipcMain.handle('stock:create', async (_event, stock) => stockRepo.create(stock))
ipcMain.handle('stock:read', async (_event, stockId) => stockRepo.read(stockId))
ipcMain.handle('stock:update', async (_event, stockId, stock) => stockRepo.update(stockId, stock))
ipcMain.handle('stock:delete', async (_event, stockId) => stockRepo.delete(stockId))

// 🔹 STOCK PRICES
ipcMain.handle('stockPrice:create', async (_event, stockPrice) => stockPriceRepo.create(stockPrice))
ipcMain.handle('stockPrice:read', async (_event, priceId) => stockPriceRepo.read(priceId))
ipcMain.handle('stockPrice:update', async (_event, priceId, stockPrice) =>
  stockPriceRepo.update(priceId, stockPrice)
)
ipcMain.handle('stockPrice:delete', async (_event, priceId) => stockPriceRepo.delete(priceId))

// 🔹 PORTFOLIOS
ipcMain.handle('portfolio:create', async (_event, portfolio) => portfolioRepo.create(portfolio))
ipcMain.handle('portfolio:read', async (_event, portfolioId) => portfolioRepo.read(portfolioId))
ipcMain.handle('portfolio:update', async (_event, portfolioId, portfolio) =>
  portfolioRepo.update(portfolioId, portfolio)
)
ipcMain.handle('portfolio:delete', async (_event, portfolioId) => portfolioRepo.delete(portfolioId))

// 🔹 PORTFOLIO ASSETS
ipcMain.handle('portfolioAsset:create', async (_event, portfolioAsset) =>
  portfolioAssetRepo.create(portfolioAsset)
)
ipcMain.handle('portfolioAsset:read', async (_event, portfolioAssetId) =>
  portfolioAssetRepo.read(portfolioAssetId)
)
ipcMain.handle('portfolioAsset:update', async (_event, portfolioAssetId, portfolioAsset) =>
  portfolioAssetRepo.update(portfolioAssetId, portfolioAsset)
)
ipcMain.handle('portfolioAsset:delete', async (_event, portfolioAssetId) =>
  portfolioAssetRepo.delete(portfolioAssetId)
)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
