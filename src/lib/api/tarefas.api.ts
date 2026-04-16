import { TarefaResponseDTO } from '@/types/tarefas'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

type PatchTarefaPayload = Partial<Pick<TarefaResponseDTO, 'titulo' | 'descricao' | 'statusTarefa'>>

function assertApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL não está definido.')
  }
  return API_BASE_URL
}

export async function patchTarefa(id: number, payload: PatchTarefaPayload): Promise<void> {
  const baseUrl = assertApiBaseUrl()

  const response = await fetch(`${baseUrl}/tarefas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Falha ao atualizar tarefa (${response.status})`)
  }
}
