import { formatOptionLabel, formatAllOptionLabel, getOptionValue } from './utils'
import { FilterOption } from '../../models'

describe('SearchFilter - Utilities', () => {
  describe('formatOptionLabel', () => {
    it('should format a label with a count', () => {
      expect(formatOptionLabel({ count: 10, label: 'Test' } as FilterOption, false)).toEqual(
        'Test (10)',
      )
    })

    it('should format a label with an empty count', () => {
      expect(formatOptionLabel({ count: 0, label: 'Test' } as FilterOption, false)).toEqual('Test')
    })

    it('should format a label with a hidden count', () => {
      expect(formatOptionLabel({ count: 10, label: 'Test' } as FilterOption, true)).toEqual('Test')
    })
  })

  describe('formatAllOptionLabel', () => {
    it('should format a label with a count', () => {
      expect(formatAllOptionLabel(10, false)).toEqual('Alles (10)')
    })

    it('should format a label with an empty count', () => {
      expect(formatAllOptionLabel(0, false)).toEqual('Alles')
    })

    it('should format a label with a hidden count', () => {
      expect(formatAllOptionLabel(10, true)).toEqual('Alles')
    })
  })

  describe('getOptionValue', () => {
    it('should get the enum value if present', () => {
      expect(getOptionValue({ enumType: 'foo:bar', id: 'bar' } as FilterOption)).toEqual('foo:bar')
    })

    it('should get the id if no enum value is present', () => {
      expect(getOptionValue({ enumType: null, id: 'bar' } as FilterOption)).toEqual('bar')
    })
  })
})
