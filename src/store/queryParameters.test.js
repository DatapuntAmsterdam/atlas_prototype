import queryParameters from './queryParameters';

// Todo: DP-6235
describe('QueryParameters', () => {
  it('should match the snapshot', () => {
    expect(queryParameters.result).toMatchSnapshot();
  });
});
