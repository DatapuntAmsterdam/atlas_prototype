// eslint-disable-next-line max-classes-per-file
export class AuthError extends Error {
  constructor(public code: number, public message: string, public title?: string) {
    super(`HTTP-Code: ${code}`)
    this.message = message
    this.title = title || 'Meer resultaten na inloggen'
  }
}

export class NotFoundError extends Error {
  constructor(public code: number, public message: string, public title?: string) {
    super(`HTTP-Code: ${code}`)
    this.message = message
  }
}
