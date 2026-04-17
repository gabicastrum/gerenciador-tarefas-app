'use client'

import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const MENSAGEM_FUNCIONALIDADE_BREVE = 'Novas funcionalidades em breve'

const navLinks = [
  { label: 'Dashboard', href: '/', key: 'dashboardKey', desabilitado: true },
  { label: 'Tarefas', href: '/tarefas', key: 'tasksKey', desabilitado: false },
  { label: 'Projetos', href: '/', key: 'projectsKey', desabilitado: true },
]

export function Header() {
  return (
    <header className="bg-surface border-b border-white/10 px-4 py-3">
      <div className="container-default flex items-center justify-between">
        <Link href="/" className="text-primary font-bold text-xl">
          TIMETRIX
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <TooltipProvider key={link.key}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {link.desabilitado ? (
                    <button
                      disabled
                      className="text-text/30 cursor-not-allowed text-sm transition-colors"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-text/70 hover:text-text text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </TooltipTrigger>
                {link.desabilitado && (
                  <TooltipContent>{MENSAGEM_FUNCIONALIDADE_BREVE}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>

        {/* TODO: Implementar autenticação e funcionalidades de perfil/logout */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer size-9">
                      <AvatarImage src="/avatar.png" alt="Usuário" />
                      <AvatarFallback className="bg-primary text-white text-sm">US</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white border border-black/10 shadow-lg rounded-xl p-1"
                  >
                    {/* TODO: Implementar página de perfil */}
                    <DropdownMenuItem
                      disabled
                      className="rounded-lg px-3 py-2 text-sm text-text hover:bg-primary/8 hover:text-primary cursor-not-allowed opacity-50"
                    >
                      Perfil
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-black/8 my-1" />
                    {/* TODO: Implementar logout */}
                    <DropdownMenuItem
                      disabled
                      className="rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-50 hover:text-red-500 cursor-not-allowed opacity-50"
                    >
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TooltipTrigger>
            <TooltipContent>{MENSAGEM_FUNCIONALIDADE_BREVE}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}
