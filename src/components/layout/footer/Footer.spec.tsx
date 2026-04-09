import { Footer } from './Footer'
import { render, screen } from '@testing-library/react'

jest.mock('react-icons/fa', () => ({
  FaGithub: (props: object) => <svg data-testid="icon-github" {...props} />,
  FaLinkedin: (props: object) => <svg data-testid="icon-linkedin" {...props} />,
}))

describe(' Footer ', () => {
  it('deve renderizar o  © + ano +  Gabriela de Castro Laurindo', () => {
    render(<Footer />)

    expect(
      screen.getByText('© ' + new Date().getFullYear() + ' Gabriela de Castro Laurindo'),
    ).toBeInTheDocument()
  })

  it('deve renderizar o link do GitHub', () => {
    render(<Footer />)

    const githubLink = screen.getByRole('link', { name: /github/i })

    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('href', 'https://github.com/gabicastrum')
    expect(githubLink).toHaveAttribute('target', '_blank')
  })

  it('deve renderizar o link do LinkedIn', () => {
    render(<Footer />)

    const linkedinLink = screen.getByRole('link', { name: /linkedin/i })

    expect(linkedinLink).toBeInTheDocument()
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/gabrieladecastrolaurindo/',
    )
    expect(linkedinLink).toHaveAttribute('target', '_blank')
  })

  it('deve renderizar o ícone do Github', () => {
    render(<Footer />)

    expect(screen.getByTestId('icon-github')).toBeInTheDocument()
  })

  it('deve renderizar o ícone do LinkedIn', () => {
    render(<Footer />)

    expect(screen.getByTestId('icon-linkedin')).toBeInTheDocument()
  })
})
