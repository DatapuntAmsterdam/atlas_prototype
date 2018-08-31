import g from 'dyson-generators';

const feature = {
  path: '/feature/:foo?',
  status(req, res) {
    if (req.params.foo === '999') {
      res.send(404, 'Feature not found');
    }
  },
  template: {
    id: g.id,
    cid() {
      return `c${this.id}`;
    },
    user: g.name,
    time: g.time.time,
    memo: g.lorem.short,
    habitat: {
      zip: g.address.zipUS,
      city: g.address.city,
      country: 'Timbuctoo'
    }
  }
};

const features = {
  path: '/features/:bar?',
  collection: true,
  cache: false,
  size() {
    return Math.floor(Math.random() * 6) + 5;
  },
  template: feature.template,
  container: {
    meta(params, query, data) {
      return {
        path: this.path,
        size: data.length,
        bar: params.bar,
        query
      };
    },
    data: {
      here(params, query, data) {
        return data;
      }
    }
  }
};

module.exports = [feature, features];
