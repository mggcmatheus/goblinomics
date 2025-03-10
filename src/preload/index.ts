import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('repositories', {
      // 🔹 STOCKS
      createStock: (stock: any) => ipcRenderer.invoke('stock:create', stock),
      getStock: (stockId: number) => ipcRenderer.invoke('stock:read', stockId),
      updateStock: (stockId: number, stock: any) =>
        ipcRenderer.invoke('stock:update', stockId, stock),
      deleteStock: (stockId: number) => ipcRenderer.invoke('stock:delete', stockId),

      // 🔹 STOCK PRICES
      createStockPrice: (stockPrice: any) => ipcRenderer.invoke('stockPrice:create', stockPrice),
      getStockPrice: (priceId: number) => ipcRenderer.invoke('stockPrice:read', priceId),
      updateStockPrice: (priceId: number, stockPrice: any) =>
        ipcRenderer.invoke('stockPrice:update', priceId, stockPrice),
      deleteStockPrice: (priceId: number) => ipcRenderer.invoke('stockPrice:delete', priceId),

      // 🔹 PORTFOLIOS
      createPortfolio: (portfolio: any) => ipcRenderer.invoke('portfolio:create', portfolio),
      getPortfolio: (portfolioId: number) => ipcRenderer.invoke('portfolio:read', portfolioId),
      updatePortfolio: (portfolioId: number, portfolio: any) =>
        ipcRenderer.invoke('portfolio:update', portfolioId, portfolio),
      deletePortfolio: (portfolioId: number) => ipcRenderer.invoke('portfolio:delete', portfolioId),

      // 🔹 PORTFOLIO ASSETS
      createPortfolioAsset: (portfolioAsset: any) =>
        ipcRenderer.invoke('portfolioAsset:create', portfolioAsset),
      getPortfolioAsset: (portfolioAssetId: number) =>
        ipcRenderer.invoke('portfolioAsset:read', portfolioAssetId),
      updatePortfolioAsset: (portfolioAssetId: number, portfolioAsset: any) =>
        ipcRenderer.invoke('portfolioAsset:update', portfolioAssetId, portfolioAsset),
      deletePortfolioAsset: (portfolioAssetId: number) =>
        ipcRenderer.invoke('portfolioAsset:delete', portfolioAssetId)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
