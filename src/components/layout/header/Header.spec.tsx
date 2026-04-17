import { Header } from './Header'
import { render, screen } from '@testing-library/react'

describe('Header', () => {
  it('deve renderizar o logo TIMETRIX com link para a home', () => {
    render(<Header />)

    const logo = screen.getByText('TIMETRIX')

    expect(logo).toBeInTheDocument()
    expect(logo.closest('a')).toHaveAttribute('href', '/')
  })

  it('deve exibir o avatar do usuário', () => {
    render(<Header />)

    expect(screen.getByText('US')).toBeInTheDocument()
  })
})
