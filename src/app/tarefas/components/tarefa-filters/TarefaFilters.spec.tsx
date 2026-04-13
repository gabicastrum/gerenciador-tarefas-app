import { TarefaFilters } from './TarefaFilters'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockPush = jest.fn()
const mockGet = jest.fn()
const mockToString = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({
    get: mockGet,
    toString: mockToString,
  }),
}))

describe('TarefaFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGet.mockReturnValue(null)
    mockToString.mockReturnValue('')
  })

  it('deve renderizar o campo de busca', () => {
    render(<TarefaFilters />)

    expect(screen.getByPlaceholderText('Buscar tarefa...')).toBeInTheDocument()
  })

  it('deve renderizar todos os botões de filtro', () => {
    render(<TarefaFilters />)

    expect(screen.getByText('Todas')).toBeInTheDocument()
    expect(screen.getByText('Pendente')).toBeInTheDocument()
    expect(screen.getByText('Concluída')).toBeInTheDocument()
  })

  it('deve marcar o botão "Todas" como ativo por padrão quando não há status na URL', () => {
    mockGet.mockReturnValue(null)
    render(<TarefaFilters />)

    const botaoTodas = screen.getByText('Todas')
    const botaoPendente = screen.getByText('Pendente')

    expect(botaoTodas.closest('button')).toHaveAttribute('data-variant', 'default')
    expect(botaoPendente.closest('button')).not.toHaveAttribute('data-variant', 'default')
  })

  it('deve marcar o botão correto como ativo quando há status na URL', () => {
    mockGet.mockImplementation((key: string) => (key === 'status' ? 'PENDENTE' : null))
    render(<TarefaFilters />)

    const botaoPendente = screen.getByText('Pendente')
    const botaoTodas = screen.getByText('Todas')

    expect(botaoPendente.closest('button')).toHaveClass('bg-primary') // variant="default"
    expect(botaoTodas.closest('button')).not.toHaveClass('bg-primary')
  })

  it('deve chamar router.push com status correto ao clicar em "Pendente"', async () => {
    const user = userEvent.setup()
    render(<TarefaFilters />)

    await user.click(screen.getByText('Pendente'))

    expect(mockPush).toHaveBeenCalledWith('?status=PENDENTE')
  })

  it('deve chamar router.push com status correto ao clicar em "Concluída"', async () => {
    const user = userEvent.setup()
    render(<TarefaFilters />)

    await user.click(screen.getByText('Concluída'))

    expect(mockPush).toHaveBeenCalledWith('?status=CONCLUIDA')
  })

  it('deve remover o parâmetro status ao clicar em "Todas"', async () => {
    const user = userEvent.setup()
    mockGet.mockImplementation((key: string) => (key === 'status' ? 'PENDENTE' : null))
    mockToString.mockReturnValue('status=PENDENTE')
    render(<TarefaFilters />)

    await user.click(screen.getByText('Todas'))

    expect(mockPush).toHaveBeenCalledWith('?')
  })

  it('deve remover o parâmetro page ao aplicar filtro de status', async () => {
    const user = userEvent.setup()
    mockToString.mockReturnValue('page=2')
    render(<TarefaFilters />)

    await user.click(screen.getByText('Pendente'))

    const chamada = mockPush.mock.calls[0][0] as string
    expect(chamada).not.toContain('page=')
    expect(chamada).toContain('status=PENDENTE')
  })

  it('deve preencher o campo de busca com o valor da URL', () => {
    mockGet.mockImplementation((key: string) => (key === 'busca' ? 'reunião' : null))
    render(<TarefaFilters />)

    const input = screen.getByPlaceholderText('Buscar tarefa...')
    expect(input).toHaveValue('reunião')
  })

  it('deve chamar router.push com parâmetro de busca ao digitar no input', async () => {
    const user = userEvent.setup()
    render(<TarefaFilters />)

    const input = screen.getByPlaceholderText('Buscar tarefa...')
    await user.type(input, 'teste')

    const ultimaChamada = mockPush.mock.calls.at(-1)[0] as string
    expect(ultimaChamada).toContain('busca=teste')
  })

  it('deve remover o parâmetro busca ao limpar o input', async () => {
    const user = userEvent.setup()
    mockGet.mockImplementation((key: string) => (key === 'busca' ? 'reunião' : null))
    mockToString.mockReturnValue('busca=reuni%C3%A3o')
    render(<TarefaFilters />)

    const input = screen.getByPlaceholderText('Buscar tarefa...')
    await user.clear(input)

    const ultimaChamada = mockPush.mock.calls.at(-1)[0] as string
    expect(ultimaChamada).not.toContain('busca=')
  })

  it('deve remover o parâmetro page ao aplicar busca', async () => {
    const user = userEvent.setup()
    mockToString.mockReturnValue('page=3')
    render(<TarefaFilters />)

    const input = screen.getByPlaceholderText('Buscar tarefa...')
    await user.type(input, 'a')

    const ultimaChamada = mockPush.mock.calls.at(-1)[0] as string
    expect(ultimaChamada).not.toContain('page=')
  })
})