import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TarefaDetalhesModalBody } from '../tarefa-detalhes-modal/tarefa-detalhes-modal-body/TarefaDetalhesModalBody'
import { patchTarefa } from '@/lib/api/tarefas.api'

jest.mock('@/components/ui/dialog', () => ({
  DialogHeader: ({
    children,
    ...props
  }: {
    children?: React.ReactNode
    [key: string]: unknown
  }) => (
    <div data-testid="dialog-header" {...props}>
      {children}
    </div>
  ),
  DialogTitle: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <h2 data-testid="dialog-title" {...props}>
      {children}
    </h2>
  ),
}))

jest.mock('lucide-react', () => ({
  PencilLine: (props: { [key: string]: unknown }) => <svg data-testid="pencil-icon" {...props} />,
}))

jest.mock('@/app/tarefas/components/tarefa-status-badge/TarefaStatusBadge', () => ({
  TarefaStatusBadge: ({ status }: { status: unknown }) => (
    <div data-testid="status-badge">{String(status)}</div>
  ),
}))

jest.mock('@/lib/api/tarefas.api', () => ({
  patchTarefa: jest.fn(),
}))

const TITULO_ORIGINAL = 'Título original'
const DESCRICAO_ORIGINAL = 'Descrição original'
const NOVO_TITULO = 'Novo título'
const TITULO_INVALIDO = '   '
const TITULO_DESCARTADO = 'Título descartado'
const NOVA_DESCRICAO = 'Nova descrição'
const PLACEHOLDER_DESCRICAO = 'Clique para adicionar descrição'
const ERRO_TITULO_OBRIGATORIO = 'Título é obrigatório.'
const STATUS_ABERTA = 'ABERTA'

const tarefaBaseMock: any = {
  id: 1,
  titulo: TITULO_ORIGINAL,
  descricao: DESCRICAO_ORIGINAL,
  statusTarefa: STATUS_ABERTA,
  dataCriacao: '2026-04-16T10:00:00.000Z',
}

describe('TarefaDetalhesModalBody', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar corretamente os dados da tarefa', () => {
    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} />)

    expect(screen.getByText(TITULO_ORIGINAL)).toBeInTheDocument()
    expect(screen.getByText(DESCRICAO_ORIGINAL)).toBeInTheDocument()
    expect(screen.getByTestId('status-badge')).toHaveTextContent(STATUS_ABERTA)

    const dataFormatada = new Date(tarefaBaseMock.dataCriacao).toLocaleDateString('pt-BR')
    expect(screen.getByText(dataFormatada)).toBeInTheDocument()

    expect(screen.getByText('Não definido')).toBeInTheDocument()
  })

  it('deve exibir placeholder quando não houver descrição', () => {
    render(<TarefaDetalhesModalBody tarefa={{ ...tarefaBaseMock, descricao: '' }} />)

    expect(screen.getByText(PLACEHOLDER_DESCRICAO)).toBeInTheDocument()
  })

  it('deve entrar em modo edição ao clicar no título', () => {
    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} />)

    fireEvent.click(screen.getByText(TITULO_ORIGINAL))

    const campoInput = screen.getByRole('textbox')
    expect(campoInput).toHaveValue(TITULO_ORIGINAL)
  })

  it('deve salvar título ao pressionar Enter', async () => {
    ;(patchTarefa as jest.Mock).mockResolvedValueOnce({})

    const funcaoAtualizar = jest.fn()

    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} onAtualizar={funcaoAtualizar} />)

    fireEvent.click(screen.getByText(TITULO_ORIGINAL))
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: NOVO_TITULO } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(patchTarefa).toHaveBeenCalledWith(1, { titulo: NOVO_TITULO })
    })

    expect(funcaoAtualizar).toHaveBeenCalledWith({
      ...tarefaBaseMock,
      titulo: NOVO_TITULO,
    })
  })

  it('deve validar título obrigatório', async () => {
    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} />)

    fireEvent.click(screen.getByText(TITULO_ORIGINAL))
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: TITULO_INVALIDO } })
    fireEvent.blur(input)

    expect(patchTarefa).not.toHaveBeenCalled()
    expect(await screen.findByText(ERRO_TITULO_OBRIGATORIO)).toBeInTheDocument()
  })

  it('deve cancelar edição com Escape', () => {
    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} />)

    fireEvent.click(screen.getByText(TITULO_ORIGINAL))
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: TITULO_DESCARTADO } })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(screen.getByText(TITULO_ORIGINAL)).toBeInTheDocument()
    expect(patchTarefa).not.toHaveBeenCalled()
  })

  it('não deve salvar se o título não foi alterado', async () => {
    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} />)

    fireEvent.click(screen.getByText(TITULO_ORIGINAL))
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: `  ${TITULO_ORIGINAL}  ` } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(patchTarefa).not.toHaveBeenCalled()
    })
  })

  it('deve editar e salvar descrição corretamente', async () => {
    ;(patchTarefa as jest.Mock).mockResolvedValueOnce({})

    const funcaoAtualizar = jest.fn()

    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} onAtualizar={funcaoAtualizar} />)

    fireEvent.click(screen.getByText(DESCRICAO_ORIGINAL))

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: NOVA_DESCRICAO } })
    fireEvent.blur(textarea)

    await waitFor(() => {
      expect(patchTarefa).toHaveBeenCalledWith(1, {
        descricao: NOVA_DESCRICAO,
      })
    })

    expect(funcaoAtualizar).toHaveBeenCalledWith({
      ...tarefaBaseMock,
      descricao: NOVA_DESCRICAO,
    })
  })

  it('não deve chamar funcaoAtualizar em caso de erro na API', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(patchTarefa as jest.Mock).mockRejectedValueOnce(new Error('erro'))

    const funcaoAtualizar = jest.fn()

    render(<TarefaDetalhesModalBody tarefa={tarefaBaseMock} onAtualizar={funcaoAtualizar} />)

    fireEvent.click(screen.getByText(TITULO_ORIGINAL))
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: NOVO_TITULO } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(patchTarefa).toHaveBeenCalled()
    })

    expect(funcaoAtualizar).not.toHaveBeenCalled()
  })
})
