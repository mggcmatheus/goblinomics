import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const repositories = {
  ticker: {
    add: (ticker: any): Promise<any> => ipcRenderer.invoke('ticker:add', ticker),
    getAll: (): Promise<any> => ipcRenderer.invoke('ticker:get-all'),
    getById: (id: number): Promise<any> => ipcRenderer.invoke('ticker:get-by-id', id),
    getByStock: (stock: string): Promise<any> => ipcRenderer.invoke('ticker:get-by-stock', stock),
    update: (id: number, ticker: any): Promise<any> =>
      ipcRenderer.invoke('ticker:update', id, ticker),
    delete: (id: number): Promise<any> => ipcRenderer.invoke('ticker:delete', id)
  }
}

contextBridge.exposeInMainWorld('electron', electronAPI)
contextBridge.exposeInMainWorld('repositories', repositories)
