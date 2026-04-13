import { TarefaStatusBadge } from '../tarefa-status-badge/TarefaStatusBadge'
import { TarefaResponseDTO } from '@/types/tarefas'

export function TarefaItem({ tarefa }: { tarefa: TarefaResponseDTO }) {
  const data = new Date(tarefa.dataCriacao).toLocaleDateString('pt-BR')

  return (
    <div className="flex items-start gap-4 py-4 px-5 hover:bg-white/5 transition-colors">
      <div className="mt-1 w-5 h-5 rounded-full border border-white/20 shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate">{tarefa.titulo}</p>
        <p className="text-xs text-text/50 mt-0.5 truncate">{tarefa.descricao}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-text/40">{data}</span>
          <TarefaStatusBadge status={tarefa.statusTarefa} />
        </div>
      </div>
    </div>
  )
}
