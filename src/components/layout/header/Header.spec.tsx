import { Header } from './Header'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Header', () => {
  it('deve renderizar o logo TIMETRIX com link para a home', () => {
    render(<Header />)

    const logo = screen.getByText('TIMETRIX')

    expect(logo).toBeInTheDocument()
    expect(logo.closest('a')).toHaveAttribute('href', '/')
  })

  it('deve renderizar os links de navegação (TODO: implementar)', () => {
    render(<Header />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Tarefas')).toBeInTheDocument()
    expect(screen.getByText('Projetos')).toBeInTheDocument()
  })

  it('deve verificar se os links de navegação têm href correto', () => {
    render(<Header />)

    const links = screen.getAllByRole('link')
    const navLinks = links.filter((link) =>
      ['Dashboard', 'Tarefas', 'Projetos'].includes(link.textContent || ''),
    )

    navLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/')
    })
  })

  it('deve exibir o avatar do usuário', () => {
    render(<Header />)

    expect(screen.getByText('US')).toBeInTheDocument()
  })

  it('deve abrir o dropdown ao clicar no avatar', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const avatar = screen.getByText('US')
    await user.click(avatar)

    expect(screen.getByText('Perfil')).toBeInTheDocument()
    expect(screen.getByText('Sair')).toBeInTheDocument()
  })
})
