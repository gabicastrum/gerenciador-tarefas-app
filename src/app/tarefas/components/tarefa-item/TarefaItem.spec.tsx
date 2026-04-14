import { TarefaItem } from './TarefaItem'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TarefaResponseDTO } from '@/types/tarefas'

const refreshMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}))

jest.mock('../tarefa-status-badge/TarefaStatusBadge', () => ({
  TarefaStatusBadge: ({ status }: { status: string }) => (
    <span data-testid="tarefa-status-badge">{status}</span>
  ),
}))

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange, disabled }: any) => (
    <input
      type="checkbox"
      data-testid="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onCheckedChange(e.target.checked)}
    />
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
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('deve renderizar título, descrição e data', () => {
    render(<TarefaItem tarefa={tarefaMock} />)

    expect(screen.getByText('Implementar autenticação')).toBeInTheDocument()
    expect(screen.getByText('Criar fluxo de login com JWT')).toBeInTheDocument()
    expect(screen.getByText('15/03/2024')).toBeInTheDocument()
  })

  it('deve renderizar o status badge corretamente', () => {
    render(<TarefaItem tarefa={tarefaMock} />)

    const badge = screen.getByTestId('tarefa-status-badge')
    expect(badge).toHaveTextContent('PENDENTE')
  })

  it('deve iniciar checkbox desmarcado quando tarefa é PENDENTE', () => {
    render(<TarefaItem tarefa={tarefaMock} />)

    const checkbox = screen.getByTestId('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('deve iniciar checkbox marcado quando tarefa é CONCLUIDA', () => {
    render(<TarefaItem tarefa={{ ...tarefaMock, statusTarefa: 'CONCLUIDA' }} />)

    const checkbox = screen.getByTestId('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('deve enviar PATCH ao marcar como concluída', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true })

    render(<TarefaItem tarefa={tarefaMock} />)

    const checkbox = screen.getByTestId('checkbox')

    fireEvent.click(checkbox)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tarefas/1'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ statusTarefa: 'CONCLUIDA' }),
        }),
      )
    })

    expect(refreshMock).toHaveBeenCalled()
  })

  it('deve enviar PATCH ao desmarcar (voltar para PENDENTE)', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true })

    render(<TarefaItem tarefa={{ ...tarefaMock, statusTarefa: 'CONCLUIDA' }} />)

    const checkbox = screen.getByTestId('checkbox')

    fireEvent.click(checkbox)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tarefas/1'),
        expect.objectContaining({
          body: JSON.stringify({ statusTarefa: 'PENDENTE' }),
        }),
      )
    })
  })

  it('deve desabilitar checkbox durante carregamento', async () => {
    let resolvePromise: any
    ;(global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve
        }),
    )

    render(<TarefaItem tarefa={tarefaMock} />)

    const checkbox = screen.getByTestId('checkbox')

    fireEvent.click(checkbox)

    expect(checkbox).toBeDisabled()

    resolvePromise({ ok: true })

    await waitFor(() => {
      expect(checkbox).not.toBeDisabled()
    })
  })

  it('deve reverter estado do checkbox em caso de erro', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false })

    render(<TarefaItem tarefa={tarefaMock} />)

    const checkbox = screen.getByTestId('checkbox')

    fireEvent.click(checkbox)

    await waitFor(() => {
      expect(checkbox).not.toBeChecked()
    })
  })

  it('deve aplicar classe de risco quando concluída', () => {
    render(<TarefaItem tarefa={{ ...tarefaMock, statusTarefa: 'CONCLUIDA' }} />)

    const titulo = screen.getByText('Implementar autenticação')

    expect(titulo).toHaveClass('line-through')
  })

  it('deve manter truncate em título e descrição', () => {
    render(<TarefaItem tarefa={tarefaMock} />)

    const titulo = screen.getByText('Implementar autenticação')
    const descricao = screen.getByText('Criar fluxo de login com JWT')

    expect(titulo).toHaveClass('truncate')
    expect(descricao).toHaveClass('truncate')
  })
})
