import stateToUrl from './state-to-url';
import * as stateUrlConverter from './state-url-converter';
import { history } from '../../../history';

jest.mock('../../../history');

describe('The stateToUrl', () => {
  let mockedParams;
  let mockedState;
  let queryString;

  beforeEach(() => {
    mockedParams = {
      withSlash: 'param/with/slash',
      withColon: 'param:with::colon'
    };

    mockedState = {
      ...mockedParams,
      mies: 'teun'
    };

    queryString = '#?withSlash=param%2Fwith%2Fslash&withColon=param:with::colon';

    stateUrlConverter.default = {
      state2params: jest.fn(() => mockedParams)
    };

    history.location.hash = '#?hash=true';

    jest.spyOn(history, 'replace');
    jest.spyOn(history, 'push').mockImplementation(() => ({ query: 'search', result: '%20space' }));
    jest.spyOn(stateUrlConverter.default, 'state2params');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('can update the url to reflect the state', () => {
    it('should not change the url when the state is nog changed', () => {
      history.location.hash = queryString;
      // regular call
      stateToUrl.update(mockedState);
      expect(stateUrlConverter.default.state2params).toBeCalledWith(mockedState);
      expect(history.push).not.toHaveBeenCalled();
      expect(history.replace).not.toHaveBeenCalled();
    });

    it('should call history.push when the state is changed', () => {
      // regular call
      stateToUrl.update(mockedState);
      expect(stateUrlConverter.default.state2params).toBeCalledWith(mockedState);
      expect(history.push).toHaveBeenCalledWith(queryString);
      expect(history.replace).not.toHaveBeenCalled();
    });

    it('should call history.replace when the state is changed and option to replace the URL useReplace flag is true', () => {
      // call with useReplace flag set
      stateToUrl.update(mockedState, true);
      expect(stateUrlConverter.default.state2params).toBeCalledWith(mockedState);
      expect(history.push).not.toHaveBeenCalled();
      expect(history.replace).toHaveBeenCalledWith(queryString);
    });
  });
});
