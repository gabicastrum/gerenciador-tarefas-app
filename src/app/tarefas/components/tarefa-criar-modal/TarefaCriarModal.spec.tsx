import { createTarefa } from '@/lib/api/tarefas.api'
import { TarefaCriarModal } from './TarefaCriarModal'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const refreshMock = jest.fn()

const LABEL_BOTAO_NOVA_TAREFA = /nova tarefa/i
const LABEL_BOTAO_CRIAR_TAREFA = /criar tarefa/i
const LABEL_BOTAO_CANCELAR = /cancelar/i
const TEXTO_DESCRICAO_MODAL = /preencha os campos abaixo/i
const PLACEHOLDER_TITULO = /revisar documentação/i
const MENSAGEM_ERRO_TITULO_OBRIGATORIO = /o título é obrigatório/i
const VALOR_TITULO_TESTE = 'Minha tarefa'
const CODIGO_RESPOSTA_SUCESSO_ID = 1

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}))

jest.mock('@/lib/api/tarefas.api', () => ({
  createTarefa: jest.fn(),
}))

describe('TarefaCriarModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

    expect(createTarefa).not.toHaveBeenCalled()
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

    ;(createTarefa as jest.Mock).mockResolvedValue({
      id: CODIGO_RESPOSTA_SUCESSO_ID,
      titulo: VALOR_TITULO_TESTE,
    })

    render(<TarefaCriarModal onCriada={funcaoTarefaCriadaMock} />)

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_NOVA_TAREFA }))

    const inputTitulo = screen.getByPlaceholderText(PLACEHOLDER_TITULO)
    fireEvent.change(inputTitulo, { target: { value: VALOR_TITULO_TESTE } })

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_CRIAR_TAREFA }))

    await waitFor(() => {
      expect(createTarefa).toHaveBeenCalled()
    })

    expect(funcaoTarefaCriadaMock).toHaveBeenCalledWith({
      id: CODIGO_RESPOSTA_SUCESSO_ID,
      titulo: VALOR_TITULO_TESTE,
    })
    expect(refreshMock).toHaveBeenCalled()
  })

  it('deve mostrar toast com erro quando API falha', async () => {
    const mensagemErroCustomizada = 'Erro ao conectar ao servidor'
    ;(createTarefa as jest.Mock).mockRejectedValue(new Error(mensagemErroCustomizada))

    render(<TarefaCriarModal />)

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_NOVA_TAREFA }))

    const inputTitulo = screen.getByPlaceholderText(PLACEHOLDER_TITULO)

    fireEvent.change(inputTitulo, { target: { value: VALOR_TITULO_TESTE } })

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_CRIAR_TAREFA }))

    await waitFor(
      () => {
        expect(screen.getByText(mensagemErroCustomizada)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  it('deve mostrar mensagem de erro padrão quando erro não tem mensagem', async () => {
    const mensagemPadrao = 'Erro ao processar solicitação. Tente novamente.'
    ;(createTarefa as jest.Mock).mockRejectedValue(new Error())

    render(<TarefaCriarModal />)

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_NOVA_TAREFA }))

    const inputTitulo = screen.getByPlaceholderText(PLACEHOLDER_TITULO)

    fireEvent.change(inputTitulo, { target: { value: VALOR_TITULO_TESTE } })

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_CRIAR_TAREFA }))

    await waitFor(
      () => {
        expect(screen.getByText(mensagemPadrao)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  it('deve fechar modal ao clicar em cancelar', () => {
    render(<TarefaCriarModal />)

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_NOVA_TAREFA }))

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_CANCELAR }))

    expect(screen.queryByText(TEXTO_DESCRICAO_MODAL)).not.toBeInTheDocument()
  })

  it('deve limpar mensagem de erro ao digitar após exibir erro', () => {
    render(<TarefaCriarModal />)

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_NOVA_TAREFA }))

    fireEvent.click(screen.getByRole('button', { name: LABEL_BOTAO_CRIAR_TAREFA }))

    expect(screen.getByText(MENSAGEM_ERRO_TITULO_OBRIGATORIO)).toBeInTheDocument()

    const inputTitulo = screen.getByPlaceholderText(PLACEHOLDER_TITULO)
    fireEvent.change(inputTitulo, { target: { value: 'Nova entrada' } })

    expect(screen.queryByText(MENSAGEM_ERRO_TITULO_OBRIGATORIO)).not.toBeInTheDocument()
  })
})
