import { Badge } from '@/components/ui/badge'
import { StatusTarefa } from '@/types/tarefas'

const statusMap: Record<StatusTarefa, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDENTE:     { label: 'Pendente',     variant: 'outline' },
  CONCLUIDA:    { label: 'Concluída',    variant: 'secondary' },
}

export function TarefaStatusBadge({ status }: { status: StatusTarefa }) {
  const config = statusMap[status]

  if (!config) {
    console.warn('Status desconhecido:', status)
    return <Badge variant="outline">{status}</Badge>
  }

  const { label, variant } = config
  return <Badge variant={variant}>{label}</Badge>
}