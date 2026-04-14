import { TarefaFilters } from './components/tarefa-filters/TarefaFilters'
import { TarefaLista } from './components/tarefa-lista/TarefaLista'
import { TarefaCriarModal } from './components/tarefa-criar-modal/TarefaCriarModal'

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string; busca?: string }>
}

export default async function TarefasPage({ searchParams }: PageProps) {
  const { page, status, busca } = await searchParams

  const numeroPagina = Number(page ?? 1) - 1
  const statusFiltro = status ?? ''
  const buscaFiltro = busca ?? ''

  const url = new URL(`${process.env.API_URL}/tarefas`)
  url.searchParams.set('page', String(numeroPagina))
  url.searchParams.set('size', '5')
  if (statusFiltro) url.searchParams.set('status', statusFiltro)
  if (buscaFiltro) url.searchParams.set('busca', buscaFiltro)

  const data = await fetch(url.toString(), { cache: 'no-store' }).then((r) => r.json())

  return (
    <div className="container-default py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Tarefas</h1>
          <p className="text-sm text-text/50 mt-1">{data.totalElementos} tarefas encontradas</p>
        </div>
        <TarefaCriarModal />
      </div>

      <TarefaFilters />
      <TarefaLista
        tarefas={data.conteudo}
        totalPages={data.totalPaginas}
        currentPage={Number(page ?? 1)}
      />
    </div>
  )
}
