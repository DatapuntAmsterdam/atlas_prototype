import g from 'dyson-generators';

export const path = '/employee/:id';
export const template = {
  id(params) {
    return params.id;
  },
  name: g.name,
  status: 'OK'
};
