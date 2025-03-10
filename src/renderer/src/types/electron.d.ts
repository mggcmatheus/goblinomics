declare global {
  interface Window {
    api: {
      request: (endpoint: string, options?: any) => Promise<any>
    }
  }
}

export {}
