import { TarefaStatusBadge } from './TarefaStatusBadge'
import { render, screen } from '@testing-library/react'
import { StatusTarefa } from '@/types/tarefas'

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant }: { children: React.ReactNode; variant: string }) => (
    <span data-testid="badge" data-variant={variant}>{children}</span>
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
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    render(<TarefaStatusBadge status={'DESCONHECIDO' as StatusTarefa} />)

    const badge = screen.getByTestId('badge')
    expect(badge).toHaveTextContent('DESCONHECIDO')
    expect(badge).toHaveAttribute('data-variant', 'outline')

    consoleWarn.mockRestore()
  })

  it('deve emitir console.warn para status desconhecido', () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    render(<TarefaStatusBadge status={'INVALIDO' as StatusTarefa} />)

    expect(consoleWarn).toHaveBeenCalledWith('Status desconhecido:', 'INVALIDO')

    consoleWarn.mockRestore()
  })

  it('não deve emitir console.warn para status válidos', () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    render(<TarefaStatusBadge status="PENDENTE" />)
    render(<TarefaStatusBadge status="CONCLUIDA" />)

    expect(consoleWarn).not.toHaveBeenCalled()

    consoleWarn.mockRestore()
  })
})