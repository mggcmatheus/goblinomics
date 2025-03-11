import { FC, useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

type Ticker = {
  id?: number
  stock: string
  name: string
  sector: string
  type: string
  createdAt?: string
  updatedAt?: string
}

const StockList: FC = () => {
  const [tickerList, setTickerList] = useState<Ticker[]>()
  const [first, setFirst] = useState(0) // Controle de paginação

  const fetchTickers = async (): Promise<void> => {
    const result = await window.repositories.ticker.getAll()
    if (result) {
      setTickerList(result)
    }
  }

  // Carrega os tickers do banco ao iniciar
  useEffect(() => {
    fetchTickers()
  }, [])

  return (
    <div>
      <h5>Ações, Fundos e BDRs</h5>
      <DataTable
        value={tickerList}
        paginator
        rows={10}
        first={first}
        onPage={(e) => setFirst(e.first)} // Atualiza a página ao mudar a paginação
        dataKey="id"
        size="small"
      >
        <Column field="id" header="ID" />
        <Column field="stock" header="Código" />
        <Column field="name" header="Nome" />
        <Column field="sector" header="Setor" />
        <Column field="type" header="Tipo" />
      </DataTable>
    </div>
  )
}

export default StockList
