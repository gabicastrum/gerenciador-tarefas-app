import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toast } from './toast'

describe('Toast', () => {
  it('deve renderizar a mensagem', () => {
    render(<Toast message="Teste" variant="success" />)
    expect(screen.getByText('Teste')).toBeInTheDocument()
  })

  it('deve renderizar com variant success', () => {
    render(<Toast message="Sucesso" variant="success" />)
    expect(screen.getByRole('alert')).toHaveClass('bg-green-50')
  })

  it('deve renderizar com variant error', () => {
    render(<Toast message="Erro" variant="error" />)
    expect(screen.getByRole('alert')).toHaveClass('bg-red-50')
  })

  it('deve renderizar com variant warning', () => {
    render(<Toast message="Aviso" variant="warning" />)
    expect(screen.getByRole('alert')).toHaveClass('bg-yellow-50')
  })

  it('deve desaparecer após o tempo especificado', async () => {
    render(<Toast message="Teste" variant="success" duration={100} />)
    expect(screen.getByText('Teste')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Teste')).not.toBeInTheDocument()
    })
  })

  it('deve chamar onClose quando fecha automaticamente', async () => {
    const onClose = jest.fn()
    render(<Toast message="Teste" variant="success" duration={100} onClose={onClose} />)

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('deve fechar ao clicar no botão de fechar', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    render(<Toast message="Teste" variant="success" onClose={onClose} />)

    const closeButton = screen.getByLabelText('Fechar notificação')
    await user.click(closeButton)

    expect(screen.queryByText('Teste')).not.toBeInTheDocument()
    expect(onClose).toHaveBeenCalled()
  })
})
