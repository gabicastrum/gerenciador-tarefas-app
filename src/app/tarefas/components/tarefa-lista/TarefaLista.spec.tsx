import { TarefaLista } from './TarefaLista'
import { render, screen, fireEvent } from '@testing-library/react'
import { TarefaResponseDTO } from '@/types/tarefas'

const MENSAGEM_NENHUMA_TAREFA = 'Nenhuma tarefa encontrada.'
const TESTID_TAREFA_ITEM = 'tarefa-item'
const TESTID_SEPARADOR = 'separator'
const TESTID_PAGINACAO_ANTERIOR = 'pagination-previous'
const TESTID_PAGINACAO_PROXIMO = 'pagination-next'
const LABEL_PAGINACAO_ANTERIOR = 'Anterior'
const LABEL_PAGINACAO_PROXIMO = 'Próximo'
const STATUS_TAREFA_PENDENTE = 'PENDENTE'
const STATUS_TAREFA_CONCLUIDA = 'CONCLUIDA'
const ATRIBUTO_HREF = 'href'
const ATRIBUTO_DADOS_ATIVO = 'data-active'
const VALOR_ATRIBUTO_ATIVO = 'true'
const VALOR_ATRIBUTO_INATIVO = 'false'

const tarefasMockBasicas: TarefaResponseDTO[] = [
  {
    id: 1,
    titulo: 'Tarefa 1',
    descricao: 'Desc 1',
    statusTarefa: STATUS_TAREFA_PENDENTE,
    dataCriacao: '2024-03-15T10:00:00.000Z',
  },
  {
    id: 2,
    titulo: 'Tarefa 2',
    descricao: 'Desc 2',
    statusTarefa: STATUS_TAREFA_CONCLUIDA,
    dataCriacao: '2024-03-16T10:00:00.000Z',
  },
  {
    id: 3,
    titulo: 'Tarefa 3',
    descricao: 'Desc 3',
    statusTarefa: STATUS_TAREFA_PENDENTE,
    dataCriacao: '2024-03-17T10:00:00.000Z',
  },
]

jest.mock('../tarefa-item/TarefaItem', () => ({
  TarefaItem: ({
    tarefa,
    onExcluir,
  }: {
    tarefa: TarefaResponseDTO
    onExcluir?: (t: TarefaResponseDTO) => void
  }) => (
    <div data-testid={TESTID_TAREFA_ITEM} onClick={() => onExcluir?.(tarefa)}>
      {tarefa.titulo}
    </div>
  ),
}))

jest.mock('@/components/ui/separator', () => ({
  Separator: () => <hr data-testid={TESTID_SEPARADOR} />,
}))

jest.mock('@/components/ui/pagination', () => ({
  Pagination: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
  PaginationContent: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
  PaginationItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  PaginationLink: ({
    href,
    children,
    isActive,
  }: {
    href: string
    children: React.ReactNode
    isActive?: boolean
  }) => (
    <a href={href} data-active={isActive}>
      {children}
    </a>
  ),
  PaginationPrevious: ({ href }: { href: string }) => (
    <a href={href} data-testid={TESTID_PAGINACAO_ANTERIOR}>
      {LABEL_PAGINACAO_ANTERIOR}
    </a>
  ),
  PaginationNext: ({ href }: { href: string }) => (
    <a href={href} data-testid={TESTID_PAGINACAO_PROXIMO}>
      {LABEL_PAGINACAO_PROXIMO}
    </a>
  ),
}))

const mockObterParametro = jest.fn()

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: mockObterParametro,
    toString: () => '',
  }),
}))

jest.mock('@/components/ui/toast', () => ({
  Toast: ({ message }: any) => <div>{message}</div>,
}))

