import detail from './map-detail';
import adressenLigplaats from '../../shared/services/adressen/adressen-ligplaats';
import napPeilmerk from '../../shared/services/nap-peilmerk/nap-peilmerk';
import vestiging from '../../shared/services/vestiging/vestiging';

jest.mock('../../shared/services/adressen/adressen-ligplaats');
jest.mock('../../shared/services/nap-peilmerk/nap-peilmerk');
jest.mock('../../shared/services/vestiging/vestiging');

describe('The map detail service', () => {
  afterEach(() => {
    adressenLigplaats.mockReset();
    napPeilmerk.mockReset();
    vestiging.mockReset();
  });

  it('calls the service fot the endpoint type specified', () => {
    adressenLigplaats.mockImplementation(() => 'ligplaats');
    expect(detail('https://acc.api.data.amsterdam.nl/bag/ligplaats/123')).toEqual('ligplaats');
    expect(adressenLigplaats).toHaveBeenCalledWith('https://acc.api.data.amsterdam.nl/bag/ligplaats/123');

    napPeilmerk.mockImplementation(() => 'peilmerk');
    expect(detail('https://acc.api.data.amsterdam.nl/nap/peilmerk/123')).toEqual('peilmerk');
    expect(napPeilmerk).toHaveBeenCalledWith('https://acc.api.data.amsterdam.nl/nap/peilmerk/123');
  });

  it('does not call the service when the user does not have the required auth scope', () => {
    vestiging.mockImplementation(() => 'vestiging');
    expect(detail('https://acc.api.data.amsterdam.nl/handelsregister/vestiging/123', {
      scopes: ['MON/R']
    })).toEqual(false);
    expect(vestiging).not.toHaveBeenCalled();
  });

  it('calls the service when the user has the required auth scope', () => {
    vestiging.mockImplementation(() => 'vestiging');
    expect(detail('https://acc.api.data.amsterdam.nl/handelsregister/vestiging/123', {
      scopes: ['MON/R', 'HR/R']
    })).toEqual('vestiging');
    expect(vestiging).toHaveBeenCalledWith('https://acc.api.data.amsterdam.nl/handelsregister/vestiging/123');
  });
});
