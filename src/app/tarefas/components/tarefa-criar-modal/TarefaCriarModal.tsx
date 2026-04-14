'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { TarefaResponseDTO } from '@/types/tarefas'

interface Props {
  onCriada?: (tarefa: TarefaResponseDTO) => void
}

const ESTADO_INICIAL = {
  titulo: '',
  descricao: '',
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export function TarefaCriarModal({ onCriada }: Props) {
  const router = useRouter()

  const [modalAberto, setModalAberto] = useState(false)
  const [formulario, setFormulario] = useState(ESTADO_INICIAL)
  const [estaCarregando, setEstaCarregando] = useState(false)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (mensagemErro) {
      setMensagemErro(null)
    }
  }

  async function handleSubmit() {
    if (!formulario.titulo.trim()) {
      setMensagemErro('O título é obrigatório.')
      return
    }

    setMensagemErro(null)
    setEstaCarregando(true)

    try {
      const response = await fetch(`${API_BASE_URL}/tarefas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formulario),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar tarefa.')
      }

      const novaTarefa: TarefaResponseDTO = await response.json()

      onCriada?.(novaTarefa)

      router.refresh()

      setFormulario(ESTADO_INICIAL)
      setModalAberto(false)
    } catch {
      setMensagemErro('Não foi possível criar a tarefa. Tente novamente.')
    } finally {
      setEstaCarregando(false)
    }
  }

  function handleOpenChange(estaAberto: boolean) {
    setModalAberto(estaAberto)

    if (!estaAberto) {
      setFormulario(ESTADO_INICIAL)
      setMensagemErro(null)
    }
  }

  return (
    <Dialog open={modalAberto} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="
            bg-primary 
            text-white 
            border border-gray-300
            hover:bg-[rgba(169,177,231,1)]
            active:scale-[0.98]
            transition-all
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary
          "
        >
          <Plus className="w-4 h-4 mr-1" />
          Nova tarefa
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-full overflow-hidden bg-white border border-gray-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">Nova tarefa</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Preencha os campos abaixo para criar uma nova tarefa.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="titulo">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="titulo"
              name="titulo"
              placeholder="Ex: Revisar documentação"
              value={formulario.titulo}
              onChange={handleChange}
              className={`
                w-full
                min-w-0
                bg-muted/50 
                border 
                text-foreground 
                placeholder:text-muted-foreground
                focus:ring-2 
                focus:ring-primary
                ${mensagemErro ? 'border-red-400 focus:ring-red-400' : 'border-border'}
              `}
            />
            {mensagemErro && <p className="text-sm text-red-500 mt-1">{mensagemErro}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              placeholder="Descreva a tarefa..."
              value={formulario.descricao}
              onChange={handleChange}
              rows={3}
              className="
                w-full
                min-w-0
                bg-muted/50 
                border-border 
                text-foreground 
                placeholder:text-muted-foreground
                focus:ring-2 
                focus:ring-primary
                resize-none
                max-h-32
                overflow-y-auto
                break-all
              "
            />
          </div>

          <div className="flex flex-col gap-1.5 opacity-60">
            <Label className="text-muted-foreground">Data de vencimento</Label>
            <Input
              placeholder="Em breve..."
              disabled
              className="
                bg-muted 
                border-border 
                text-muted-foreground 
                cursor-not-allowed
              "
            />
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={estaCarregando}
            className="
              border-border 
              text-foreground 
              hover:bg-muted 
              active:scale-[0.98] 
              transition-all
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
            "
          >
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={estaCarregando}
            className="
              bg-primary 
              text-white 
              border border-gray-300
              hover:bg-[rgba(169,177,231,1)]
              active:scale-[0.98]
              transition-all
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
            "
          >
            {estaCarregando ? 'Criando...' : 'Criar tarefa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