describe('TarefaLista', () => {
  beforeEach(() => {
    mockObterParametro.mockReturnValue(null)
  })

  it('deve exibir mensagem quando não há tarefas', () => {
    render(<TarefaLista tarefas={[]} totalPages={0} currentPage={1} />)

    expect(screen.getByText(MENSAGEM_NENHUMA_TAREFA)).toBeInTheDocument()
  })

  it('não deve exibir mensagem de vazio quando há tarefas', () => {
    render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={1} currentPage={1} />)

    expect(screen.queryByText(MENSAGEM_NENHUMA_TAREFA)).not.toBeInTheDocument()
  })

  it('deve renderizar um TarefaItem para cada tarefa', () => {
    render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={1} currentPage={1} />)

    const itensRenderizados = screen.getAllByTestId(TESTID_TAREFA_ITEM)
    expect(itensRenderizados).toHaveLength(3)
  })

  it('deve renderizar os títulos das tarefas corretamente', () => {
    render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={1} currentPage={1} />)

    expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
    expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
    expect(screen.getByText('Tarefa 3')).toBeInTheDocument()
  })

  it('não deve renderizar separador quando há apenas uma tarefa', () => {
    render(<TarefaLista tarefas={[tarefasMockBasicas[0]]} totalPages={1} currentPage={1} />)

    expect(screen.queryByTestId(TESTID_SEPARADOR)).not.toBeInTheDocument()
  })

  it('não deve exibir paginação quando totalPages é 1', () => {
    render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={1} currentPage={1} />)

    expect(screen.queryByTestId(TESTID_PAGINACAO_ANTERIOR)).not.toBeInTheDocument()
    expect(screen.queryByTestId(TESTID_PAGINACAO_PROXIMO)).not.toBeInTheDocument()
  })

  it('não deve exibir paginação quando totalPages é 0', () => {
    render(<TarefaLista tarefas={[]} totalPages={0} currentPage={1} />)

    expect(screen.queryByTestId(TESTID_PAGINACAO_ANTERIOR)).not.toBeInTheDocument()
    expect(screen.queryByTestId(TESTID_PAGINACAO_PROXIMO)).not.toBeInTheDocument()
  })

  it('deve exibir paginação quando totalPages é maior que 1', () => {
    render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={3} currentPage={1} />)

    expect(screen.getByTestId(TESTID_PAGINACAO_ANTERIOR)).toBeInTheDocument()
    expect(screen.getByTestId(TESTID_PAGINACAO_PROXIMO)).toBeInTheDocument()
  })

  it('deve renderizar o número correto de links de página', () => {
    render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={4} currentPage={1} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('deve marcar a página atual como ativa', () => {
    render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={3} currentPage={2} />)

    const linksEncontrados = screen
      .getAllByRole('link')
      .filter((link) => ['1', '2', '3'].includes(link.textContent || ''))
    const paginaMarcarComoAtiva = linksEncontrados.find((link) => link.textContent === '2')
    const paginaMarcarComoInativa = linksEncontrados.find((link) => link.textContent === '1')

    expect(paginaMarcarComoAtiva).toHaveAttribute(ATRIBUTO_DADOS_ATIVO, VALOR_ATRIBUTO_ATIVO)
    expect(paginaMarcarComoInativa).toHaveAttribute(ATRIBUTO_DADOS_ATIVO, VALOR_ATRIBUTO_INATIVO)
  })

  it('deve gerar href correto para o botão anterior', () => {
    render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={3} currentPage={2} />)

    expect(screen.getByTestId(TESTID_PAGINACAO_ANTERIOR)).toHaveAttribute(ATRIBUTO_HREF, '?page=1')
  })

  it('deve gerar href correto para o botão próximo', () => {
    render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={3} currentPage={2} />)

    expect(screen.getByTestId(TESTID_PAGINACAO_PROXIMO)).toHaveAttribute(ATRIBUTO_HREF, '?page=3')
  })

  it('deve gerar hrefs corretos para cada link de página', () => {
    render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={3} currentPage={1} />)

    const linksEncontrados = screen
      .getAllByRole('link')
      .filter((link) => ['1', '2', '3'].includes(link.textContent || ''))
    expect(linksEncontrados[0]).toHaveAttribute(ATRIBUTO_HREF, '?page=1')
    expect(linksEncontrados[1]).toHaveAttribute(ATRIBUTO_HREF, '?page=2')
    expect(linksEncontrados[2]).toHaveAttribute(ATRIBUTO_HREF, '?page=3')
  })

  it('deve exibir toast de sucesso ao excluir tarefa', () => {
    render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={1} currentPage={1} />)

    fireEvent.click(screen.getByText('Tarefa 1'))

    expect(screen.getByText('Tarefa deletada com sucesso!')).toBeInTheDocument()
  })

  describe('Filtro de busca no frontend', () => {
    const PARAMETRO_BUSCA = 'busca'

    it('deve filtrar tarefas por título', () => {
      mockObterParametro.mockImplementation((chave: string) =>
        chave === PARAMETRO_BUSCA ? 'Tarefa 1' : null,
      )

      render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={1} currentPage={1} />)

      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.queryByText('Tarefa 2')).not.toBeInTheDocument()
      expect(screen.queryByText('Tarefa 3')).not.toBeInTheDocument()
    })

    it('deve filtrar tarefas por descrição', () => {
      mockObterParametro.mockImplementation((chave: string) =>
        chave === PARAMETRO_BUSCA ? 'Desc 2' : null,
      )

      render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={1} currentPage={1} />)

      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
      expect(screen.queryByText('Tarefa 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Tarefa 3')).not.toBeInTheDocument()
    })

    it('deve ser case-insensitive', () => {
      mockObterParametro.mockImplementation((chave: string) =>
        chave === PARAMETRO_BUSCA ? 'TAREFA 1' : null,
      )

      render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={1} currentPage={1} />)

      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
    })

    it('deve filtrar com espaços antes e depois', () => {
      mockObterParametro.mockImplementation((chave: string) =>
        chave === PARAMETRO_BUSCA ? '  Tarefa 2  ' : null,
      )

      render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={1} currentPage={1} />)

      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
    })

    it('deve exibir "Nenhuma tarefa encontrada" quando nenhuma corresponde à busca', () => {
      mockObterParametro.mockImplementation((chave: string) =>
        chave === PARAMETRO_BUSCA ? 'inexistente' : null,
      )

      render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={1} currentPage={1} />)

      expect(screen.getByText(MENSAGEM_NENHUMA_TAREFA)).toBeInTheDocument()
    })

    it('deve exibir todas as tarefas quando parâmetro de busca está vazio', () => {
      mockObterParametro.mockReturnValue(null)

      render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={1} currentPage={1} />)

      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 3')).toBeInTheDocument()
    })

    it('deve buscar parcialmente no título', () => {
      mockObterParametro.mockImplementation((chave: string) =>
        chave === PARAMETRO_BUSCA ? 'refa' : null,
      )

      render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={1} currentPage={1} />)

      expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
      expect(screen.getByText('Tarefa 3')).toBeInTheDocument()
    })

    it('deve remover tarefa quando onExcluir é chamado (linhas 58-59)', () => {
      render(<TarefaLista tarefas={tarefasMockBasicas} totalPages={1} currentPage={1} />)

      const itensAntes = screen.getAllByTestId(TESTID_TAREFA_ITEM)
      expect(itensAntes).toHaveLength(3)
      expect(screen.getByText('Tarefa 2')).toBeInTheDocument()

      fireEvent.click(screen.getByText('Tarefa 2'))

      expect(screen.queryByText('Tarefa 2')).not.toBeInTheDocument()
      const itensDepois = screen.getAllByTestId(TESTID_TAREFA_ITEM)
      expect(itensDepois).toHaveLength(2)
    })
  })
})
