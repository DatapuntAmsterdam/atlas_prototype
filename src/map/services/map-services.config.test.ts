import { getShowInTableBlock } from './map-services.config'

describe('map-services', () => {
  describe('getShowInTableBlock', () => {
    it('should build 3 objects with links generated to dataselection', () => {
      const result = getShowInTableBlock([
        { key: 'foo', value: 'bar' },
        { key: 'baz', value: 'bar' },
      ])

      expect(result).toHaveLength(3)

      result.forEach(({ links }) => {
        expect(links?.[0].to.search).toContain(
          `%7B%22foo%22%3A%22bar%22%2C%22baz%22%3A%22bar%22%7D`,
        )
      })
    })
  })
})
