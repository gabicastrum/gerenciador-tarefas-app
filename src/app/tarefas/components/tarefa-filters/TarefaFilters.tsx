'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

const OPCOES_FILTRO_STATUS = [
  { label: 'Todas', valor: '' },
  { label: 'Pendente', valor: 'PENDENTE' },
  { label: 'Concluída', valor: 'CONCLUIDA' },
]

const PARAMETRO_STATUS = 'status'
const PARAMETRO_BUSCA = 'busca'
const PARAMETRO_PAGINA = 'page'
const PLACEHOLDER_BUSCA = 'Buscar tarefa...'

export function TarefaFilters() {
  const router = useRouter()
  const parametrosBusca = useSearchParams()
  const statusSelecionado = parametrosBusca.get(PARAMETRO_STATUS) ?? ''

  function aplicarFiltroStatus(statusFiltro: string) {
    const parametrosAtualizados = new URLSearchParams(parametrosBusca.toString())
    if (statusFiltro) {
      parametrosAtualizados.set(PARAMETRO_STATUS, statusFiltro)
    } else {
      parametrosAtualizados.delete(PARAMETRO_STATUS)
    }
    parametrosAtualizados.delete(PARAMETRO_PAGINA)
    router.push(`?${parametrosAtualizados.toString()}`)
  }

  function aplicarBuscaTexto(eventoMudancaInput: React.ChangeEvent<HTMLInputElement>) {
    const parametrosAtualizados = new URLSearchParams(parametrosBusca.toString())
    if (eventoMudancaInput.target.value) {
      parametrosAtualizados.set(PARAMETRO_BUSCA, eventoMudancaInput.target.value)
    } else {
      parametrosAtualizados.delete(PARAMETRO_BUSCA)
    }
    parametrosAtualizados.delete(PARAMETRO_PAGINA)
    router.push(`?${parametrosAtualizados.toString()}`)
  }

  return (
    <div className="flex gap-2 flex-wrap mb-4">
      <Input
        placeholder={PLACEHOLDER_BUSCA}
        defaultValue={parametrosBusca.get(PARAMETRO_BUSCA) ?? ''}
        onChange={aplicarBuscaTexto}
        className="max-w-xs"
      />
      {OPCOES_FILTRO_STATUS.map((opcao) => (
        <Button
          key={opcao.valor}
          variant={statusSelecionado === opcao.valor ? 'default' : 'outline'}
          size="sm"
          onClick={() => aplicarFiltroStatus(opcao.valor)}
          className={statusSelecionado === opcao.valor ? 'text-white' : ''}
        >
          {opcao.label}
        </Button>
      ))}
    </div>
  )
}
