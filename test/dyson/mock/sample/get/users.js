import g from 'dyson-generators';

const user = {
  path: '/user',
  cache: false,
  template: {
    id: g.id,
    user: g.name,
    city: g.address.city
  }
};

const users = {
  path: '/users',
  collection: true,
  cache: false,
  size() {
    return Math.floor(Math.random() * 6) + 5;
  },
  template: user.template,

};

export default [user, users];
