declare global {
  interface Window {
    api: {
      request: (endpoint: string, options?: any) => Promise<any>
    }
    repositories: {
      ticker: {
        add: (ticker: any) => Promise<void>
        getAll: () => Promise<any>
        getById: (id: number) => Promise<any>
        getByStock: (stock: string) => Promise<any>
        update: (id: number, stock: any) => Promise<void>
        delete: (id: number) => Promise<void>
      }
    }
  }
}

export {}
