import { TarefaStatusBadge } from './TarefaStatusBadge'
import { render, screen } from '@testing-library/react'

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant }: { children: React.ReactNode; variant: string }) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}))

describe('TarefaStatusBadge', () => {
  it('deve renderizar o label "Pendente" para status PENDENTE', () => {
    render(<TarefaStatusBadge status="PENDENTE" />)

    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })

  it('deve renderizar o label "Concluída" para status CONCLUIDA', () => {
    render(<TarefaStatusBadge status="CONCLUIDA" />)

    expect(screen.getByText('Concluída')).toBeInTheDocument()
  })

  it('deve aplicar variant "outline" para status PENDENTE', () => {
    render(<TarefaStatusBadge status="PENDENTE" />)

    expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'outline')
  })

  it('deve aplicar variant "secondary" para status CONCLUIDA', () => {
    render(<TarefaStatusBadge status="CONCLUIDA" />)

    expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'secondary')
  })

  it('deve renderizar o status bruto e variant "outline" para status desconhecido', () => {
    render(<TarefaStatusBadge status={'DESCONHECIDO' as never} />)

    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('DESCONHECIDO')
    expect(badge).toHaveAttribute('data-variant', 'outline')
  })
})
