import type { FilterOption } from '../../models/filter'
import { formatAllOptionLabel, formatOptionLabel } from './utils'

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
})
