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
  { label: "Projetos", href: "/", key: 'projectsKey' },];

export function Header() {
  return (
    <header className="bg-surface border-b border-white/10 px-4 py-3">
      <div className="container-default flex items-center justify-between">

        <Link href="/" className="text-primary font-bold text-xl">
          TIMETRIX
        </Link>

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
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Avatar className="cursor-pointer size-9">
      <AvatarImage src="/avatar.png" alt="Usuário" />
      <AvatarFallback className="bg-primary text-white text-sm">
        US
      </AvatarFallback>
    </Avatar>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    className="w-48 bg-white border border-black/10 shadow-lg rounded-xl p-1 padding: none"
  >
    <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm text-text hover:bg-primary/8 hover:text-primary cursor-pointer">
      Perfil
    </DropdownMenuItem>
    <DropdownMenuSeparator className="bg-black/8 my-1" />
    <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-50 hover:text-red-500 cursor-pointer">
      Sair
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

      </div>
    </header>
  );
}