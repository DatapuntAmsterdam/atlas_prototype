import reducer, {
  FETCH_PANORAMA_PREVIEW_REQUEST,
  fetchPanoramaPreview, fetchPanoramaPreviewFailure, fetchPanoramaPreviewSuccess
} from './panorama-preview';

const initialState = {
  isLoading: false,
  error: undefined,
  preview: undefined
};


describe('FetchPanoPreview Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should set the previews', () => {
    expect(reducer(initialState, fetchPanoramaPreviewSuccess('somePanoResult'))
    ).toEqual({
      ...initialState,
      isLoading: false,
      preview: 'somePanoResult'
    });
  });

  it('should set an error when failure is dispatched', () => {
    expect(reducer(initialState, fetchPanoramaPreviewFailure('Some error message')))
      .toEqual({
        ...initialState,
        error: 'Some error message',
        isLoading: false
      });
  });
});

describe('getPanoramaPreview method', () => {
  it('should return an object with action type and location', () => {
    expect(fetchPanoramaPreview('some location')).toEqual({
      type: FETCH_PANORAMA_PREVIEW_REQUEST,
      payload: 'some location'
    });
  });
});
