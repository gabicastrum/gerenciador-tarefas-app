"use client"

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { label: "Dashboard", href: "/", key: 'dashboardKey' },
  { label: "Tarefas", href: "/", key: 'tasksKey' },
  { label: "Configurações", href: "/", key: 'settingsKey' },
];

export function Header() {
  return (
    <header className="bg-surface border-b border-white/10 px-4 py-3">
      <div className="container-default flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-primary font-bold text-xl">
          MyApp
        </Link>

        {/* Nav — some no mobile */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="text-text/70 hover:text-text text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Avatar + Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer size-9">
              <AvatarImage src="/avatar.png" alt="Usuário" />
              <AvatarFallback className="bg-primary text-white text-sm">
                US
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-400">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}