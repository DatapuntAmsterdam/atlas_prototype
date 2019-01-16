
import { homeDocumentTitle, detailDocumentTitle } from './document-title';

describe('The Detail DocumentTitle service', () => {
  beforeEach(() => {
  });

  describe('homeDocumentTitle', () => {
    it('should return the default name when no map view', () => {
      const action = {
        meta: {}
      };
      expect(homeDocumentTitle(action, 'Home')).toBe('Home');
    });

    it('should return the map name when the view is map', () => {
      const action = { meta: { query: { view: 'kaart' } } };
      expect(homeDocumentTitle(action, 'Home')).toBe('Grote kaart');
    });

    it('should return the map embeded name when the map is embeded', () => {
      const action = { meta: { query: { view: 'kaart', embed: 'true' } } };
      expect(homeDocumentTitle(action, 'Home')).toBe('Grote kaart | Embeded');
    });
  });

  describe('detailDocumentTitle', () => {
    it('combines a GLOSSARY label with a specific display variable', () => {
      const action = {
        payload: {
          type: 'wkpb',
          subtype: 'beperking'
        }
      };
      expect(detailDocumentTitle(action)).toBe('Gemeentelijke beperking');
    });

    it('falls back to glossary key when no definition can be found', () => {
      const action = {
        payload: {
          type: 'wkpb',
          subtype: 'unknown'
        }
      };
      expect(detailDocumentTitle(action)).toBe('UNKNOWN');
    });

    it('falls back to glossary key when no definition can be found', () => {
      const action = {
        payload: {
          type: 'wkpb',
          subtype: 'unknown'
        }
      };
      expect(detailDocumentTitle(action)).toBe('UNKNOWN');
    });

    it('should handle the unknown object type', () => {
      const action = {
        payload: {
          type: 'unknown',
          subtype: 'unknown'
        }
      };
      expect(detailDocumentTitle(action)).toBe('UNKNOWN');
    });
  });
});
