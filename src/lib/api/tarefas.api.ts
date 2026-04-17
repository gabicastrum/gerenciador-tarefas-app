import { TarefaResponseDTO } from '@/types/tarefas'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const TIPO_CONTEUDO = 'application/json'

type PatchTarefaPayload = Partial<Pick<TarefaResponseDTO, 'titulo' | 'descricao' | 'statusTarefa'>>
type CreateTarefaPayload = Pick<TarefaResponseDTO, 'titulo' | 'descricao'>

function assertApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL não está definido.')
  }
  return API_BASE_URL
}

export async function createTarefa(payload: CreateTarefaPayload): Promise<TarefaResponseDTO> {
  const baseUrl = assertApiBaseUrl()

  const response = await fetch(`${baseUrl}/tarefas`, {
    method: 'POST',
    headers: { 'Content-Type': TIPO_CONTEUDO },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Falha ao criar tarefa (${response.status})`)
  }

  return response.json()
}

export async function patchTarefa(id: number, payload: PatchTarefaPayload): Promise<void> {
  const baseUrl = assertApiBaseUrl()

  const response = await fetch(`${baseUrl}/tarefas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': TIPO_CONTEUDO },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Falha ao atualizar tarefa (${response.status})`)
  }
}

export async function deleteTarefa(id: number): Promise<void> {
  const baseUrl = assertApiBaseUrl()

  const response = await fetch(`${baseUrl}/tarefas/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Falha ao excluir tarefa (${response.status})`)
  }
}
