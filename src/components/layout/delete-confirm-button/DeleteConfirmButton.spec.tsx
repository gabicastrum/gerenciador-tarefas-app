import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import { DeleteConfirmButton } from './DeleteConfirmButton'

const TEXTO_TITULO = 'Excluir item'
const TEXTO_DESCRICAO = 'Tem certeza que deseja excluir?'
const TEXTO_EXCLUIR = 'Excluir'
const TEXTO_EXCLUINDO = 'Excluindo...'

const itemMock = {
  id: 1,
  nome: 'Item teste',
}

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid="delete-button" {...props}>
      {children}
    </button>
  ),
}))

jest.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: any) => <>{children}</>,
  AlertDialogTrigger: ({ children }: any) => <div>{children}</div>,
  AlertDialogContent: ({ children }: any) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: any) => <h2>{children}</h2>,
  AlertDialogDescription: ({ children }: any) => <p>{children}</p>,
  AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
  AlertDialogCancel: ({ children, onClick }: any) => (
    <button onClick={onClick} data-testid="cancel-button">
      {children}
    </button>
  ),
  AlertDialogAction: ({ children, onClick }: any) => (
    <button onClick={onClick} data-testid="confirm-button">
      {children}
    </button>
  ),
}))

jest.mock('lucide-react', () => ({
  Trash2: () => <svg data-testid="trash-icon" />,
}))

describe('DeleteConfirmButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar botão e conteúdo básico', () => {
    render(
      <DeleteConfirmButton
        item={itemMock}
        titulo={TEXTO_TITULO}
        descricao={TEXTO_DESCRICAO}
        onConfirm={jest.fn()}
      />,
    )

    expect(screen.getByTestId('trash-icon')).toBeInTheDocument()
    expect(screen.getByText(TEXTO_TITULO)).toBeInTheDocument()
    expect(screen.getByText(TEXTO_DESCRICAO)).toBeInTheDocument()
    expect(screen.getByText(TEXTO_EXCLUIR)).toBeInTheDocument()
  })

  it('deve chamar onConfirm ao confirmar exclusão', async () => {
    const funcaoConfirmar = jest.fn().mockResolvedValue(undefined)

    render(
      <DeleteConfirmButton item={itemMock} titulo={TEXTO_TITULO} onConfirm={funcaoConfirmar} />,
    )

    fireEvent.click(screen.getByTestId('confirm-button'))

    await waitFor(() => {
      expect(funcaoConfirmar).toHaveBeenCalledWith(itemMock)
    })
  })

  it('deve exibir estado de loading durante exclusão', async () => {
    let resolver: () => void

    const promessa = new Promise<void>((resolve) => {
      resolver = resolve
    })

    const funcaoConfirmar = jest.fn(() => promessa)

    render(
      <DeleteConfirmButton item={itemMock} titulo={TEXTO_TITULO} onConfirm={funcaoConfirmar} />,
    )

    fireEvent.click(screen.getByTestId('confirm-button'))

    expect(screen.getByTestId('confirm-button')).toHaveTextContent(TEXTO_EXCLUINDO)

    resolver!()

    await waitFor(() => {
      expect(screen.getByTestId('confirm-button')).toHaveTextContent(TEXTO_EXCLUIR)
    })
  })

  it('deve desabilitar botão durante loading', async () => {
    let resolver: () => void

    const promessa = new Promise<void>((resolve) => {
      resolver = resolve
    })

    const funcaoConfirmar = jest.fn(() => promessa)

    render(
      <DeleteConfirmButton item={itemMock} titulo={TEXTO_TITULO} onConfirm={funcaoConfirmar} />,
    )

    fireEvent.click(screen.getByTestId('confirm-button'))

    expect(screen.getByTestId('delete-button')).toBeDisabled()

    resolver!()

    await waitFor(() => {
      expect(screen.getByTestId('delete-button')).not.toBeDisabled()
    })
  })

  it('não deve chamar onConfirm ao cancelar', () => {
    const funcaoConfirmar = jest.fn()

    render(
      <DeleteConfirmButton item={itemMock} titulo={TEXTO_TITULO} onConfirm={funcaoConfirmar} />,
    )

    fireEvent.click(screen.getByTestId('cancel-button'))

    expect(funcaoConfirmar).not.toHaveBeenCalled()
  })
})
