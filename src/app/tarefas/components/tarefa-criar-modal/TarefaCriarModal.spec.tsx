import { TarefaCriarModal } from './TarefaCriarModal'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const refreshMock = jest.fn()

const LABEL_BOTAO_NOVA_TAREFA = /nova tarefa/i
const LABEL_BOTAO_CRIAR_TAREFA = /criar tarefa/i
const LABEL_BOTAO_CANCELAR = /cancelar/i
const TEXTO_DESCRICAO_MODAL = /preencha os campos abaixo/i
const PLACEHOLDER_TITULO = /revisar documentação/i
const MENSAGEM_ERRO_TITULO_OBRIGATORIO = /o título é obrigatório/i
const MENSAGEM_ERRO_CRIAR_TAREFA = /não foi possível criar a tarefa/i
const VALOR_TITULO_TESTE = 'Minha tarefa'
const CODIGO_RESPOSTA_SUCESSO_ID = 1

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

    expect(screen.getByRole('button', { name: LABEL_BOTAO_NOVA_TAREFA })).toBeInTheDocument()
  })

  it('deve abrir modal ao clicar no trigger', () => {
    render(<TarefaCriarModal />)

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_NOVA_TAREFA }))

    expect(screen.getByText(TEXTO_DESCRICAO_MODAL)).toBeInTheDocument()
  })

  it('não deve submeter sem título', async () => {
    render(<TarefaCriarModal />)

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_NOVA_TAREFA }))
    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_CRIAR_TAREFA }))

    expect(await screen.findByText(MENSAGEM_ERRO_TITULO_OBRIGATORIO)).toBeInTheDocument()

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('deve atualizar o input de título', () => {
    render(<TarefaCriarModal />)

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_NOVA_TAREFA }))

    const inputTitulo = screen.getByPlaceholderText(PLACEHOLDER_TITULO)

    fireEvent.change(inputTitulo, { target: { value: VALOR_TITULO_TESTE } })

    expect(inputTitulo).toHaveValue(VALOR_TITULO_TESTE)
  })

  it('deve enviar requisição ao criar tarefa com sucesso', async () => {
    const funcaoTarefaCriadaMock = jest.fn()

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: CODIGO_RESPOSTA_SUCESSO_ID, titulo: VALOR_TITULO_TESTE }),
    })

    render(<TarefaCriarModal onCriada={funcaoTarefaCriadaMock} />)

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_NOVA_TAREFA }))

    const inputTitulo = screen.getByPlaceholderText(PLACEHOLDER_TITULO)

    fireEvent.change(inputTitulo, { target: { value: VALOR_TITULO_TESTE } })

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_CRIAR_TAREFA }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    expect(funcaoTarefaCriadaMock).toHaveBeenCalled()
    expect(refreshMock).toHaveBeenCalled()
  })

  it('deve mostrar erro quando API falha', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    })

    render(<TarefaCriarModal />)

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_NOVA_TAREFA }))

    const inputTitulo = screen.getByPlaceholderText(PLACEHOLDER_TITULO)

    fireEvent.change(inputTitulo, { target: { value: VALOR_TITULO_TESTE } })

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_CRIAR_TAREFA }))

    expect(await screen.findByText(MENSAGEM_ERRO_CRIAR_TAREFA)).toBeInTheDocument()
  })

  it('deve fechar modal ao clicar em cancelar', () => {
    render(<TarefaCriarModal />)

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_NOVA_TAREFA }))

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_CANCELAR }))

    expect(screen.queryByText(TEXTO_DESCRICAO_MODAL)).not.toBeInTheDocument()
  })
})
