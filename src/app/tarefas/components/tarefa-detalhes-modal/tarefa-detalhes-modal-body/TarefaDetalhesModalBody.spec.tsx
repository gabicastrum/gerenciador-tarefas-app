import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TarefaResponseDTO } from '@/types/tarefas'

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

jest.mock('@/components/ui/toast', () => ({
  Toast: ({ message, onClose }: any) => (
    <div data-testid="toast" role="alert">
      {message}
      <button onClick={onClose}>Close</button>
    </div>
  ),
}))

import { TarefaDetalhesModalBody } from './TarefaDetalhesModalBody'
import { patchTarefa } from '@/lib/api/tarefas.api'

describe('TarefaDetalhesModalBody', () => {
  const tarefaBaseMock: TarefaResponseDTO = {
    id: 1,
    titulo: 'Título original',
    descricao: 'Descrição original',
    statusTarefa: 'PENDENTE',
    dataCriacao: '2026-04-16T10:00:00.000Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza título, descrição, status e data formatada pt-BR', () => {
    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} />)

    expect(screen.getByText('Título original')).toBeInTheDocument()
    expect(screen.getByText('Descrição original')).toBeInTheDocument()
    expect(screen.getByTestId('status-badge')).toHaveTextContent('PENDENTE')

    const data = new Date(tarefaBaseMock.dataCriacao).toLocaleDateString('pt-BR')
    expect(screen.getByText(data)).toBeInTheDocument()

    expect(screen.getByText('Em breve...')).toBeInTheDocument()
  })

  it('quando não há descrição, mostra placeholder "Clique para adicionar descrição"', () => {
    const tarefaSemDesc: TarefaResponseDTO = { ...tarefaBaseMock, descricao: '' }

    render(<TarefaDetalhesModalBody tarefa={tarefaSemDesc} />)

    expect(screen.getByText('Clique para adicionar descrição')).toBeInTheDocument()
  })

  it('ao clicar no título, entra em modo de edição e mostra input', () => {
    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} />)

    fireEvent.click(screen.getByTestId('dialog-title'))

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('Título original')
  })

  it('salva o título no Enter: chama patchTarefa e onAtualizar', async () => {
    ;(patchTarefa as jest.Mock).mockResolvedValueOnce({})

    const onAtualizar = jest.fn()
    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} onAtualizar={onAtualizar} />)

    fireEvent.click(screen.getByTestId('dialog-title'))

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Novo título' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(patchTarefa).toHaveBeenCalledTimes(1)
      expect(patchTarefa).toHaveBeenCalledWith(1, { titulo: 'Novo título' })
    })

    expect(onAtualizar).toHaveBeenCalledTimes(1)
    expect(onAtualizar).toHaveBeenCalledWith({
      ...tarefaBaseMock,
      titulo: 'Novo título',
    })
  })

  it('salva o título no blur: chama patchTarefa', async () => {
    ;(patchTarefa as jest.Mock).mockResolvedValueOnce({})

    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} />)

    fireEvent.click(screen.getByTestId('dialog-title'))

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Outro título' } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(patchTarefa).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ titulo: expect.stringContaining('Outro') }),
      )
    })
  })

  it('não salva se o título for só espaços: mostra erro e mantém edição', async () => {
    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} />)

    fireEvent.click(screen.getByTestId('dialog-title'))

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.blur(input)

    expect(patchTarefa).not.toHaveBeenCalled()

    expect(await screen.findByText('Título é obrigatório.')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('Escape cancela a edição do título e restaura valor original sem chamar patch', () => {
    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} />)

    fireEvent.click(screen.getByTestId('dialog-title'))

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Título descartado' } })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(patchTarefa).not.toHaveBeenCalled()
    expect(screen.getByText('Título original')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Título descartado')).not.toBeInTheDocument()
  })

  it('não chama patchTarefa se o título não mudou (após trim)', async () => {
    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} />)

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
    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} onAtualizar={onAtualizar} />)

    fireEvent.click(screen.getByRole('button', { name: /descrição original/i }))

    const textarea = screen.getByRole('textbox')
    expect(textarea.tagName.toLowerCase()).toBe('textarea')

    fireEvent.change(textarea, { target: { value: 'Nova descrição' } })
    fireEvent.blur(textarea)

    await waitFor(() => {
      expect(patchTarefa).toHaveBeenCalledWith(1, { descricao: 'Nova descrição' })
    })

    expect(onAtualizar).toHaveBeenCalledWith({
      ...tarefaBaseMock,
      descricao: 'Nova descrição',
    })
  })

  it('abre edição de descrição via teclado (Enter) no "role=button"', () => {
    const tarefaSemDesc: TarefaResponseDTO = { ...tarefaBaseMock, descricao: '' }
    render(<TarefaDetalhesModalBody tarefa={tarefaSemDesc} />)

    const area = screen.getByTitle('Clique para editar a descrição')
    fireEvent.keyDown(area, { key: 'Enter' })

    const textarea = screen.getByRole('textbox')
    expect(textarea.tagName.toLowerCase()).toBe('textarea')
  })

  it('não chama onAtualizar quando patchTarefa falha (catch)', async () => {
    ;(patchTarefa as jest.Mock).mockRejectedValueOnce(new Error('falhou'))
    const onAtualizar = jest.fn()

    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} onAtualizar={onAtualizar} />)

    fireEvent.click(screen.getByTestId('dialog-title'))
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Novo título' } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(patchTarefa).toHaveBeenCalledTimes(1)
    })

    expect(onAtualizar).not.toHaveBeenCalled()
  })

  it('renderiza corretamente com status CONCLUIDA', () => {
    const tarefaConcluida: TarefaResponseDTO = { ...tarefaBaseMock, statusTarefa: 'CONCLUIDA' }
    render(<TarefaDetalhesModalBody tarefa={tarefaConcluida} />)

    expect(screen.getByTestId('status-badge')).toHaveTextContent('CONCLUIDA')
  })

  it('trata campo como string vazio quando propriedade não existe (linha 33)', async () => {
    ;(patchTarefa as jest.Mock).mockResolvedValueOnce({})

    const tarefaSemCampo = { ...tarefaBaseMock, descricao: undefined as any }
    const onAtualizar = jest.fn()
    render(<TarefaDetalhesModalBody tarefa={tarefaSemCampo} onAtualizar={onAtualizar} />)

    const area = screen.getByTitle('Clique para editar a descrição')
    fireEvent.click(area)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Nova descrição' } })
    fireEvent.blur(textarea)

    await waitFor(() => {
      expect(patchTarefa).toHaveBeenCalledWith(1, { descricao: 'Nova descrição' })
    })
  })

  it('limpa erro do título ao digitador (linha 79)', () => {
    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} />)

    fireEvent.click(screen.getByTestId('dialog-title'))

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.blur(input)

    expect(screen.getByText('Título é obrigatório.')).toBeInTheDocument()

    const inputComErro = screen.getByRole('textbox')
    fireEvent.change(inputComErro, { target: { value: 'Novo valor' } })

    expect(screen.queryByText('Título é obrigatório.')).not.toBeInTheDocument()
  })

  it('abre edição de descrição via teclado (Space) no "role=button" (linha 143)', () => {
    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} />)

    const area = screen.getByRole('button', { name: /descrição original/i })
    fireEvent.keyDown(area, { key: ' ' })

    const textarea = screen.getByRole('textbox')
    expect(textarea.tagName.toLowerCase()).toBe('textarea')
  })
})
