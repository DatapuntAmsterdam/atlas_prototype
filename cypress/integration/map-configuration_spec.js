const mapLayers = []

// Get all the maplayer names from the atlas configuration that should be hosted on map server
const mapLayersNames = mapLayers
  .map((mapLayer) => {
    const layers = mapLayer.layers && !mapLayer.external ? mapLayer.layers : []
    const legendItemLayers = mapLayers.legendItems
      ? mapLayers.legendItems.map((legendItemLayer) => legendItemLayer.layers)
      : []

    return [...layers, ...legendItemLayers]
  })
  .flat()

describe('map configuration', () => {
  it('returns JSON', () => {
    cy.request('https://acc.map.data.amsterdam.nl/sld/config.json')
      .its('headers')
      .its('content-type')
      .should('include', 'application/json')
  })

  it('should return the maplayers from mapserver', () => {
    const getMapServerLayers = () =>
      cy.request('https://acc.map.data.amsterdam.nl/sld/config.json').its('body').its('mapfiles')

    const mapServerLayers = getMapServerLayers()

    // Check if each layer has the expected fields
    mapServerLayers.each((value) => expect(value).to.have.keys('file_name', 'layers', 'name'))

    // Send a request to the mapserver configuration file
    getMapServerLayers()
      .then((mapfiles) => [
        // get all the layer names and file_name e.g. all the possible map layer names
        ...mapfiles.map((mapfile) => mapfile.layers).flat(),
        ...mapfiles.map((mapfile) => ({ name: mapfile.file_name })),
      ])
      .then((layers) => layers.map((layer) => layer.name)) // creates and array of all the map layer names on the mapserver
      .then((layerNames) => {
        // eslint-disable-next-line array-callback-return
        mapLayersNames.map((mapLayerName) => {
          expect(layerNames).to.include(mapLayerName) // check if all the names from the atlas maplayer config exists on the mapserver
        })
      })
  })
})
