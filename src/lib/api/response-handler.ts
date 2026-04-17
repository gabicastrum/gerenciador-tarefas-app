export interface ApiError {
  message: string
  status?: number
}

const DEFAULT_ERROR_MESSAGE = 'Erro ao processar solicitação. Tente novamente.'

export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    const errors: { [key: string]: string } = {
      TypeError: DEFAULT_ERROR_MESSAGE,
      NetworkError: 'Erro de rede. Verifique sua conexão.',
    }

    return errors[error.name]
      ? { message: errors[error.name] }
      : {
          message: error.message || DEFAULT_ERROR_MESSAGE,
        }
  }

  if (typeof error === 'string') {
    return {
      message: error,
    }
  }

  return {
    message: DEFAULT_ERROR_MESSAGE,
  }
}
