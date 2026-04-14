import { TarefaCriarModal } from './TarefaCriarModal'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const refreshMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}))

describe('TarefaCriarModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('deve renderizar o trigger do modal', () => {
    render(<TarefaCriarModal />)

    expect(screen.getByRole('button', { name: /nova tarefa/i })).toBeInTheDocument()
  })

  it('deve abrir modal ao clicar no trigger', () => {
    render(<TarefaCriarModal />)

    fireEvent.click(screen.getByRole('button', { name: /nova tarefa/i }))

    expect(screen.getByText(/preencha os campos abaixo/i)).toBeInTheDocument()
  })

  it('não deve submeter sem título', async () => {
    render(<TarefaCriarModal />)

    fireEvent.click(screen.getByRole('button', { name: /nova tarefa/i }))
    fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }))

    expect(await screen.findByText(/o título é obrigatório/i)).toBeInTheDocument()

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('deve atualizar o input de título', () => {
    render(<TarefaCriarModal />)

    fireEvent.click(screen.getByRole('button', { name: /nova tarefa/i }))

    const input = screen.getByPlaceholderText(/revisar documentação/i)

    fireEvent.change(input, { target: { value: 'Minha tarefa' } })

    expect(input).toHaveValue('Minha tarefa')
  })

  it('deve enviar requisição ao criar tarefa com sucesso', async () => {
    const onCriadaMock = jest.fn()

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, titulo: 'Minha tarefa' }),
    })

    render(<TarefaCriarModal onCriada={onCriadaMock} />)

    fireEvent.click(screen.getByRole('button', { name: /nova tarefa/i }))

    const input = screen.getByPlaceholderText(/revisar documentação/i)

    fireEvent.change(input, { target: { value: 'Minha tarefa' } })

    fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    expect(onCriadaMock).toHaveBeenCalled()
    expect(refreshMock).toHaveBeenCalled()
  })

  it('deve mostrar erro quando API falha', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    })

    render(<TarefaCriarModal />)

    fireEvent.click(screen.getByRole('button', { name: /nova tarefa/i }))

    const input = screen.getByPlaceholderText(/revisar documentação/i)

    fireEvent.change(input, { target: { value: 'Minha tarefa' } })

    fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }))

    expect(await screen.findByText(/não foi possível criar a tarefa/i)).toBeInTheDocument()
  })

  it('deve fechar modal ao clicar em cancelar', () => {
    render(<TarefaCriarModal />)

    fireEvent.click(screen.getByRole('button', { name: /nova tarefa/i }))

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(screen.queryByText(/preencha os campos abaixo/i)).not.toBeInTheDocument()
  })
})
