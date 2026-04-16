import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock do dialog (Radix/shadcn) SEM perder handlers (onClick etc)
jest.mock('@/components/ui/dialog', () => ({
  DialogHeader: ({ children, ...props }: any) => (
    <div data-testid="dialog-header" {...props}>
      {children}
    </div>
  ),
  DialogTitle: ({ children, ...props }: any) => (
    <h2 data-testid="dialog-title" {...props}>
      {children}
    </h2>
  ),
}))

jest.mock('lucide-react', () => ({
  PencilLine: (props: any) => <svg data-testid="pencil-icon" {...props} />,
}))

jest.mock('@/app/tarefas/components/tarefa-status-badge/TarefaStatusBadge', () => ({
  TarefaStatusBadge: ({ status }: any) => <div data-testid="status-badge">{String(status)}</div>,
}))

jest.mock('@/lib/api/tarefas.api', () => ({
  patchTarefa: jest.fn(),
}))

import { TarefaDetalhesModalBody } from './TarefaDetalhesModalBody'
import { patchTarefa } from '@/lib/api/tarefas.api'

describe('TarefaDetalhesModalBody', () => {
  const baseTarefa: any = {
    id: 'tarefa-1',
    titulo: 'Título original',
    descricao: 'Descrição original',
    statusTarefa: 'ABERTA',
    dataCriacao: '2026-04-16T10:00:00.000Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza título, descrição, status e data formatada pt-BR', () => {
    render(<TarefaDetalhesModalBody tarefa={baseTarefa} />)

    expect(screen.getByText('Título original')).toBeInTheDocument()
    expect(screen.getByText('Descrição original')).toBeInTheDocument()
    expect(screen.getByTestId('status-badge')).toHaveTextContent('ABERTA')

    const data = new Date(baseTarefa.dataCriacao).toLocaleDateString('pt-BR')
    expect(screen.getByText(data)).toBeInTheDocument()

    expect(screen.getByText('Não definido')).toBeInTheDocument()
  })

  it('quando não há descrição, mostra placeholder "Clique para adicionar descrição"', () => {
    const tarefaSemDesc = { ...baseTarefa, descricao: '' }

    render(<TarefaDetalhesModalBody tarefa={tarefaSemDesc} />)

    expect(screen.getByText('Clique para adicionar descrição')).toBeInTheDocument()
  })

  it('ao clicar no título, entra em modo de edição e mostra input', () => {
    render(<TarefaDetalhesModalBody tarefa={baseTarefa} />)

    // clicar no título (DialogTitle) — agora funciona porque o mock repassa onClick
    fireEvent.click(screen.getByTestId('dialog-title'))

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('Título original')
  })

  it('salva o título no Enter: chama patchTarefa e onAtualizar', async () => {
    ;(patchTarefa as jest.Mock).mockResolvedValueOnce({})

    const onAtualizar = jest.fn()
    render(<TarefaDetalhesModalBody tarefa={baseTarefa} onAtualizar={onAtualizar} />)

    fireEvent.click(screen.getByTestId('dialog-title'))

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Novo título' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(patchTarefa).toHaveBeenCalledTimes(1)
      expect(patchTarefa).toHaveBeenCalledWith('tarefa-1', { titulo: 'Novo título' })
    })

    expect(onAtualizar).toHaveBeenCalledTimes(1)
    expect(onAtualizar).toHaveBeenCalledWith({
      ...baseTarefa,
      titulo: 'Novo título',
    })
  })

  it('salva o título no blur: chama patchTarefa', async () => {
    ;(patchTarefa as jest.Mock).mockResolvedValueOnce({})

    render(<TarefaDetalhesModalBody tarefa={baseTarefa} />)

    fireEvent.click(screen.getByTestId('dialog-title'))

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Outro t��tulo' } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(patchTarefa).toHaveBeenCalledWith(
        'tarefa-1',
        expect.objectContaining({ titulo: expect.stringContaining('Outro') }),
      )
    })
  })

  it('não salva se o título for só espaços: mostra erro e mantém edição', async () => {
    render(<TarefaDetalhesModalBody tarefa={baseTarefa} />)

    fireEvent.click(screen.getByTestId('dialog-title'))

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.blur(input)

    expect(patchTarefa).not.toHaveBeenCalled()

    expect(await screen.findByText('Título é obrigatório.')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('Escape cancela a edição do título e restaura valor original sem chamar patch', () => {
    render(<TarefaDetalhesModalBody tarefa={baseTarefa} />)

    fireEvent.click(screen.getByTestId('dialog-title'))

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Título descartado' } })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(patchTarefa).not.toHaveBeenCalled()
    expect(screen.getByText('Título original')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Título descartado')).not.toBeInTheDocument()
  })

  it('não chama patchTarefa se o título não mudou (após trim)', async () => {
    render(<TarefaDetalhesModalBody tarefa={baseTarefa} />)

    fireEvent.click(screen.getByTestId('dialog-title'))

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '  Título original  ' } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(patchTarefa).not.toHaveBeenCalled()
    })
  })

  it('ao clicar na descrição, entra em modo edição e mostra textarea; no blur salva', async () => {
    ;(patchTarefa as jest.Mock).mockResolvedValueOnce({})

    const onAtualizar = jest.fn()
    render(<TarefaDetalhesModalBody tarefa={baseTarefa} onAtualizar={onAtualizar} />)

    // A descrição clicável é um role="button"
    fireEvent.click(screen.getByRole('button', { name: /descrição original/i }))

    const textarea = screen.getByRole('textbox')
    expect(textarea.tagName.toLowerCase()).toBe('textarea')

    fireEvent.change(textarea, { target: { value: 'Nova descrição' } })
    fireEvent.blur(textarea)

    await waitFor(() => {
      expect(patchTarefa).toHaveBeenCalledWith('tarefa-1', { descricao: 'Nova descrição' })
    })

    expect(onAtualizar).toHaveBeenCalledWith({
      ...baseTarefa,
      descricao: 'Nova descrição',
    })
  })

  it('abre edição de descrição via teclado (Enter) no "role=button"', () => {
    const tarefaSemDesc = { ...baseTarefa, descricao: '' }
    render(<TarefaDetalhesModalBody tarefa={tarefaSemDesc} />)

    const area = screen.getByTitle('Clique para editar a descrição')
    fireEvent.keyDown(area, { key: 'Enter' })

    const textarea = screen.getByRole('textbox')
    expect(textarea.tagName.toLowerCase()).toBe('textarea')
  })

  it('não chama onAtualizar quando patchTarefa falha (catch)', async () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(patchTarefa as jest.Mock).mockRejectedValueOnce(new Error('falhou'))

    const onAtualizar = jest.fn()
    render(<TarefaDetalhesModalBody tarefa={baseTarefa} onAtualizar={onAtualizar} />)

    fireEvent.click(screen.getByTestId('dialog-title'))

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Novo título' } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(patchTarefa).toHaveBeenCalledTimes(1)
    })
    expect(onAtualizar).not.toHaveBeenCalled()

    errSpy.mockRestore()
  })
})
