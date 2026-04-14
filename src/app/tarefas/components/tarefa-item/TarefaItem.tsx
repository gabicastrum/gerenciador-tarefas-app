'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TarefaStatusBadge } from '../tarefa-status-badge/TarefaStatusBadge'
import { TarefaResponseDTO } from '@/types/tarefas'
import { Checkbox } from '@/components/ui/checkbox'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export function TarefaItem({ tarefa }: { tarefa: TarefaResponseDTO }) {
  const router = useRouter()
  const data = new Date(tarefa.dataCriacao).toLocaleDateString('pt-BR')
  const [checked, setChecked] = useState(tarefa.statusTarefa === 'CONCLUIDA')
  const [carregando, setCarregando] = useState(false)

  async function handleToggle(value: boolean) {
    if (carregando) return

    const novoStatus = value ? 'CONCLUIDA' : 'PENDENTE'
    setChecked(value)
    setCarregando(true)

    try {
      const response = await fetch(`${API_BASE_URL}/tarefas/${tarefa.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusTarefa: novoStatus }),
      })

      if (!response.ok) throw new Error()

      router.refresh()
    } catch {
      setChecked(!value)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex items-start gap-4 py-4 px-5 hover:bg-white/5 transition-colors">
      <Checkbox
        className={`mt-1 shrink-0 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500`}
        checked={checked}
        disabled={carregando}
        onCheckedChange={handleToggle}
      />

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate transition-colors ${checked ? 'line-through text-text/40' : 'text-text'}`}
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
  )
}
