import { mapDocumentTitle, detailDocumentTitle } from './document-title'

describe('The Detail DocumentTitle service', () => {
  beforeEach(() => {})

  describe('mapDocumentTitle', () => {
    it('should return the default name when no map view', () => {
      const action = {
        meta: {},
      }
      expect(mapDocumentTitle(action, 'Home')).toBe('Home')
    })

    it('should return the map name when the view is map', () => {
      const action = { meta: { query: { modus: 'kaart' } } }
      expect(mapDocumentTitle(action, 'Home')).toBe('Grote kaart')
    })

    it('should return the map embedded name when the map is embedded', () => {
      const action = { meta: { query: { modus: 'kaart', embed: 'true' } } }
      expect(mapDocumentTitle(action, 'Home')).toBe('Grote kaart | Embedded')
    })
  })

  describe('detailDocumentTitle', () => {
    it('combines a GLOSSARY label with a specific display variable', () => {
      const action = {
        payload: {
          type: 'bag',
          subtype: 'standplaats',
        },
      }
      expect(detailDocumentTitle(action)).toBe('Standplaats')
    })

    it('falls back to glossary key when no definition can be found', () => {
      const action = {
        payload: {
          type: 'bag',
          subtype: 'unknown',
        },
      }
      expect(detailDocumentTitle(action)).toBe('UNKNOWN')
    })

    it('falls back to glossary key when no definition can be found', () => {
      const action = {
        payload: {
          type: 'bag',
          subtype: 'unknown',
        },
      }
      expect(detailDocumentTitle(action)).toBe('UNKNOWN')
    })

    it('should handle the unknown object type', () => {
      const action = {
        payload: {
          type: 'unknown',
          subtype: 'unknown',
        },
      }
      expect(detailDocumentTitle(action)).toBe('UNKNOWN')
    })
  })
})
