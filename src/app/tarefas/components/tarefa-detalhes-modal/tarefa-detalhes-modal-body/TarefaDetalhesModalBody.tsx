'use client'

import { useMemo, useState } from 'react'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TarefaStatusBadge } from '../../tarefa-status-badge/TarefaStatusBadge'
import { TarefaResponseDTO } from '@/types/tarefas'
import { PencilLine } from 'lucide-react'
import { patchTarefa } from '@/lib/api/tarefas.api'

export function TarefaDetalhesModalBody({
  tarefa,
  onAtualizar,
}: {
  tarefa: TarefaResponseDTO
  onAtualizar?: (tarefa: TarefaResponseDTO) => void
}) {
  const [editandoTitulo, setEditandoTitulo] = useState(false)
  const [editandoDescricao, setEditandoDescricao] = useState(false)

  const [tituloEditavel, setTituloEditavel] = useState(() => tarefa.titulo)
  const [descricaoEditavel, setDescricaoEditavel] = useState(() => tarefa.descricao || '')

  const [erroTitulo, setErroTitulo] = useState<string | null>(null)
  const tituloTrim = useMemo(() => tituloEditavel.trim(), [tituloEditavel])

  const dataCriacao = useMemo(() => {
    return new Date(tarefa.dataCriacao).toLocaleDateString('pt-BR')
  }, [tarefa.dataCriacao])

  const temDescricao = Boolean(tarefa.descricao && tarefa.descricao.trim().length > 0)

  async function atualizarCampo(campo: 'titulo' | 'descricao', valor: string) {
    const valorAtual = (tarefa[campo] || '').trim()
    const novoValor = valor.trim()
    if (novoValor === valorAtual) return

    try {
      await patchTarefa(tarefa.id, { [campo]: novoValor })

      onAtualizar?.({
        ...tarefa,
        [campo]: novoValor,
      })
    } catch {
      console.error('Erro ao atualizar tarefa')
    }
  }

  function finalizarEdicaoTitulo() {
    if (!tituloTrim) {
      setErroTitulo('Título é obrigatório.')
      setEditandoTitulo(true)
      return
    }

    setErroTitulo(null)
    setEditandoTitulo(false)
    atualizarCampo('titulo', tituloTrim)
  }

  return (
    <>
      <DialogHeader className="space-y-2">
        {editandoTitulo ? (
          <div className="space-y-1">
            <div className="relative">
              <input
                className={[
                  'w-full text-lg font-semibold outline-none rounded-md',
                  'bg-transparent',
                  'border px-2 py-1',
                  'focus:ring-2 focus:ring-ring/30',
                  erroTitulo ? 'border-destructive focus:ring-destructive/25' : 'border-input',
                ].join(' ')}
                value={tituloEditavel}
                autoFocus
                onChange={(e) => {
                  setTituloEditavel(e.target.value)
                  if (erroTitulo) setErroTitulo(null)
                }}
                onBlur={finalizarEdicaoTitulo}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    finalizarEdicaoTitulo()
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault()
                    setErroTitulo(null)
                    setTituloEditavel(tarefa.titulo)
                    setEditandoTitulo(false)
                  }
                }}
                aria-invalid={!!erroTitulo}
              />
            </div>

            {erroTitulo && <p className="text-xs text-destructive">{erroTitulo}</p>}
          </div>
        ) : (
          <DialogTitle
            className={[
              'text-lg font-semibold',
              'group/title inline-flex items-center gap-2',
              'cursor-pointer select-none',
              'leading-snug',
            ].join(' ')}
            onClick={() => setEditandoTitulo(true)}
            title="Clique para editar o título"
          >
            <span className="wrap-break-words">{tarefa.titulo}</span>
            <PencilLine className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover/title:opacity-100" />
          </DialogTitle>
        )}
      </DialogHeader>

      <div className="flex flex-col gap-5 py-2">
        <div className="bg-muted/40 rounded-lg p-3 border border-transparent focus-within:border-border focus-within:bg-muted/30 transition-colors">
          {editandoDescricao ? (
            <textarea
              className={[
                'w-full text-sm outline-none bg-transparent resize-none',
                'min-h-20',
                'leading-relaxed',
              ].join(' ')}
              value={descricaoEditavel}
              autoFocus
              onChange={(e) => setDescricaoEditavel(e.target.value)}
              onBlur={() => {
                setEditandoDescricao(false)
                atualizarCampo('descricao', descricaoEditavel)
              }}
              placeholder="Adicione uma descrição..."
            />
          ) : (
            <div
              className="group/desc flex items-start justify-between gap-3 cursor-pointer"
              onClick={() => setEditandoDescricao(true)}
              title="Clique para editar a descrição"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setEditandoDescricao(true)
              }}
            >
              <p
                className={[
                  'text-sm whitespace-pre-wrap wrap-break-words leading-relaxed flex-1',
                  temDescricao ? 'text-foreground' : 'text-muted-foreground/70 italic',
                ].join(' ')}
              >
                {tarefa.descricao || 'Clique para adicionar descrição'}
              </p>

              <PencilLine
                className={[
                  'h-4 w-4 mt-0.5 shrink-0 text-muted-foreground transition-opacity',
                  temDescricao
                    ? 'opacity-0 group-hover/desc:opacity-100'
                    : 'opacity-70 group-hover/desc:opacity-100',
                ].join(' ')}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Status</span>
            <TarefaStatusBadge status={tarefa.statusTarefa} />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Criada em</span>
            <p className="text-sm">{dataCriacao}</p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Vencimento
            </span>
            <p className="text-sm text-muted-foreground italic">Não definido</p>
          </div>
        </div>
      </div>
    </>
  )
}
