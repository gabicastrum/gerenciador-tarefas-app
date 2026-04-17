import { TarefaFilters } from './TarefaFilters'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockFuncaoRotear = jest.fn()
const mockFuncaoObterParametro = jest.fn()
const mockFuncaoConverterParaString = jest.fn()

const PLACEHOLDER_BUSCA_TAREFA = 'Buscar tarefa...'
const LABEL_FILTRO_TODAS = 'Todas'
const LABEL_FILTRO_PENDENTE = 'Pendente'
const LABEL_FILTRO_CONCLUIDA = 'Concluída'
const STATUS_PARAMETRO_URL = 'status'
const STATUS_PENDENTE = 'PENDENTE'
const STATUS_CONCLUIDA = 'CONCLUIDA'
const PARAMETRO_BUSCA_URL = 'busca'
const VALOR_BUSCA_TESTE = 'reunião'
const VALOR_BUSCA_DIGITADO = 'teste'
const PARAMETRO_PAGINA_URL = 'page'
const NUMERO_PAGINA_TESTE = '2'
const NUMERO_PAGINA_NOVA = '3'
const ATRIBUTO_VARIANTE_DADOS = 'data-variant'
const NOME_CLASSE_ATIVA = 'bg-primary'
const TEXTO_URL_COM_STATUS = '?status=PENDENTE'
const TEXTO_URL_COM_BUSCA = 'busca=teste'
const TEXTO_URL_VAZIO = '?'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockFuncaoRotear }),
  useSearchParams: () => ({
    get: mockFuncaoObterParametro,
    toString: mockFuncaoConverterParaString,
  }),
}))

