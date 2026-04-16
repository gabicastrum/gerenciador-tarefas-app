'use client'

import { useMemo, useState } from 'react'
import { TarefaStatusBadge } from '../tarefa-status-badge/TarefaStatusBadge'
import { TarefaDetalhesModal } from '../tarefa-detalhes-modal/TarefaDetalhesModal'
import { TarefaResponseDTO } from '@/types/tarefas'
import { Checkbox } from '@/components/ui/checkbox'
import { patchTarefa } from '@/lib/api/tarefas.api'

export function TarefaItem({ tarefa: tarefaInicial }: { tarefa: TarefaResponseDTO }) {
  const [tarefa, setTarefa] = useState(tarefaInicial)
  const [checked, setChecked] = useState(tarefaInicial.statusTarefa === 'CONCLUIDA')
  const [carregando, setCarregando] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)

  const data = useMemo(() => {
    return new Date(tarefa.dataCriacao).toLocaleDateString('pt-BR')
  }, [tarefa.dataCriacao])

  async function handleToggle(value: boolean) {
    if (carregando) return

    const novoStatus: TarefaResponseDTO['statusTarefa'] = value ? 'CONCLUIDA' : 'PENDENTE'

    setChecked(value)
    setCarregando(true)

    try {
      await patchTarefa(tarefa.id, { statusTarefa: novoStatus })
      setTarefa((prev) => ({ ...prev, statusTarefa: novoStatus }))
    } catch {
      setChecked(!value)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      <div
        className="flex items-start gap-4 py-4 px-5 hover:bg-white/5 transition-colors cursor-pointer"
        onClick={() => setModalAberto(true)}
      >
        <Checkbox
          className="mt-1 shrink-0 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
          checked={checked}
          disabled={carregando}
          onCheckedChange={(value) => {
            if (typeof value === 'boolean') handleToggle(value)
          }}
          onClick={(e) => e.stopPropagation()}
        />

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              checked ? 'line-through text-text/40' : 'text-text'
            }`}
          >
            {tarefa.titulo}
          </p>

          <p className="text-xs text-text/50 mt-0.5 truncate">{tarefa.descricao}</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-text/40">{data}</span>
            <TarefaStatusBadge status={tarefa.statusTarefa} />
          </div>
        </div>
      </div>

      <TarefaDetalhesModal
        tarefa={tarefa}
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onAtualizar={(tarefaAtualizada) => {
          setTarefa(tarefaAtualizada)
          setChecked(tarefaAtualizada.statusTarefa === 'CONCLUIDA')
        }}
      />
    </>
  )
}
