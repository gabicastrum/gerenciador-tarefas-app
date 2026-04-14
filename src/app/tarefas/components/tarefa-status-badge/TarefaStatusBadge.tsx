import { Badge } from '@/components/ui/badge'
import { StatusTarefa } from '@/types/tarefas'

export function TarefaStatusBadge({ status }: { status: StatusTarefa }) {
  if (status === 'CONCLUIDA') {
    return <Badge variant="secondary">Concluída</Badge>
  }

  if (status === 'PENDENTE') {
    return <Badge variant="outline">Pendente</Badge>
  }

  console.warn('Status desconhecido:', status)

  return <Badge variant="outline">{status}</Badge>
}
