import urlReducersInit from './url-reducers';

describe('The urlReducers', () => {
  describe('The URL_CHANGE reducer', () => {
    it('transforms an url into a state', () => {
      const stateUrlConverter = {
        params2state: (oldState, payload) => ({
          ...oldState,
          ...payload
        })
      };
      const urlReducers = urlReducersInit(stateUrlConverter);

      const output = urlReducers.URL_CHANGE({ some: 'object' }, { someOther: 'object' });
      expect(output)
        .toEqual(stateUrlConverter.params2state({ some: 'object' }, { someOther: 'object' }));
    });
  });
});
