import { TarefaLista } from './TarefaLista'
import { render, screen } from '@testing-library/react'
import { TarefaResponseDTO } from '@/types/tarefas'

jest.mock('../tarefa-item/TarefaItem', () => ({
  TarefaItem: ({ tarefa }: { tarefa: TarefaResponseDTO }) => (
    <div data-testid="tarefa-item">{tarefa.titulo}</div>
  ),
}))

jest.mock('@/components/ui/separator', () => ({
  Separator: () => <hr data-testid="separator" />,
}))

jest.mock('@/components/ui/pagination', () => ({
  Pagination: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
  PaginationContent: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
  PaginationItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  PaginationLink: ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive?: boolean }) => (
    <a href={href} data-active={isActive}>{children}</a>
  ),
  PaginationPrevious: ({ href }: { href: string }) => (
    <a href={href} data-testid="pagination-previous">Anterior</a>
  ),
  PaginationNext: ({ href }: { href: string }) => (
    <a href={href} data-testid="pagination-next">Próximo</a>
  ),
}))

const tarefasMock: TarefaResponseDTO[] = [
  { id: 1, titulo: 'Tarefa 1', descricao: 'Desc 1', statusTarefa: 'PENDENTE', dataCriacao: '2024-03-15T10:00:00.000Z' },
  { id: 2, titulo: 'Tarefa 2', descricao: 'Desc 2', statusTarefa: 'CONCLUIDA', dataCriacao: '2024-03-16T10:00:00.000Z' },
  { id: 3, titulo: 'Tarefa 3', descricao: 'Desc 3', statusTarefa: 'PENDENTE', dataCriacao: '2024-03-17T10:00:00.000Z' },
]

describe('TarefaLista', () => {
  it('deve exibir mensagem quando não há tarefas', () => {
    render(<TarefaLista tarefas={[]} totalPages={0} currentPage={1} />)

    expect(screen.getByText('Nenhuma tarefa encontrada.')).toBeInTheDocument()
  })

  it('não deve exibir mensagem de vazio quando há tarefas', () => {
    render(<TarefaLista tarefas={tarefasMock} totalPages={1} currentPage={1} />)

    expect(screen.queryByText('Nenhuma tarefa encontrada.')).not.toBeInTheDocument()
  })

  it('deve renderizar um TarefaItem para cada tarefa', () => {
    render(<TarefaLista tarefas={tarefasMock} totalPages={1} currentPage={1} />)

    const itens = screen.getAllByTestId('tarefa-item')
    expect(itens).toHaveLength(3)
  })

  it('deve renderizar os títulos das tarefas corretamente', () => {
    render(<TarefaLista tarefas={tarefasMock} totalPages={1} currentPage={1} />)

    expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
    expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
    expect(screen.getByText('Tarefa 3')).toBeInTheDocument()
  })

  it('deve renderizar separadores entre os itens mas não após o último', () => {
    render(<TarefaLista tarefas={tarefasMock} totalPages={1} currentPage={1} />)

    const separadores = screen.getAllByTestId('separator')
    expect(separadores).toHaveLength(tarefasMock.length - 1)
  })

  it('não deve renderizar separador quando há apenas uma tarefa', () => {
    render(<TarefaLista tarefas={[tarefasMock[0]]} totalPages={1} currentPage={1} />)

    expect(screen.queryByTestId('separator')).not.toBeInTheDocument()
  })

  it('não deve exibir paginação quando totalPages é 1', () => {
    render(<TarefaLista tarefas={tarefasMock} totalPages={1} currentPage={1} />)

    expect(screen.queryByTestId('pagination-previous')).not.toBeInTheDocument()
    expect(screen.queryByTestId('pagination-next')).not.toBeInTheDocument()
  })

  it('não deve exibir paginação quando totalPages é 0', () => {
    render(<TarefaLista tarefas={[]} totalPages={0} currentPage={1} />)

    expect(screen.queryByTestId('pagination-previous')).not.toBeInTheDocument()
    expect(screen.queryByTestId('pagination-next')).not.toBeInTheDocument()
  })

  it('deve exibir paginação quando totalPages é maior que 1', () => {
    render(<TarefaLista tarefas={tarefasMock} totalPages={3} currentPage={1} />)

    expect(screen.getByTestId('pagination-previous')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-next')).toBeInTheDocument()
  })

  it('deve renderizar o número correto de links de página', () => {
    render(<TarefaLista tarefas={tarefasMock} totalPages={4} currentPage={1} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('deve marcar a página atual como ativa', () => {
    render(<TarefaLista tarefas={tarefasMock} totalPages={3} currentPage={2} />)

    const links = screen.getAllByRole('link').filter(l => ['1', '2', '3'].includes(l.textContent || ''))
    const paginaAtiva = links.find(l => l.textContent === '2')
    const paginaInativa = links.find(l => l.textContent === '1')

    expect(paginaAtiva).toHaveAttribute('data-active', 'true')
    expect(paginaInativa).toHaveAttribute('data-active', 'false')
  })

  it('deve gerar href correto para o botão anterior', () => {
    render(<TarefaLista tarefas={tarefasMock} totalPages={3} currentPage={2} />)

    expect(screen.getByTestId('pagination-previous')).toHaveAttribute('href', '?page=1')
  })

  it('deve gerar href correto para o botão próximo', () => {
    render(<TarefaLista tarefas={tarefasMock} totalPages={3} currentPage={2} />)

    expect(screen.getByTestId('pagination-next')).toHaveAttribute('href', '?page=3')
  })

  it('deve gerar hrefs corretos para cada link de página', () => {
    render(<TarefaLista tarefas={tarefasMock} totalPages={3} currentPage={1} />)

    const links = screen.getAllByRole('link').filter(l => ['1', '2', '3'].includes(l.textContent || ''))
    expect(links[0]).toHaveAttribute('href', '?page=1')
    expect(links[1]).toHaveAttribute('href', '?page=2')
    expect(links[2]).toHaveAttribute('href', '?page=3')
  })
})