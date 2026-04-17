'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface DeleteConfirmButtonProps<T> {
  item: T
  titulo: string
  descricao?: string
  onConfirm: (item: T) => Promise<void> | void
}

const TEXTO_BOTAO_CANCELAR = 'Cancelar'
const TEXTO_BOTAO_EXCLUIR = 'Excluir'
const TEXTO_BOTAO_EXCLUINDO = 'Excluindo...'

export function DeleteConfirmButton<T>({
  item,
  titulo,
  descricao,
  onConfirm,
}: DeleteConfirmButtonProps<T>) {
  const [estaCarregando, setEstaCarregando] = useState(false)

  async function handleConfirm() {
    setEstaCarregando(true)
    try {
      await onConfirm(item)
    } finally {
      setEstaCarregando(false)
    }
  }

  return (
    <div onClick={(evento) => evento.stopPropagation()}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-text/20 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            disabled={estaCarregando}
          >
            <Trash2 className="size-4" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{titulo}</AlertDialogTitle>
            <AlertDialogDescription>{descricao}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>{TEXTO_BOTAO_CANCELAR}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleConfirm}
            >
              {estaCarregando ? TEXTO_BOTAO_EXCLUINDO : TEXTO_BOTAO_EXCLUIR}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
