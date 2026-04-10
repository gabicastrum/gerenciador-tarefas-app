export type StatusTarefa = 'PENDENTE' | 'CONCLUIDA'

export interface TarefaResponseDTO {
  id: number
  titulo: string
  descricao: string
  statusTarefa: StatusTarefa
  dataCriacao: string
}

export interface TarefaPageResponse {
  conteudo: TarefaResponseDTO[]
  pagina: number
  tamanho: number
  totalElementos: number
  totalPaginas: number
}