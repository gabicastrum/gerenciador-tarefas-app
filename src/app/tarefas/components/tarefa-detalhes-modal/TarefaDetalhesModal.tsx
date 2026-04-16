'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { TarefaResponseDTO } from '@/types/tarefas'
import { TarefaDetalhesModalBody } from './tarefa-detalhes-modal-body/TarefaDetalhesModalBody'

interface Props {
  tarefa: TarefaResponseDTO
  aberto: boolean
  onFechar: () => void
  onAtualizar?: (tarefa: TarefaResponseDTO) => void
}

export function TarefaDetalhesModal({ tarefa, aberto, onFechar, onAtualizar }: Props) {
  function handleOpenChange(estaAberto: boolean) {
    if (!estaAberto) onFechar()
  }

  return (
    <Dialog open={aberto} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md w-full bg-white border shadow-2xl">
        {aberto ? (
          <TarefaDetalhesModalBody
            key={`${tarefa.id}:open`}
            tarefa={tarefa}
            onAtualizar={onAtualizar}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
