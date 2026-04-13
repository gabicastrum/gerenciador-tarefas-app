import { TarefaItem } from '../tarefa-item/TarefaItem'
import { TarefaResponseDTO } from '@/types/tarefas'
import { Separator } from '@/components/ui/separator'
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

export function TarefaLista({ tarefas = [], totalPages, currentPage }: Props) {
  return (
    <div>
      <div className="border border-white/10 rounded-xl overflow-hidden">
        {tarefas.length === 0 ? (
          <p className="text-center text-sm text-text/40 py-12">Nenhuma tarefa encontrada.</p>
        ) : (
          tarefas.map((tarefa, i) => (
            <div key={tarefa.id}>
              <TarefaItem tarefa={tarefa} />
              {i < tarefas.length - 1 && <Separator className="bg-white/5" />}
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={`?page=${currentPage - 1}`} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href={`?page=${i + 1}`} isActive={currentPage === i + 1}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href={`?page=${currentPage + 1}`} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