describe('TarefaFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFuncaoObterParametro.mockReturnValue(null)
    mockFuncaoConverterParaString.mockReturnValue('')
  })

  it('deve renderizar o campo de busca', () => {
    render(<TarefaFilters />)

    expect(screen.getByPlaceholderText(PLACEHOLDER_BUSCA_TAREFA)).toBeInTheDocument()
  })

  it('deve renderizar todos os botões de filtro', () => {
    render(<TarefaFilters />)

    expect(screen.getByText(LABEL_FILTRO_TODAS)).toBeInTheDocument()
    expect(screen.getByText(LABEL_FILTRO_PENDENTE)).toBeInTheDocument()
    expect(screen.getByText(LABEL_FILTRO_CONCLUIDA)).toBeInTheDocument()
  })

  it('deve marcar o botão "Todas" como ativo por padrão quando não há status na URL', () => {
    mockFuncaoObterParametro.mockReturnValue(null)
    render(<TarefaFilters />)

    const botaoTodasOpcoes = screen.getByText(LABEL_FILTRO_TODAS)
    const botaoPendenteOpcoes = screen.getByText(LABEL_FILTRO_PENDENTE)

    expect(botaoTodasOpcoes.closest('button')).toHaveAttribute(ATRIBUTO_VARIANTE_DADOS, 'default')
    expect(botaoPendenteOpcoes.closest('button')).not.toHaveAttribute(
      ATRIBUTO_VARIANTE_DADOS,
      'default',
    )
  })

  it('deve marcar o botão correto como ativo quando há status na URL', () => {
    mockFuncaoObterParametro.mockImplementation((chaveParametro: string) =>
      chaveParametro === STATUS_PARAMETRO_URL ? STATUS_PENDENTE : null,
    )
    render(<TarefaFilters />)

    const botaoPendenteOpcoes = screen.getByText(LABEL_FILTRO_PENDENTE)
    const botaoTodasOpcoes = screen.getByText(LABEL_FILTRO_TODAS)

    expect(botaoPendenteOpcoes.closest('button')).toHaveClass(NOME_CLASSE_ATIVA)
    expect(botaoTodasOpcoes.closest('button')).not.toHaveClass(NOME_CLASSE_ATIVA)
  })

  it('deve chamar router.push com status correto ao clicar em "Pendente"', async () => {
    const usuarioSimulado = userEvent.setup()
    render(<TarefaFilters />)

    await usuarioSimulado.click(screen.getByText(LABEL_FILTRO_PENDENTE))

    expect(mockFuncaoRotear).toHaveBeenCalledWith(TEXTO_URL_COM_STATUS)
  })

  it('deve chamar router.push com status correto ao clicar em "Concluída"', async () => {
    const usuarioSimulado = userEvent.setup()
    render(<TarefaFilters />)

    await usuarioSimulado.click(screen.getByText(LABEL_FILTRO_CONCLUIDA))

    expect(mockFuncaoRotear).toHaveBeenCalledWith(`?status=${STATUS_CONCLUIDA}`)
  })

  it('deve remover o parâmetro status ao clicar em "Todas"', async () => {
    const usuarioSimulado = userEvent.setup()
    mockFuncaoObterParametro.mockImplementation((chaveParametro: string) =>
      chaveParametro === STATUS_PARAMETRO_URL ? STATUS_PENDENTE : null,
    )
    mockFuncaoConverterParaString.mockReturnValue(`status=${STATUS_PENDENTE}`)
    render(<TarefaFilters />)

    await usuarioSimulado.click(screen.getByText(LABEL_FILTRO_TODAS))

    expect(mockFuncaoRotear).toHaveBeenCalledWith(TEXTO_URL_VAZIO)
  })

  it('deve remover o parâmetro page ao aplicar filtro de status', async () => {
    const usuarioSimulado = userEvent.setup()
    mockFuncaoConverterParaString.mockReturnValue(`${PARAMETRO_PAGINA_URL}=${NUMERO_PAGINA_TESTE}`)
    render(<TarefaFilters />)

    await usuarioSimulado.click(screen.getByText(LABEL_FILTRO_PENDENTE))

    const chamadaRoteador = mockFuncaoRotear.mock.calls[0][0] as string
    expect(chamadaRoteador).not.toContain(`${PARAMETRO_PAGINA_URL}=`)
    expect(chamadaRoteador).toContain(`status=${STATUS_PENDENTE}`)
  })

  it('deve preencher o campo de busca com o valor da URL', () => {
    mockFuncaoObterParametro.mockImplementation((chaveParametro: string) =>
      chaveParametro === PARAMETRO_BUSCA_URL ? VALOR_BUSCA_TESTE : null,
    )
    render(<TarefaFilters />)

    const inputBusca = screen.getByPlaceholderText(PLACEHOLDER_BUSCA_TAREFA)
    expect(inputBusca).toHaveValue(VALOR_BUSCA_TESTE)
  })

  it('deve chamar router.push com parâmetro de busca ao digitar no input', async () => {
    const usuarioSimulado = userEvent.setup()
    render(<TarefaFilters />)

    const inputBusca = screen.getByPlaceholderText(PLACEHOLDER_BUSCA_TAREFA)
    await usuarioSimulado.type(inputBusca, VALOR_BUSCA_DIGITADO)

    const ultimaChamadaRoteador = mockFuncaoRotear.mock.calls.at(-1)[0] as string
    expect(ultimaChamadaRoteador).toContain(TEXTO_URL_COM_BUSCA)
  })

  it('deve remover o parâmetro busca ao limpar o input', async () => {
    const usuarioSimulado = userEvent.setup()
    mockFuncaoObterParametro.mockImplementation((chaveParametro: string) =>
      chaveParametro === PARAMETRO_BUSCA_URL ? VALOR_BUSCA_TESTE : null,
    )
    mockFuncaoConverterParaString.mockReturnValue(`busca=reuni%C3%A3o`)
    render(<TarefaFilters />)

    const inputBusca = screen.getByPlaceholderText(PLACEHOLDER_BUSCA_TAREFA)
    await usuarioSimulado.clear(inputBusca)

    const ultimaChamadaRoteador = mockFuncaoRotear.mock.calls.at(-1)[0] as string
    expect(ultimaChamadaRoteador).not.toContain(`${PARAMETRO_BUSCA_URL}=`)
  })

  it('deve remover o parâmetro page ao aplicar busca', async () => {
    const usuarioSimulado = userEvent.setup()
    mockFuncaoConverterParaString.mockReturnValue(`${PARAMETRO_PAGINA_URL}=${NUMERO_PAGINA_NOVA}`)
    render(<TarefaFilters />)

    const inputBusca = screen.getByPlaceholderText(PLACEHOLDER_BUSCA_TAREFA)
    await usuarioSimulado.type(inputBusca, 'a')

    const ultimaChamadaRoteador = mockFuncaoRotear.mock.calls.at(-1)[0] as string
    expect(ultimaChamadaRoteador).not.toContain(`${PARAMETRO_PAGINA_URL}=`)
  })
})
