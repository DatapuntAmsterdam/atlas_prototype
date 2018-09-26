import homeReducers from './home-reducers';
import * as stateUrlConverter from '../../shared/services/routing/state-url-converter';

describe('The homeReducers', () => {
  let urlState = {};
  let inputState;

  beforeEach(() => {
    urlState = {
      foo: 'bar'
    };
    inputState = {
      ui: {}
    };

    stateUrlConverter.default = {
      getDefaultState: () => urlState
    };
  });


  describe('SHOW_HOME', () => {
    it('resets the state to the default', () => {
      expect(homeReducers.SHOW_HOME(inputState))
        .toEqual({
          ...urlState,
          ui: {
            ...urlState.ui
          }
        });
    });

    it('keeps the isPrintMode setting', () => {
      inputState.ui.isPrintMode = true;
      expect(homeReducers.SHOW_HOME(inputState).ui.isPrintMode)
        .toBe(true);

      inputState.ui.isPrintMode = false;
      expect(homeReducers.SHOW_HOME(inputState).ui.isPrintMode)
        .toBe(false);
    });

    it('keeps the isEmbedPreview setting', () => {
      inputState.ui.isEmbedPreview = true;
      expect(homeReducers.SHOW_HOME(inputState).ui.isEmbedPreview)
        .toBe(true);

      inputState.ui.isEmbedPreview = false;
      expect(homeReducers.SHOW_HOME(inputState).ui.isEmbedPreview)
        .toBe(false);
    });
  });
});
