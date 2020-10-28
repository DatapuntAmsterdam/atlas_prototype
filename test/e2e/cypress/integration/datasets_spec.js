import { DATA_SETS, DATA_SEARCH, SEARCH } from '../support/selectors'

describe('datasets module', () => {
  describe('user should be able to navigate to the datasets catalogus from the homepage', () => {
    beforeEach(() => {
      cy.viewport('macbook-15')
      cy.server()
      cy.route('POST', '/cms_search/graphql/').as('graphql')
      cy.route('/jsonapi/node/list/**').as('jsonapi')
      cy.hidePopup()

      cy.visit('/')

      cy.wait('@jsonapi')
      cy.get('h3').should('be.visible').and('contain', 'Datasets')
    })

    it('should open the datasets catalogus without a filter and see results', () => {
      cy.get('[data-test=navigation-block] > [href="/datasets/zoek/"]').should('be.visible').click()
      cy.url().should('include', '/datasets/zoek')

      cy.wait('@graphql')
      cy.wait('@graphql')

      cy.contains('Datasets (')

      // Check if there are 20 results shown
      cy.get(DATA_SETS.dataSetLink).should('have.length', 20).should('be.visible')
    })

    it('should open a dataset', () => {
      cy.route('/dcatd/datasets/*').as('getDataset')
      // click on the link to go to the datasets without a specified catalogus theme
      cy.get('[data-test=navigation-block] > [href="/datasets/zoek/"]').should('be.visible').click()

      cy.url().should('include', '/datasets/zoek')

      cy.wait('@graphql')
      cy.wait('@graphql')

      cy.contains('Datasets (')

      // Check if there are 20 results shown
      cy.get(DATA_SETS.dataSetLink).should('have.length', 20).should('be.visible')

      // Open first result
      cy.get(DATA_SETS.dataSetLink).last().click()
      cy.wait('@getDataset')

      // check detail titles
      cy.get('h2').should('be.visible').and('contain', 'Dataset')
      cy.get('h2').should('be.visible').and('contain', 'Resources')
      cy.get('h2').should('be.visible').and('contain', 'Details')
      cy.get('h2').should('be.visible').and('contain', "Thema's")
      cy.get('h2').should('be.visible').and('contain', 'Tags')
      cy.get('h2').should('be.visible').and('contain', 'Licentie')

      // as downloading is not testable, we check for the presence of href
      cy.get('.resources-item').should('exist').and('be.visible').and('have.attr', 'href')
    })

    it('should show the results of theme Bestuur', () => {
      cy.get('h2').should('contain', 'Zoek op thema').and('be.visible')

      // click on the link to go to the datasets with a specified catalogus theme
      cy.get('a[href*="/zoek/"]:contains("Bestuur")').click()

      // check url on filter with theme
      cy.url().should('include', '/zoek/?filters=theme')
      cy.wait(['@graphql', '@graphql'])

      cy.contains('Categorieën').should('be.visible')
      cy.contains("Thema's").should('be.visible')
      cy.contains('Bestuur').should('be.visible')

      //  Check if checkbox is checked. Use css.escape because of : in id.
      cy.get(`#${CSS.escape('theme-theme:bestuur')}`).should('be.checked')
    })

    it('should filter datasets', () => {
      cy.get('[data-test=navigation-block] > [href="/datasets/zoek/"]').should('be.visible').click()
      cy.url().should('include', '/datasets/zoek')

      cy.wait('@graphql')
      cy.wait('@graphql')

      cy.contains('Datasets (')
      cy.wait(500)
      // Count amount of Datasets
      cy.get('h1')
        .contains('Datasets')
        .then(($datasetsText) => {
          const datasetsNumber = $datasetsText.text().match(/\d+/)[0]
          cy.log(datasetsNumber)
          Cypress.env('countDatasets', datasetsNumber)
        })

      cy.get(`#${CSS.escape('theme-theme:bestuur')}`).check({ force: true })

      // Count amount of Datasets again and check against previous
      cy.wait(800)
      cy.get('h1')
        .contains('Datasets')
        .then(($datasetsText) => {
          const datasetsNumber = $datasetsText.text().match(/\d+/)[0]
          cy.log(datasetsNumber)
          expect(parseInt(datasetsNumber, 10)).lessThan(parseInt(Cypress.env('countDatasets'), 10))
        })
    })
  })

  describe('user should be able to search and see results', () => {
    beforeEach(() => {
      cy.server()
      cy.route('POST', '/cms_search/graphql/').as('graphql')
      cy.route('/jsonapi/node/list/**').as('jsonapi')
      cy.hidePopup()

      cy.visit('/')
      cy.wait('@jsonapi')
    })

    it('should open the datasets results', () => {
      cy.get(DATA_SEARCH.searchBarFilter).select('Alle zoekresultaten')
      cy.get(SEARCH.input).type('Park')
      cy.get(DATA_SEARCH.autoSuggest).submit()
      cy.url().should('include', '/zoek/?term=Park')
      cy.wait(['@graphql', '@graphql'])

      // Check if datasets are visible
      cy.get('h2').should('be.visible').and('contain', 'Datasets')
    })

    it('should not open the datasets results because there are no results', () => {
      cy.get(SEARCH.input).trigger('focus')
      cy.get(SEARCH.input).type('NORESULTS')
      cy.get(DATA_SEARCH.autoSuggest).submit()
      cy.url().should('include', '/zoek/?term=NORESULTS')
      cy.wait(['@graphql', '@graphql'])
      cy.contains("Er zijn geen resultaten gevonden met 'NORESULTS'").should('be.visible')
    })

    it('should show only datasets after filtering', () => {
      cy.server()
      cy.route(`typeahead?q=vergunningen`).as('typeaheadResults')
      cy.route('/dcatd/datasets/*').as('getDataset')
      cy.get(SEARCH.input).trigger('focus')
      cy.get(SEARCH.input).type('Vergunningen')
      cy.wait('@typeaheadResults')
      cy.wait(500)
      cy.get(DATA_SEARCH.autoSuggest).click()
      cy.get(DATA_SEARCH.autoSuggestHeader)
        .contains('Datasets')
        .siblings('ul')
        .children('li')
        .eq(2)
        .click()
      cy.wait('@getDataset')

      // Check if dataset is shown
      cy.get(DATA_SEARCH.headerSubTitle, { timeout: 10000 })
        .should('contain', 'Dataset')
        .and('be.visible')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', 'Resources').and('be.visible')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', 'Details').and('be.visible')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', "Thema's").and('be.visible')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', 'Tags').and('be.visible')
      cy.get(DATA_SEARCH.headerSubTitle).should('contain', 'Licentie').and('be.visible')
      cy.get(DATA_SETS.datasetItem).should('be.visible')

      cy.get(DATA_SEARCH.searchBarFilter).select('Datasets')
      cy.get(SEARCH.input).clear().type('Vergunningen{enter}')

      cy.contains("Datasets met 'Vergunningen' (").should('be.visible')
      cy.should('not.contain', "Alle zoekresultaten met 'Vergunningen'")
    })
  })

  describe.skip('Create, change and delete a dataset', () => {
    beforeEach(() => {
      cy.server()
      cy.hidePopup()
    })

    before(() => {
      cy.login('EMPLOYEE_PLUS')
    })

    after(() => {
      cy.logout()
    })

    it('Should edit a dataset', () => {
      cy.server()
      cy.route('POST', '/cms_search/graphql/').as('graphql')
      cy.route('/jsonapi/node/list/**').as('jsonapi')
      cy.route('/dcatd/openapi').as('getOpenapi')
      cy.route('/dcatd/datasets/*').as('getDataset')
      cy.route('PUT', '/dcatd/datasets/*').as('putDataset')
      // click on the link to go to the datasets without a specified catalogus theme
      cy.get('[data-test=navigation-block] > [href="/datasets/zoek/"]').should('be.visible').click()

      cy.wait('@graphql')
      cy.url().should('include', '/datasets/zoek')

      cy.contains('Datasets (')

      // Check if there are 20 results shown
      cy.get(DATA_SETS.dataSetLink).should('have.length', 20).should('be.visible')

      // Open first result
      cy.contains('Gasten en overnachtingen in Amsterdam').first().click()

      // Change the dataset
      cy.contains('Wijzigen').click()
      cy.wait('@getOpenapi')
      cy.wait('@getDataset')

      cy.get(`#${CSS.escape('dataset_dct:title')}`)
        .clear()
        .type('Gasten en overnachtingen in Rotterdam, de MRA en Nederland 2012-2019')
      cy.get(`#${CSS.escape('dataset_overheidds:doel')}`)
        .clear()
        .type('Verzamelen statistiekjes')
      cy.get(`#${CSS.escape('dataset_ams:spatialDescription')}`)
        .clear()
        .type('Metropoolregio Rotterdam')
      cy.get(`#${CSS.escape('dataset_ams:owner')} > .search`).type('Amsterdam Marketing{enter}')

      cy.contains('Opslaan').click()
      cy.wait('@putDataset')
      cy.wait('@getOpenapi')
      cy.wait('@getDataset')

      cy.contains('Gasten en overnachtingen in Rotterdam, de MRA en Nederland 2012-2019')
      cy.contains('Verzamelen statistiekjes')
      cy.contains('Metropoolregio Rotterdam')
      cy.contains('Amsterdam Marketing')

      // Revert changes in dataset
      cy.contains('Wijzigen').click()
      cy.wait('@getOpenapi')
      cy.wait('@getDataset')

      cy.get(`#${CSS.escape('dataset_dct:title')}`)
        .clear()
        .type('Gasten en overnachtingen in Amsterdam, de MRA en Nederland 2012-2019')
      cy.get(`#${CSS.escape('dataset_overheidds:doel')}`)
        .clear()
        .type('Verzamelen statistieken')
      cy.get(`#${CSS.escape('dataset_ams:spatialDescription')}`)
        .clear()
        .type('Metropoolregio Amsterdam')
      cy.get(`#${CSS.escape('dataset_ams:owner')} > .search`).type(
        'Gemeente Amsterdam, Onderzoek, Informatie en Statistiek{enter}',
      )

      cy.contains('Opslaan').click()
      cy.wait('@putDataset')
      cy.wait('@getOpenapi')
      cy.wait('@getDataset')

      cy.contains('Gasten en overnachtingen in Amsterdam, de MRA en Nederland 2012-2019')
      cy.contains('Verzamelen statistieken')
      cy.contains('Metropoolregio Amsterdam')
      cy.contains('Gemeente Amsterdam, Onderzoek, Informatie en Statistiek')
    })
    it('Should create a new dataset', () => {
      cy.server()
      cy.route('/dcatd/datasets').as('getDatasets')
      cy.route('POST', '/dcatd/datasets').as('postDataset')
      cy.visit('/dcatd_admin#/datasets')
      cy.wait('@getDatasets')

      cy.contains('Dataset aanmaken').click()

      cy.get(`#${CSS.escape('dataset_dct:title')}`)
        .clear()
        .type('Stand van de leeuwenpopulatie in het wallengebied van Amsterdam')

      cy.get(`#${CSS.escape('dataset_dct:description')}`)
        .clear()
        .type('Diverse datasets met statistieken van Onderzoek, Informatie en Statistiek.')

      cy.get(`#${CSS.escape('dataset_ams:status')}`).select('Beschikbaar')

      cy.get(`#${CSS.escape('dataset_overheidds:doel')}`)
        .clear()
        .type('Verzamelen statistieken.')

      cy.get(`#${CSS.escape('dataset_ams:temporalUnit')}`).select('Realtime')

      cy.get(`#${CSS.escape('dataset_dcat:contactPoint_vcard:fn')}`)
        .clear()
        .type('Loekie de Leeuw')

      cy.get(`#${CSS.escape('dataset_ams:owner')} > .search`).type(
        'Gemeente Amsterdam, Onderzoek, Informatie en Statistiek{enter}',
      )

      cy.get(`#${CSS.escape('dataset_dct:publisher_foaf:name')}`)
        .clear()
        .type('Paul de Leeuw')

      cy.get(`#${CSS.escape('dataset_dcat:theme')}`).type('Bevolking{enter}')

      cy.get(`#${CSS.escape('dataset_dcat:theme')} > .dropdown`).click()

      cy.get(`#${CSS.escape('dataset_dcat:keyword')}`).type('Kerncijfers{enter}')

      cy.get(`#${CSS.escape('dataset_dcat:keyword')} > .dropdown`).click()

      cy.contains('Opslaan').click()
      cy.wait('@getDatasets')
      cy.url().should('include', '/dcatd_admin#/datasets')
      cy.contains('Stand van de leeuwenpopulatie in het wallengebied van Amsterdam')
      cy.visit('/')
      cy.get('[data-test=navigation-block] > [href="/datasets/zoek/"]').should('be.visible').click()
      cy.url().should('include', '/datasets/zoek')

      cy.contains('Datasets (')

      cy.get(SEARCH.input).trigger('focus')
      cy.get(SEARCH.input).type('leeuw')
      cy.get(DATA_SEARCH.autoSuggest).submit()
      cy.url().should('include', '/zoek/?term=leeuw')
      cy.contains('Stand van de leeuwenpopulatie in het wallengebied van Amsterdam')
    })
    it('Should delete a dataset', () => {
      cy.server()
      cy.route('/dcatd/datasets').as('getDatasets')
      cy.route('POST', '/dcatd/datasets/*').as('postDataset')
      cy.route('/dcatd/openapi').as('getOpenapi')
      cy.route('/jsonapi/node/list/**').as('jsonapi')
      cy.visit('/dcatd_admin#/datasets')
      cy.wait('@getDatasets')
      cy.contains('Stand van de leeuwenpopulatie in het wallengebied van Amsterdam').click()
      cy.contains('Dataset verwijderen').click()
      cy.get('.actions > .dcatd-form-button-submit').click()
      cy.get('.actions > .dcatd-form-button').click()
      cy.contains('Dataset verwijderen').click()
      cy.get('.actions > .dcatd-form-button-submit').click()
      cy.visit('/')
      cy.wait('@jsonapi')
    })
  })
})
