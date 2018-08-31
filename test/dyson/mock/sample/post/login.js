export const path = '/login';
export const template = {
  username(params, query, body) {
    return body.username;
  },
  authenticated(params, query, body) {
    return body.password === 'password1';
  }
};
