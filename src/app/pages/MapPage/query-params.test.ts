import { panoTagParam } from './query-params'

describe('Map Query Parameters', () => {
  describe('Panorama', () => {
    describe('tags', () => {
      it('should encode the value to parameter value', () => {
        expect(panoTagParam.encode('pano2016bi')).toBe('pano2016bi')
      })

      it('should decode the value from the parameter', () => {
        expect(panoTagParam.decode('pano2017woz')).toBe('pano2017woz')
      })

      it('should decode values from legacy panorama URLs, to make sure old URLs still work', () => {
        expect(panoTagParam.decode('mission-2016,mission-bi')).toBe('pano2016bi')
        expect(panoTagParam.decode('mission-2017,mission-woz')).toBe('pano2017woz')
      })

      it('should fall back to default value if parameter value is not correct', () => {
        expect(panoTagParam.decode('somevalue')).toBe(panoTagParam.defaultValue)
        expect(panoTagParam.decode('somevalue,mission-woz')).toBe(panoTagParam.defaultValue)
        expect(panoTagParam.decode('some-value,missionwoz')).toBe(panoTagParam.defaultValue)
        expect(panoTagParam.decode('somevalue,missionwoz,someothervalue')).toBe(
          panoTagParam.defaultValue,
        )
      })
    })
  })
})
