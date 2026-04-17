'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { TarefaItem } from '../tarefa-item/TarefaItem'
import { TarefaResponseDTO } from '@/types/tarefas'
import { Toast } from '@/components/ui/toast'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface Props {
  tarefas: TarefaResponseDTO[]
  totalPages: number
  currentPage: number
}

const MENSAGEM_NENHUMA_TAREFA = 'Nenhuma tarefa encontrada.'
const MENSAGEM_SUCESSO_DELETE = 'Tarefa deletada com sucesso!'
const MENSAGEM_ERRO_DELETE = 'Erro ao deletar tarefa'

const PARAMETRO_PAGINA = 'page'
const PARAMETRO_BUSCA = 'busca'

function construirHrefPaginacao(paginaAtual: number, parametrosBusca: URLSearchParams): string {
  const parametrosAtualizados = new URLSearchParams(parametrosBusca.toString())
  parametrosAtualizados.set(PARAMETRO_PAGINA, String(paginaAtual))
  return `?${parametrosAtualizados.toString()}`
}

export function TarefaLista({ tarefas: tarefasPropriedade = [], totalPages, currentPage }: Props) {
  const parametrosBusca = useSearchParams()
  const textoBuscaParametro = parametrosBusca.get(PARAMETRO_BUSCA) ?? ''

  const [tarefasListadas, setTarefasListadas] = useState<TarefaResponseDTO[]>(tarefasPropriedade)

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success')

  useEffect(() => {
    let tarefasProcessadas = tarefasPropriedade

    if (textoBuscaParametro.trim()) {
      const textoBuscaNormalizado = textoBuscaParametro.toLowerCase().trim()
      tarefasProcessadas = tarefasPropriedade.filter((tarefa) => {
        const tituloNormalizado = tarefa.titulo.toLowerCase()
        const descricaoNormalizado = (tarefa.descricao || '').toLowerCase()

        return (
          tituloNormalizado.includes(textoBuscaNormalizado) ||
          descricaoNormalizado.includes(textoBuscaNormalizado)
        )
      })
    }

    setTarefasListadas(tarefasProcessadas)
  }, [tarefasPropriedade, textoBuscaParametro])

  function handleDelete(tarefaRemovida: TarefaResponseDTO) {
    try {
      setTarefasListadas((tarefasAnterior) =>
        tarefasAnterior.filter((tarefa) => tarefa.id !== tarefaRemovida.id),
      )

      setToastMessage(MENSAGEM_SUCESSO_DELETE)
      setToastVariant('success')
    } catch {
      setToastMessage(MENSAGEM_ERRO_DELETE)
      setToastVariant('error')
    }
  }

  return (
    <div>
      {toastMessage && (
        <Toast
          message={toastMessage}
          variant={toastVariant}
          onClose={() => setToastMessage(null)}
        />
      )}

      {tarefasListadas.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">{MENSAGEM_NENHUMA_TAREFA}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {tarefasListadas.map((tarefa) => (
            <TarefaItem key={tarefa.id} tarefa={tarefa} onExcluir={handleDelete} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={construirHrefPaginacao(currentPage - 1, parametrosBusca)} />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, indice) => (
              <PaginationItem key={indice}>
                <PaginationLink
                  href={construirHrefPaginacao(indice + 1, parametrosBusca)}
                  isActive={currentPage === indice + 1}
                >
                  {indice + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext href={construirHrefPaginacao(currentPage + 1, parametrosBusca)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
