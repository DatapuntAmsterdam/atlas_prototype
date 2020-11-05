interface DecodedToken {
  iss: string
  sub: string
  iat: number
  nbf: number
  exp: number
  jti: string
  scopes: string[]
}

function decodeToken(token: string): DecodedToken | null {
  try {
    return JSON.parse(window.atob(token.split('.')[1].replace('-', '+').replace('_', '/')))
  } catch {
    return null
  }
}

export interface ParsedToken {
  /**
   * The URL of the authorization endpoint.
   */
  issuer: string
  /**
   * A descriptive name for the end-user.
   */
  name: string
  /**
   * A unix time stamp describing when the token was issued.
   */
  issuedAt: number
  /**
   * A unix time stamp describing when the token can be used.
   */
  notBefore: number
  /**
   * A unix time stamp describing when the token expires.
   */
  expiresAt: number
  /**
   * The unique identifier of the JSON Web Token.
   */
  jwtId: string
  /**
   * A list of scopes that this token provides access to.
   */
  scopes: string[]
}

export default function parseAccessToken(token: string): ParsedToken | null {
  const content = decodeToken(token)

  if (!content) {
    return null
  }

  return {
    issuer: content.iss,
    name: content.sub,
    issuedAt: content.iat,
    notBefore: content.nbf,
    expiresAt: content.exp,
    jwtId: content.jti,
    scopes: content.scopes,
  }
}
