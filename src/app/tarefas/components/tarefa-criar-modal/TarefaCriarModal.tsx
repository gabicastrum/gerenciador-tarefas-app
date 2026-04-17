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
import { createTarefa } from '@/lib/api/tarefas.api'

interface Props {
  onCriada?: (tarefa: TarefaResponseDTO) => void
}

const ESTADO_FORMULARIO_INICIAL = {
  titulo: '',
  descricao: '',
}

const MENSAGEM_ERRO_TITULO_OBRIGATORIO = 'O título é obrigatório.'
const MENSAGEM_ERRO_CRIAR_TAREFA = 'Não foi possível criar a tarefa. Tente novamente.'
const TEXTO_BOTAO_CRIANDO = 'Criando...'
const TEXTO_BOTAO_CRIAR = 'Criar tarefa'
const LABEL_TITULO = 'Título'
const LABEL_DESCRICAO = 'Descrição'
const PLACEHOLDER_TITULO = 'Ex: Revisar documentação'
const PLACEHOLDER_DESCRICAO = 'Descreva a tarefa...'
const LABEL_DATA_VENCIMENTO = 'Data de vencimento'
const PLACEHOLDER_DATA_VENCIMENTO = 'Em breve...'
const TEXTO_CANCELAR = 'Cancelar'
const TITULO_MODAL = 'Nova tarefa'
const DESCRICAO_MODAL = 'Preencha os campos abaixo para criar uma nova tarefa.'

export function TarefaCriarModal({ onCriada }: Props) {
  const router = useRouter()

  const [modalEstaAberto, setModalEstaAberto] = useState(false)
  const [formulario, setFormulario] = useState(ESTADO_FORMULARIO_INICIAL)
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
      setMensagemErro(MENSAGEM_ERRO_TITULO_OBRIGATORIO)
      return
    }

    setMensagemErro(null)
    setEstaCarregando(true)

    try {
      const novaTarefa = await createTarefa(formulario)

      onCriada?.(novaTarefa)

      router.refresh()

      setFormulario(ESTADO_FORMULARIO_INICIAL)
      setModalEstaAberto(false)
    } catch {
      setMensagemErro(MENSAGEM_ERRO_CRIAR_TAREFA)
    } finally {
      setEstaCarregando(false)
    }
  }

  function handleOpenChange(estaAberto: boolean) {
    setModalEstaAberto(estaAberto)

    if (!estaAberto) {
      setFormulario(ESTADO_FORMULARIO_INICIAL)
      setMensagemErro(null)
    }
  }

  return (
    <Dialog open={modalEstaAberto} onOpenChange={handleOpenChange}>
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
          <DialogTitle className="text-lg font-semibold text-foreground">
            {TITULO_MODAL}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {DESCRICAO_MODAL}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="titulo">
              {LABEL_TITULO} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="titulo"
              name="titulo"
              placeholder={PLACEHOLDER_TITULO}
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
            <Label htmlFor="descricao">{LABEL_DESCRICAO}</Label>
            <Textarea
              id="descricao"
              name="descricao"
              placeholder={PLACEHOLDER_DESCRICAO}
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
            <Label className="text-muted-foreground">{LABEL_DATA_VENCIMENTO}</Label>
            <Input
              placeholder={PLACEHOLDER_DATA_VENCIMENTO}
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
            {TEXTO_CANCELAR}
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
            {estaCarregando ? TEXTO_BOTAO_CRIANDO : TEXTO_BOTAO_CRIAR}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
