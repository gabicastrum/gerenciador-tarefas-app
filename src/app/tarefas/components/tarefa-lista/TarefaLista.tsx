'use client'

import { useEffect, useState } from 'react'
import { TarefaItem } from '../tarefa-item/TarefaItem'
import { TarefaResponseDTO } from '@/types/tarefas'
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
const PARAMETRO_PAGINA = 'page'

export function TarefaLista({ tarefas: tarefasPropriedade = [], totalPages, currentPage }: Props) {
  const [tarefasListadas, setTarefasListadas] = useState<TarefaResponseDTO[]>(tarefasPropriedade)

  useEffect(() => {
    setTarefasListadas(tarefasPropriedade)
  }, [tarefasPropriedade])

  function manipularExclusaoTarefa(tarefaRemovida: TarefaResponseDTO) {
    setTarefasListadas((tarefasAnterior) =>
      tarefasAnterior.filter((tarefa) => tarefa.id !== tarefaRemovida.id),
    )
  }

  return (
    <div>
      {tarefasListadas.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">{MENSAGEM_NENHUMA_TAREFA}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {tarefasListadas.map((tarefa) => (
            <TarefaItem key={tarefa.id} tarefa={tarefa} onExcluir={manipularExclusaoTarefa} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={`?${PARAMETRO_PAGINA}=${currentPage - 1}`} />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, indice) => (
              <PaginationItem key={indice}>
                <PaginationLink
                  href={`?${PARAMETRO_PAGINA}=${indice + 1}`}
                  isActive={currentPage === indice + 1}
                >
                  {indice + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext href={`?${PARAMETRO_PAGINA}=${currentPage + 1}`} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
