
// import { random } from 'lodash';
// import { pickRandomElement } from '../listRandomizer';

// import db from './list.json';

const successResult = {
  success: true,
  message: ''
};

const addItem = {
  path: '/list/add',
  container() {
    return successResult;
  }
};

export default [addItem];
