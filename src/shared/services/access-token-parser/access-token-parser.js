function decodeToken(token) {
  try {
    return angular.fromJson(
      window.atob(token
        .split('.')[1]
        .replace('-', '+')
        .replace('_', '/')
      ));
  } catch (e) {
    return {};
  }
}

export default function parseAccessToken(token) {
  const content = decodeToken(token);
  return {
    issuer: content.iss, // the URL of the authorization endpoint
    name: content.sub, // a descriptive string for the end-user
    issuedAt: content.iat,
    notBefore: content.nbf,
    expiresAt: content.exp,
    jwtId: content.jti, // should be globally unique
    scopes: content.scopes // list of scopes that this token provides access to
  };
}
