'use client'

import { useMemo, useState } from 'react'

import { TarefaStatusBadge } from '../tarefa-status-badge/TarefaStatusBadge'
import { TarefaDetalhesModal } from '../tarefa-detalhes-modal/TarefaDetalhesModal'
import { DeleteConfirmButton } from '../../../../components/layout/delete-confirm-button/DeleteConfirmButton'

import { TarefaResponseDTO } from '@/types/tarefas'
import { patchTarefa, deleteTarefa } from '@/lib/api/tarefas.api'

import { Checkbox } from '@/components/ui/checkbox'

interface TarefaItemProps {
  tarefa: TarefaResponseDTO
  onExcluir?: (tarefa: TarefaResponseDTO) => void
}

export function TarefaItem({ tarefa: tarefaInicial, onExcluir }: TarefaItemProps) {
  const [tarefaAtual, setTarefaAtual] = useState(tarefaInicial)
  const [estaConcluida, setEstaConcluida] = useState(tarefaInicial.statusTarefa === 'CONCLUIDA')
  const [estaCarregando, setEstaCarregando] = useState(false)
  const [modalEstaAberto, setModalEstaAberto] = useState(false)

  const dataFormatada = useMemo(() => {
    return new Date(tarefaAtual.dataCriacao).toLocaleDateString('pt-BR')
  }, [tarefaAtual.dataCriacao])

  async function handleToggle(estaMarcado: boolean) {
    if (estaCarregando) return

    const novoStatus = estaMarcado ? 'CONCLUIDA' : 'PENDENTE'

    setEstaConcluida(estaMarcado)
    setEstaCarregando(true)

    try {
      await patchTarefa(tarefaAtual.id, { statusTarefa: novoStatus })
      setTarefaAtual((prev) => ({ ...prev, statusTarefa: novoStatus }))
    } catch {
      setEstaConcluida(!estaMarcado)
    } finally {
      setEstaCarregando(false)
    }
  }

  async function excluirTarefa(tarefa: TarefaResponseDTO) {
    await deleteTarefa(tarefa.id)
    onExcluir?.(tarefa)
  }

  return (
    <>
      <div
        className="group flex items-center gap-4 py-3 px-5 bg-background border border-border rounded-xl hover:border-border/80 hover:shadow-sm transition-all cursor-pointer"
        onClick={() => setModalEstaAberto(true)}
      >
        <Checkbox
          className="shrink-0 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
          checked={estaConcluida}
          disabled={estaCarregando}
          onCheckedChange={(valor) => {
            if (typeof valor === 'boolean') {
              handleToggle(valor)
            }
          }}
          onClick={(evento) => evento.stopPropagation()}
        />

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              estaConcluida ? 'line-through text-text/40' : 'text-text'
            }`}
          >
            {tarefaAtual.titulo}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-text/40">{dataFormatada}</span>
            <TarefaStatusBadge status={tarefaAtual.statusTarefa} />
          </div>
        </div>

        <DeleteConfirmButton
          item={tarefaAtual}
          titulo="Excluir tarefa"
          descricao={`Tem certeza que deseja excluir "${tarefaAtual.titulo}"? Essa ação não pode ser desfeita.`}
          onConfirm={excluirTarefa}
        />
      </div>

      <TarefaDetalhesModal
        tarefa={tarefaAtual}
        aberto={modalEstaAberto}
        onFechar={() => setModalEstaAberto(false)}
        onAtualizar={(tarefaAtualizada) => {
          setTarefaAtual(tarefaAtualizada)
          setEstaConcluida(tarefaAtualizada.statusTarefa === 'CONCLUIDA')
        }}
      />
    </>
  )
}
