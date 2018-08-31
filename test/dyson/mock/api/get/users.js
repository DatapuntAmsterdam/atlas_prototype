import g from 'dyson-generators';
import db from './users.json';
import { pickRandomSublist } from '../../../lib/listRandomizer';

const user = {
  path: '/user/:id',
  cache: false,
  template: {
    id: g.id,
    user: g.name
  }
};

const users = {
  path: '/users',
  collection: true,
  cache: false,
  size() {
    return Math.floor(Math.random() * 6) + 5;
  },
  template: user.template
};

const usersList = {
  path: '/users-list',
  cache: false,
  container: () => pickRandomSublist(db.users)
};

export default { user, users, usersList };
