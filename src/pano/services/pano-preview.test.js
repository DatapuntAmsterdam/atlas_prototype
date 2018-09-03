import panoPreview from './pano-preview';

describe('panoPreview service', () => {
  it('should return an object filled with data if response is ok', () => {
    fetch.mockResponseOnce(JSON.stringify({
      pano_id: 'pano_id',
      heading: 'heading',
      url: 'url'
    }));
    panoPreview({ latitude: 123, longitude: 321 }).then((res) => {
      expect(res).toEqual({
        id: 'pano_id',
        heading: 'heading',
        url: 'url'
      });
    });
    expect(fetch).toHaveBeenCalledWith('https://acc.api.data.amsterdam.nl/panorama/thumbnail/?lat=123&lon=321&width=438&radius=180');
  });

  it('should return an empty object when status is 404', () => {
    fetch.mockResponseOnce('{}', { status: 404 });
    panoPreview({ latitude: 123, longitude: 321 }).then((res) => {
      expect(res).toEqual({});
    });
  });

  it('should throw an error is response != ok and status != 404', async () => {
    fetch.mockResponseOnce('{}', { status: 503 });
    // const result =
    expect(panoPreview({
      latitude: 123,
      longitude: 321
    })).rejects.toEqual(new Error('Error requesting a panoramic view'));
  });
});
