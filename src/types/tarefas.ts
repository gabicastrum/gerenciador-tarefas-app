export type StatusTarefa = 'PENDENTE' | 'CONCLUIDA'

export interface TarefaResponseDTO {
  id: number
  titulo: string
  descricao: string
  statusTarefa: StatusTarefa
  dataCriacao: string
}