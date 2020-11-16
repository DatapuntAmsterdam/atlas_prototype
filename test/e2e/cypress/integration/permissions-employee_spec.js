import { urls, values } from '../support/permissions-constants'
import {
  DATA_DETAIL,
  DATA_SEARCH,
  DATA_SELECTION_TABLE,
  DETAIL_PANEL,
  MAP,
} from '../support/selectors'

describe('employee permissions', () => {
  beforeEach(() => {
    cy.server()
    cy.hidePopup()
  })
  before(() => {
    cy.login('EMPLOYEE')
  })

  after(() => {
    cy.logout()
  })
  describe('BRK information', () => {
    it('1. Should show "Kadastrale subjecten" for medewerker in the autosuggest', () => {
      cy.route('/typeahead?q=bakker*').as('getResults')
      cy.visit('/')

      cy.get(DATA_SEARCH.autoSuggestInput).focus().click().type('bakker')

      cy.wait('@getResults')
      cy.get(DATA_SEARCH.autoSuggestDropdown).get('h4').invoke('width').should('be.gt', 0)
      cy.get(DATA_SEARCH.autoSuggestTip).should('be.visible')
      cy.get(DATA_SEARCH.autoSuggestDropdown).contains(values.vestigingen).should('be.visible')
      cy.get(DATA_SEARCH.autoSuggestDropdown)
        .contains(values.maatschappelijkeActiviteiten)
        .should('be.visible')
      cy.get(DATA_SEARCH.autoSuggestDropdown)
        .contains(values.kadastraleSubjecten)
        .scrollIntoView()
        .should('be.visible')
      cy.get(DATA_SEARCH.autoSuggestDropdown)
        .contains(' & Toledo Holding B.V.')
        .should('be.visible')
    })
    it('2. Should show "Kadastrale subjecten" and "Vestigingen" in the search results', () => {
      cy.route('/typeahead?q=bakker*').as('getResults')
      cy.visit('/')

      cy.get(DATA_SEARCH.autoSuggestInput).focus().type('bakker{enter}')

      cy.wait('@getResults')
      cy.contains('Vestigingen (').should('be.visible')
      cy.contains('Maatschappelijke activiteiten (').should('be.visible')
      cy.contains('Kadastrale subjecten (').should('be.visible')
      cy.contains('Bakker & Toledo Holding B.V.').should('be.visible')
    })
    it('3. Should allow an employee to view a natural person but not the "Zakelijke rechten"', () => {
      cy.route('/brk/subject/*').as('getSubject')
      cy.visit(urls.natuurlijk)

      cy.wait('@getSubject')
      cy.contains(
        'Medewerkers met speciale bevoegdheden kunnen alle gegevens zien (ook Zakelijke rechten).',
      )
      cy.checkListItems('../fixtures/kadastraalSubjectNatural.json')
      cy.get(DATA_DETAIL.definitionList).should('not.contain', 'Statutaire zetel')
      cy.checkInfoBoxes(['Kadastra', 'Zakelijke rechten'])
    })

    it('4. Should allow an employee to view a non-natural subject with "Zakelijke rechten"', () => {
      cy.route('/brk/subject/*').as('getSubject')
      cy.visit(urls.nietNatuurlijk)

      cy.wait('@getSubject')
      cy.checkListItems('../fixtures/kadastraalSubjectNonNatural.json')
      cy.checkLinkItems('../fixtures/kadastraalSubjectNonNatural.json')
      cy.get(DATA_DETAIL.linkList).contains('Eigendom (recht van)')
      cy.checkInfoBoxes(['Kadastra', 'Zakelijke rechten'])
    })

    it('5. Should show an employee all info for a kadastraal object', () => {
      cy.route('/brk/object/*').as('getObject')
      cy.route('/brk/object-expand/*').as('getObjectExpand')
      cy.route('/bag/v1.1/nummeraanduiding/?kadastraalobject=*').as('getNummeraanduidingen')
      cy.route('/panorama/thumbnail?*').as('getPanorama')
      cy.visit(urls.business)

      cy.wait('@getObject')
      cy.wait('@getObjectExpand')
      cy.wait('@getNummeraanduidingen')
      cy.wait('@getPanorama')
      cy.checkListItems('../fixtures/kadastraalObject.json')
      cy.checkLinkItems('../fixtures/kadastraalObject.json')
      cy.get(DETAIL_PANEL.panoramaPreview).should('be.visible')
      cy.contains('Besluit op basis van Monumentenwet 1988,').scrollIntoView().should('be.visible')

      cy.checkInfoBoxes([
        'Kadastra',
        'Zakelijke rechten',
        'Ontstaan uit',
        'Betrokken bij',
        'Adressen',
      ])
    })
  })
  describe('BAG information', () => {
    it('1. Should show an employee all info for an address', () => {
      cy.defineAddressDetailRoutes()
      cy.visit(urls.address)
      cy.waitForAdressDetail()

      // Wait for all listitems to be visible
      cy.get(DATA_DETAIL.linkList).should('have.length', 6)

      cy.checkListItems('../fixtures/verblijfsObject.json')
      cy.checkLinkItems('../fixtures/verblijfsObject.json')
      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes([
        'Adressen',
        'Verblijfsobjecten',
        'Adressen',
        'Panden',
        'Vestigingen',
        'Kadastrale objecten',
        'Monumenten',
        'Bouw- en omgevingsdossiers',
      ])
      cy.contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om vestigingen te bekijken.',
      ).should('not.exist')
      cy.contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te informatie te vinden over: Kadastrale objecten.',
      )
        .scrollIntoView()
        .should('be.visible')
    })
    it('2. Should show an employee all "Pand" information', () => {
      cy.route('/bag/v1.1/pand/*').as('getPand')
      cy.route('/monumenten/monumenten/?betreft_pand=*').as('getMonumenten')
      cy.route('/bag/v1.1/nummeraanduiding/?pand=*').as('getNummeraanduidingen')
      cy.route('/handelsregister/vestiging/?pand=*').as('getVestigingen')
      cy.route('panorama/thumbnail?*').as('getPanorama')

      cy.visit(urls.pand)

      cy.wait('@getPand')
      cy.wait('@getMonumenten')
      cy.wait('@getNummeraanduidingen')
      cy.wait('@getVestigingen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/pand.json')
      cy.checkLinkItems('../fixtures/pand.json')
      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('3. Should show an employee all information in a "ligplaats" search', () => {
      cy.route('/bag/v1.1/ligplaats/*').as('getLigplaats')
      cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
      cy.route('/panorama/thumbnail?*').as('getPanorama')
      cy.route('/handelsregister/vestiging/?*').as('getVestigingen')

      cy.visit(urls.ligplaats)

      cy.wait('@getLigplaats')
      cy.wait('@getNummeraanduiding')
      cy.wait('@getPanorama')
      cy.wait('@getVestigingen')

      cy.checkListItems('../fixtures/ligplaats.json')
      cy.checkLinkItems('../fixtures/ligplaats.json')

      cy.get(DETAIL_PANEL.panoramaPreview).should('be.visible')
      cy.checkInfoBoxes(['Adressen', 'Ligplaatsen', 'Vestigingen'])
    })

    it('4. Should show an employee all information in "standplaats" search', () => {
      cy.route('/bag/v1.1/standplaats/*').as('getStandplaats')
      cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
      cy.route('/handelsregister/vestiging/?nummeraanduiding=*').as('getVestigingen')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit(urls.standplaats)

      cy.wait('@getStandplaats')
      cy.wait('@getNummeraanduiding')
      cy.wait('@getVestigingen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/standplaats.json')
      cy.checkLinkItems('../fixtures/standplaats.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
      cy.checkInfoBoxes(['Adressen', 'Standplaatsen', 'Vestigingen', 'Monumenten'])
    })
    it('5. Should show an employee all information in "woonplaats" panel', () => {
      cy.route('bag/v1.1/woonplaats/*').as('getWoonplaats')
      cy.route('/bag/v1.1/openbareruimte/*').as('getOpenbareRuimte')
      cy.visit('data/bag/woonplaats/id3594/?zoom=7')
      cy.wait('@getWoonplaats')
      cy.wait('@getOpenbareRuimte')

      cy.checkListItems('../fixtures/woonplaats.json')
      cy.checkLinkItems('../fixtures/woonplaats.json')

      cy.checkInfoBoxes(['Woonplaatsen', 'Openbare ruimtes'])
    })
  })
  describe('HR information', () => {
    it('1. Should allow an employee to view "Vestigingen" in table', () => {
      cy.route('/dataselectie/hr/*').as('getHR')

      cy.visit(urls.vestigingenTabel)

      cy.wait('@getHR')
      cy.get(DATA_SEARCH.infoNotification).should('not.exist')
      cy.get(DATA_SELECTION_TABLE.table).contains('Handelsnaam')
    })
    it('2. Should allow an employee to view "vestiging" in detail panel', () => {
      cy.route('/handelsregister/vestiging/*').as('getVestiging')
      cy.route('/handelsregister/maatschappelijkeactiviteit/*').as('getMaatschappelijkeActiviteit')

      cy.visit(urls.vestiging)
      cy.wait('@getVestiging')
      cy.wait('@getMaatschappelijkeActiviteit')

      cy.checkListItems('../fixtures/vestiging.json')
      cy.checkLinkItems('../fixtures/vestiging.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
      cy.checkInfoBoxes(['Vestigingen', 'Maatschappelijke activiteiten'])

      cy.get(MAP.toggleFullScreen).click()
      cy.get('.map-detail-result__item-value').contains(values.vestigingName)
    })

    it('3. Should allow an employee to view "maatschappelijke activiteit"', () => {
      cy.route('/handelsregister/maatschappelijkeactiviteit/*').as('getMaatschappelijkeActiviteit')
      cy.route('/handelsregister/persoon/*').as('getPersoon')
      cy.route('/handelsregister/vestiging/?maatschappelijke_activiteit=*').as('getVestigingen')
      cy.route('/handelsregister/functievervulling/?heeft_aansprakelijke=*').as(
        'getFunctievervullingen',
      )

      cy.visit(urls.maatschappelijkeActiviteit)
      cy.wait('@getMaatschappelijkeActiviteit')
      cy.wait('@getPersoon')
      cy.wait('@getVestigingen')
      cy.wait('@getFunctievervullingen')

      cy.checkListItems('../fixtures/maatschappelijkeActiviteit.json')
      cy.checkLinkItems('../fixtures/maatschappelijkeActiviteit.json')

      cy.checkInfoBoxes(['Maatschappelijke activiteiten', 'Functievervullingen', 'Vestigingen'])
    })
  })
  describe('Gebieden information', () => {
    it('1. Should allow an employee to view "bouwblok"', () => {
      cy.route('/gebieden/bouwblok/*').as('getBouwblok')
      cy.route('/bag/v1.1/pand/?bouwblok*').as('getPand')
      cy.route('/meetbouten/meetbout/?bouwbloknummer*').as('getMeetbout')

      cy.visit('data/gebieden/bouwblok/id03630023380624/')

      cy.wait('@getBouwblok')
      cy.wait('@getPand')
      cy.wait('@getMeetbout')

      cy.checkListItems('../fixtures/bouwblok.json')
      cy.checkLinkItems('../fixtures/bouwblok.json')

      cy.checkInfoBoxes(['Bouwblokken', 'Panden', 'Meetbouten'])
    })
    it('2. Should allow an employee to view "buurt"', () => {
      cy.route('/gebieden/buurt/*').as('getBuurt')
      cy.route('/gebieden/bouwblok/?buurt=*').as('getBouwblok')
      cy.route('/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/gebieden/buurt/id03630000000425/')
      cy.wait('@getBuurt')
      cy.wait('@getBouwblok')
      cy.wait('@getPanorama')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkListItems('../fixtures/buurt.json')
      cy.checkLinkItems('../fixtures/buurt.json')

      cy.checkInfoBoxes([
        'Buurten',
        'Bouwblokken',
        'Adressen',
        'Vestigingen',
        'Kadastrale objecten',
      ])
    })
    it('3. Should allow an employee to view "gebiedsgerichtwerken-gebied"', () => {
      cy.route('/gebieden/gebiedsgerichtwerken/*').as('getGebiedsgerichtwerken')
      cy.route('/gebieden/buurt/?gebiedsgerichtwerken*').as('getBuurt')
      cy.route('/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/gebieden/gebiedsgerichtwerken/idDX17/')
      cy.wait('@getGebiedsgerichtwerken')
      cy.wait('@getBuurt')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/gebiedsgerichtwerken.json')
      cy.checkLinkItems('../fixtures/gebiedsgerichtwerken.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes([
        'Gebiedsgerichtwerken-gebieden',
        'Adressen',
        'Vestigingen',
        'Kadastrale objecten',
        'Buurten',
      ])
    })
    it('4. Should allow an employee to view "stadsdeel"', () => {
      cy.route('/gebieden/stadsdeel/*').as('getstadsdeel')
      cy.route('gebieden/buurtcombinatie/?stadsdeel=*').as('getBuurtcombinatie')
      cy.route('/gebieden/gebiedsgerichtwerken/?stadsdeel*').as('getGebiedsgerichtwerken')
      cy.route('/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/gebieden/stadsdeel/id03630000000019/')
      cy.wait('@getstadsdeel')
      cy.wait('@getBuurtcombinatie')
      cy.wait('@getGebiedsgerichtwerken')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/stadsdeel.json')
      cy.checkLinkItems('../fixtures/stadsdeel.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes([
        'Stadsdelen',
        'Wijken',
        'Gebiedsgerichtwerken-gebieden',
        'Adressen',
        'Vestigingen',
        'Kadastrale objecten',
      ])
    })
    it('5. Should allow an employee to view "buurtcombinatie"', () => {
      cy.route('/gebieden/buurtcombinatie/*').as('getBuurtcombinatie')
      cy.route('/gebieden/buurt/?buurtcombinatie*').as('getBuurt')
      cy.route('/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/gebieden/buurtcombinatie/3630012052036/')
      cy.wait('@getBuurtcombinatie')
      cy.wait('@getBuurt')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/buurtcombinatie.json')
      cy.checkLinkItems('../fixtures/buurtcombinatie.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['Wijken', 'Buurten', 'Adressen', 'Vestigingen', 'Kadastrale objecten'])
    })
    it('6. Should allow an employee to view "grootstedelijk gebied"', () => {
      cy.route('/gebieden/grootstedelijkgebied/*').as('getGrootstedelijkgebied')
      cy.route('/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/gebieden/grootstedelijkgebied/idzuidelijke-ijoever_od/')
      cy.wait('@getGrootstedelijkgebied')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/grootstedelijkGebied.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['Grootstedelijke gebieden'])
    })
    it('7. Should allow an employee to view "unesco"', () => {
      cy.route('/gebieden/unesco/kernzone/').as('getUnesco')
      cy.route('/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/gebieden/unesco/idkernzone/?lagen=culterf-unesco%3A1&zoom=9')
      cy.wait('@getUnesco')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/unesco.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['UNESCO'])
    })
  })
  describe('Monumenten en complexen', () => {
    it('1. Should show an employee all information in "monument"', () => {
      cy.route('/monumenten/monumenten/*').as('getMonument')
      cy.route('/monumenten/situeringen/?monument_id=*').as('getSitueringen')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/monumenten/monumenten/id3cf53160-d8bf-4447-93ba-1eb03a35cfe4/')

      cy.wait('@getMonument')
      cy.wait('@getSitueringen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/monument.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['Monumenten', 'Complexen', 'Panden', 'Adressen'])
    })

    it('2. Should show an employee all information in "monument complex"', () => {
      cy.route('/monumenten/complexen/*').as('getComplex')
      cy.route('/monumenten/monumenten/?complex_id=*').as('getMonumenten')

      cy.visit('data/monumenten/complexen/id182a9861-4052-4127-8300-6450cd75b6a5')

      cy.wait('@getComplex')
      cy.wait('@getMonumenten')

      cy.checkListItems('../fixtures/complex.json')

      cy.checkInfoBoxes(['Complexen', 'Monumenten'])
    })
  })
  describe('Vsd', () => {
    it('1. panel bedrijfinvesteringszone', () => {
      cy.route('/vsd/biz/*').as('getBiz')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/vsd/biz/id11/?lagen=wnklgeb-biz%3A1')

      cy.wait('@getBiz')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/bedrijfsinvesteringszone.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('2. panel bekendmaking', () => {
      cy.route('/vsd/bekendmakingen/4115/').as('getBekendmaking')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/vsd/bekendmakingen/id4115/')

      cy.wait('@getBekendmaking')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/bekendmaking.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('3. panel winkelgebied', () => {
      cy.route('/vsd/winkgeb/3/').as('getWinkelgebied')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/vsd/winkgeb/id3/')

      cy.wait('@getWinkelgebied')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/winkelgebied.json')

      cy.contains(
        'De grenzen van dit winkelgebied zijn indicatief. Er kunnen geen rechten aan worden ontleend.',
      ).should('be.visible')
      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('4. panel evenement', () => {
      cy.route('/vsd/evenementen/*').as('getEvenement')

      cy.visit('data/vsd/evenementen/id65438/')

      cy.wait('@getEvenement')

      cy.checkListItems('../fixtures/evenement.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('5. panel oplaadpunten', () => {
      cy.route('/vsd/oplaadpunten/*').as('getOplaadpunt')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/vsd/oplaadpunten/id4422/')

      cy.wait('@getOplaadpunt')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/oplaadpunt.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('panel parkeerzones', () => {
      cy.visit('')
    })
    it('panel parkeerzones uitzondering', () => {
      cy.visit('data/vsd/parkeerzones_uitz/id23')
    })
    it('panel reclamebelasting', () => {
      cy.visit('data/vsd/reclamebelasting/id2/')
    })
    it('panel vastgoed', () => {
      cy.visit('data/vsd/vastgoed/id1122/')
    })
  })
})
