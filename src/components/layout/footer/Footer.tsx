import { FaGithub, FaLinkedin } from 'react-icons/fa'

export function Footer() {
  return (
    <footer className="bg-surface border-t border-white/10 mt-10">
      <div className="container-default flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4">
        <p className="text-text/60 text-sm">
          © {new Date().getFullYear()} Gabriela de Castro Laurindo
        </p>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/gabicastrum"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text/60 hover:text-text transition-colors text-sm"
          >
            <FaGithub className="h-4 w-4" />
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/gabrieladecastrolaurindo/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text/60 hover:text-text transition-colors text-sm"
          >
            <FaLinkedin className="h-4 w-4" />
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
