import { Badge } from '@/components/ui/badge'
import { StatusTarefa } from '@/types/tarefas'

export function TarefaStatusBadge({ status }: { status: StatusTarefa }) {
  if (status === 'CONCLUIDA') {
    return (
      <Badge className="bg-green-500 text-white hover:bg-green-500 border-transparent">
        Concluída
      </Badge>
    )
  }

  return <Badge variant="outline">Pendente</Badge>
}
