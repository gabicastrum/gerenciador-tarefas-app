import { TarefaItem } from './TarefaItem'
import { render, screen } from '@testing-library/react'
import { TarefaResponseDTO } from '@/types/tarefas'

jest.mock('../tarefa-status-badge/TarefaStatusBadge', () => ({
  TarefaStatusBadge: ({ status }: { status: string }) => (
    <span data-testid="tarefa-status-badge">{status}</span>
  ),
}))

const tarefaMock: TarefaResponseDTO = {
  id: 1,
  titulo: 'Implementar autenticação',
  descricao: 'Criar fluxo de login com JWT',
  statusTarefa: 'PENDENTE',
  dataCriacao: '2024-03-15T10:00:00.000Z',
}

describe('TarefaItem', () => {
  it('deve renderizar o título da tarefa', () => {
    render(<TarefaItem tarefa={tarefaMock} />)

    expect(screen.getByText('Implementar autenticação')).toBeInTheDocument()
  })

  it('deve renderizar a descrição da tarefa', () => {
    render(<TarefaItem tarefa={tarefaMock} />)

    expect(screen.getByText('Criar fluxo de login com JWT')).toBeInTheDocument()
  })

  it('deve renderizar a data de criação formatada em pt-BR', () => {
    render(<TarefaItem tarefa={tarefaMock} />)

    expect(screen.getByText('15/03/2024')).toBeInTheDocument()
  })

  it('deve renderizar o componente TarefaStatusBadge com o status correto', () => {
    render(<TarefaItem tarefa={tarefaMock} />)

    const badge = screen.getByTestId('tarefa-status-badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('PENDENTE')
  })

  it('deve renderizar o indicador circular de status', () => {
    const { container } = render(<TarefaItem tarefa={tarefaMock} />)

    const circulo = container.querySelector('.rounded-full')
    expect(circulo).toBeInTheDocument()
  })

  it('deve renderizar corretamente com status CONCLUIDA', () => {
    const tarefaConcluida: TarefaResponseDTO = {
      ...tarefaMock,
      statusTarefa: 'CONCLUIDA',
    }
    render(<TarefaItem tarefa={tarefaConcluida} />)

    const badge = screen.getByTestId('tarefa-status-badge')
    expect(badge).toHaveTextContent('CONCLUIDA')
  })

  it('deve renderizar corretamente com descrição vazia', () => {
    const tarefaSemDescricao: TarefaResponseDTO = {
      ...tarefaMock,
      descricao: '',
    }
    render(<TarefaItem tarefa={tarefaSemDescricao} />)

    expect(screen.getByText('Implementar autenticação')).toBeInTheDocument()
  })

  it('deve truncar título longo sem quebrar o layout', () => {
    const tarefaTituloLongo: TarefaResponseDTO = {
      ...tarefaMock,
      titulo: 'A'.repeat(200),
    }
    render(<TarefaItem tarefa={tarefaTituloLongo} />)

    const titulo = screen.getByText('A'.repeat(200))
    expect(titulo).toHaveClass('truncate')
  })

  it('deve truncar descrição longa sem quebrar o layout', () => {
    const tarefaDescricaoLonga: TarefaResponseDTO = {
      ...tarefaMock,
      descricao: 'B'.repeat(200),
    }
    render(<TarefaItem tarefa={tarefaDescricaoLonga} />)

    const descricao = screen.getByText('B'.repeat(200))
    expect(descricao).toHaveClass('truncate')
  })
})