import { MAP } from './selectors'

declare global {
  // eslint-disable-next-line no-redeclare
  namespace Cypress {
    interface Chainable<Subject> {
      checkAerialPhotos(): void
      checkTopography(): void
      checkMapLayerCategory(category: string): void
      checkMapLayer(layerName: string, checkboxId: string, amountOfLayers: number): void
      checkAllLayers(): void
    }
  }
}

Cypress.Commands.add('checkAerialPhotos', () => {
  const aerial = [
    'Luchtfoto 2020',
    'Infrarood 2020',
    'Luchtfoto 2019',
    'Luchtfoto 2018',
    'Infrarood 2018',
    'Luchtfoto 2017',
    'Luchtfoto 2016',
    'Luchtfoto 2015',
    'Luchtfoto 2014',
    'Luchtfoto 2013',
    'Luchtfoto 2012',
    'Luchtfoto 2011',
    'Luchtfoto 2010',
    'Luchtfoto 2009',
    'Luchtfoto 2008',
    'Luchtfoto 2007',
    'Luchtfoto 2006',
    'Luchtfoto 2005',
    'Luchtfoto 2004',
    'Luchtfoto 2003',
  ]
  cy.get(MAP.dropDownLuchtfoto)
    .find('li')
    .each(($div, i) => {
      expect($div).to.have.text(aerial[i])
    })
})

Cypress.Commands.add('checkTopography', () => {
  const topograhy = ['Topografie', 'Topografie licht', 'Topografie grijs']
  cy.get(MAP.dropDownTopografie)
    .find('li')
    .each(($div, i) => {
      expect($div).to.have.text(topograhy[i])
    })
})

Cypress.Commands.add('checkMapLayerCategory', (category: string) => {
  cy.get(MAP.mapContainer).should('be.visible')
  cy.get(MAP.mapLegend).should('not.exist')
  cy.get(MAP.mapPanelHandle)
    .find(MAP.mapLegendLabel)
    .contains(category)
    .parents(MAP.mapLegendItemButton)
    .click('right')
  cy.get(MAP.mapZoomIn).click()
  cy.get(MAP.imageLayer).should('not.exist')
})

Cypress.Commands.add(
  'checkMapLayer',
  (layerName: string, checkboxId: string, amountOfLayers: number) => {
    cy.get(MAP.mapLegendLayer)
      .find(MAP.mapLegendLabel)
      .contains(layerName)
      .scrollIntoView()
      .should('be.visible')
      .siblings(MAP.mapLegendCheckbox)
      .find(checkboxId)
      .check({ force: true })
      .should('be.checked')
    cy.get(MAP.imageLayer).should('exist').and('have.length', amountOfLayers)
  },
)

Cypress.Commands.add('checkAllLayers', () => {
  // eslint-disable-next-line no-async-promise-executor
  const promise = new Promise(async (resolve) => {
    const allLayersResponse = await fetch('https://acc.api.data.amsterdam.nl/cms_search/graphql/', {
      headers: {
        accept: '*/*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,nl;q=0.7',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        pragma: 'no-cache',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
      referrer: 'https://acc.data.amsterdam.nl/',
      referrerPolicy: 'strict-origin',
      body:
        '{"query":"{\\n    mapLayerSearch(input: { limit: 9999 }) {\\n      results {\\n        id\\n        title\\n        legendItems {\\n          ... on MapLayer {\\n            __typename\\n            id\\n          }\\n        }\\n        url\\n        params\\n        layers\\n        external\\n        detailUrl\\n        detailParams {\\n          item\\n          datasets\\n        }\\n        detailIsShape\\n        noDetail\\n        authScope\\n        type\\n      }\\n    }\\n  }"}',
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
    }).then((response) => response.json())

    const { results: allLayers } = allLayersResponse.data.mapLayerSearch
    const result = await allLayers
      .filter(({ url }: any) => url && url.startsWith('/'))
      .map(({ url, layers, id }: any) => {
        const query = {
          service: 'WMS',
          request: 'GetMap',
          version: '1.1.1',
          layers,
          format: 'image/png',
          transparent: 'true',
          identify: 'false',
          srs: 'EPSG:28992',
          width: '1326',
          height: '973',
          bbox: '111289.3026017888,480758.2304247047,129109.84580896495,493828.3796077176',
        }
        const searchParams = new URLSearchParams(query)
        return fetch(`https://map.data.amsterdam.nl${url}?${searchParams.toString()}`)
          .then((response02) => {
            if (response02.headers.get('content-type') !== 'image/png') {
              // eslint-disable-next-line no-console
              console.warn(
                "This layer doesn't receive an image",
                id,
                allLayersResponse.headers.get('content-type'),
              )
              return `This layer doesn't receive an image: ${id}, received type: ${allLayersResponse.headers.get(
                'content-type',
              )}`
            }
            return undefined
          })
          .catch((e) => `Fetching this layer failed: ${id}, received error: ${e}`)
      })

    const resolvedResult = await Promise.all(result)
    const possibleFailedLayers = resolvedResult.filter((r) => r)

    // eslint-disable-next-line no-console
    console.log(possibleFailedLayers)

    resolve({
      possibleFailedLayers,
    })
  })

  // Length 1, because layer rtsvr ("title": "Routes - Vrachtauto") is always failing. Parmeter layers is missing in the config.
  cy.wrap(promise, { timeout: 30000 }).its('possibleFailedLayers').should('have.length', 1)
})
