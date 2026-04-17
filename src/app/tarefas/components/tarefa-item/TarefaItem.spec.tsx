import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import { TarefaItem } from './TarefaItem'
import * as tarefasApi from '@/lib/api/tarefas.api'
import { TarefaResponseDTO } from '@/types/tarefas'

const TITULO_TAREFA = 'Minha tarefa'
const TEXTO_EXCLUIR = 'Excluir'
const DESCRICAO_TAREFA = 'Descrição da minha tarefa'

const tarefaMock: TarefaResponseDTO = {
  id: 1,
  titulo: TITULO_TAREFA,
  descricao: DESCRICAO_TAREFA,
  statusTarefa: 'PENDENTE',
  dataCriacao: new Date().toISOString(),
}

jest.mock('@/lib/api/tarefas.api')

jest.mock('../tarefa-status-badge/TarefaStatusBadge', () => ({
  TarefaStatusBadge: () => <div data-testid="status-badge" />,
}))

jest.mock('../tarefa-detalhes-modal/TarefaDetalhesModal', () => ({
  TarefaDetalhesModal: ({ aberto }: { aberto: boolean }) =>
    aberto ? <div data-testid="modal" /> : null,
}))

jest.mock('../../../../components/layout/delete-confirm-button/DeleteConfirmButton', () => ({
  DeleteConfirmButton: ({ onConfirm, item }: any) => (
    <button onClick={() => onConfirm(item)}>{TEXTO_EXCLUIR}</button>
  ),
}))

describe('TarefaItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar título da tarefa', () => {
    render(<TarefaItem tarefa={tarefaMock} />)

    expect(screen.getByText(TITULO_TAREFA)).toBeInTheDocument()
  })

  it('deve abrir modal ao clicar no item', () => {
    render(<TarefaItem tarefa={tarefaMock} />)

    fireEvent.click(screen.getByText(TITULO_TAREFA))

    expect(screen.getByTestId('modal')).toBeInTheDocument()
  })

  it('deve alterar status para CONCLUIDA ao marcar checkbox', async () => {
    ;(tarefasApi.patchTarefa as jest.Mock).mockResolvedValueOnce({})

    render(<TarefaItem tarefa={tarefaMock} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    await waitFor(() => {
      expect(tarefasApi.patchTarefa).toHaveBeenCalledWith(1, {
        statusTarefa: 'CONCLUIDA',
      })
    })
  })

  it('deve reverter status caso API falhe', async () => {
    ;(tarefasApi.patchTarefa as jest.Mock).mockRejectedValueOnce(new Error())

    render(<TarefaItem tarefa={tarefaMock} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    await waitFor(() => {
      expect(checkbox).not.toBeChecked()
    })
  })

  it('deve chamar onExcluir ao confirmar exclusão', async () => {
    const funcaoExcluir = jest.fn()
    ;(tarefasApi.deleteTarefa as jest.Mock).mockResolvedValueOnce({})

    render(<TarefaItem tarefa={tarefaMock} onExcluir={funcaoExcluir} />)

    fireEvent.click(screen.getByText(TEXTO_EXCLUIR))

    await waitFor(() => {
      expect(funcaoExcluir).toHaveBeenCalledWith(tarefaMock)
    })
  })

  it('deve chamar handleToggle apenas quando valor é boolean (linhas 96-99)', async () => {
    ;(tarefasApi.patchTarefa as jest.Mock).mockResolvedValueOnce({})

    render(<TarefaItem tarefa={tarefaMock} />)

    const checkbox = screen.getByRole('checkbox')

    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)

    await waitFor(() => {
      expect(tarefasApi.patchTarefa).toHaveBeenCalled()
    })
  })
})
