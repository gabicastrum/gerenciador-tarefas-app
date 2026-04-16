'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

const FILTROS = [
  { label: 'Todas', value: '' },
  { label: 'Pendente', value: 'PENDENTE' },
  { label: 'Concluída', value: 'CONCLUIDA' },
]

export function TarefaFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const statusAtual = params.get('status') ?? ''

  function aplicarFiltro(status: string) {
    const searchParams = new URLSearchParams(params.toString())
    if (status) {
      searchParams.set('status', status)
    } else {
      searchParams.delete('status')
    }
    searchParams.delete('page')
    router.push(`?${searchParams.toString()}`)
  }

  //TODO: aguardando implementar a funcionalidade no backend
  function aplicarBusca(element: React.ChangeEvent<HTMLInputElement>) {
    const searchParams = new URLSearchParams(params.toString())
    if (element.target.value) {
      searchParams.set('busca', element.target.value)
    } else {
      searchParams.delete('busca')
    }
    searchParams.delete('page')
    router.push(`?${searchParams.toString()}`)
  }

  return (
    <div className="flex gap-2 flex-wrap mb-4">
      <Input
        placeholder="Buscar tarefa..."
        defaultValue={params.get('busca') ?? ''}
        onChange={aplicarBusca}
        className="max-w-xs"
      />
      {FILTROS.map((f) => (
        <Button
          key={f.value}
          variant={statusAtual === f.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => aplicarFiltro(f.value)}
          className={statusAtual === f.value ? 'text-white' : ''}
        >
          {f.label}
        </Button>
      ))}
    </div>
  )
}
