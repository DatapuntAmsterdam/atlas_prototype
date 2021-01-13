import { ALERTS, DETAIL_PANEL } from '../support/selectors'
import { apiFixtures, constructApiURLRegex, interceptApiFixtures } from '../support/api'

const customIntercepts = {
  getNummeraanduidingByPand: 'getNummeraanduidingByPand',
  getNummeraanduidingByKadastraalObject: 'getNummeraanduidingByKadastraalObject',
  getNummeraanduidingByVerblijfsobject: 'getNummeraanduidingByVerblijfsobject',
  getSitueringenByMonumentId: 'getSitueringenByMonumentId',
  getMonumentByComplexId: 'getMonumentByComplexId',
  getMonumentByPand: 'getMonumentByPand',
}

describe('employee permissions', () => {
  beforeEach(() => {
    cy.hidePopup()

    cy.intercept(
      'GET',
      constructApiURLRegex(
        `${apiFixtures.nummeraanduiding.path}(.*)kadastraalobject=NL.KAD.OnroerendeZaak.11460666170000(.*)`,
      ),
      apiFixtures.nummeraanduiding.listFixture,
    ).as(customIntercepts.getNummeraanduidingByKadastraalObject)

    cy.intercept(
      'GET',
      constructApiURLRegex(`${apiFixtures.monumenten.path}(.*)betreft_pand=0363100012168052(.*)`),
      apiFixtures.monumenten.listFixture,
    ).as(customIntercepts.getMonumentByPand)

    cy.intercept(
      'GET',
      constructApiURLRegex(`${apiFixtures.situeringen.path}(.*)monument_id=(.*)`),
      apiFixtures.situeringen.singleFixture,
    ).as(customIntercepts.getSitueringenByMonumentId)

    cy.intercept(
      'GET',
      constructApiURLRegex(
        `${apiFixtures.monumenten.path}(.*)complex_id=182a9861-4052-4127-8300-6450cd75b6a5(.*)`,
      ),
      apiFixtures.monumenten.listFixture,
    ).as(customIntercepts.getMonumentByComplexId)

    cy.intercept('GET', constructApiURLRegex('/brk/subject/(.*)'), {
      statusCode: 401,
      body: null,
    })

    interceptApiFixtures()
  })

  describe('BRK detail panels', () => {
    it('1. Should NOT show a "natural person""', () => {
      cy.visit('data/brk/subject/idNL.KAD.Persoon.171720901')
      cy.contains(ALERTS.KADASTRAAL_SUBJECT)
      cy.get(DETAIL_PANEL.definitionList).should('not.exist')
    })

    it('2. Should NOT show "non-natural subject" with "Zakelijke rechten"', () => {
      cy.visit('data/brk/subject/idNL.KAD.Persoon.423186718')
      cy.contains(ALERTS.KADASTRAAL_SUBJECT)
      cy.get(DETAIL_PANEL.definitionList).should('not.exist')
      cy.get(DETAIL_PANEL.linkList).should('not.exist')
    })

    it('3. Should show a "kadastraal object"', () => {
      cy.visit('data/brk/object/idNL.KAD.OnroerendeZaak.11460666170000')

      cy.wait(apiFixtures.object.single)
      cy.wait(apiFixtures.objectExpand.single)
      cy.wait(`@${customIntercepts.getNummeraanduidingByKadastraalObject}`)

      cy.contains(ALERTS.KADASTRAAL_OBJECT_ITEMS)
      cy.checkListItems('../fixtures/kadastraalObjectVisitor.json')
      cy.checkLinkItems('../fixtures/kadastraalObjectVisitor.json')
      cy.contains('Besluit op basis van Monumentenwet 1988,').should('not.exist')

      cy.checkInfoBoxes([
        'Kadastra',
        'Zakelijke rechten',
        'Ontstaan uit',
        'Betrokken bij',
        'Adressen',
      ])
    })
  })
  describe('BAG detail panels', () => {
    it('1. Should show an "address"', () => {
      cy.defineAddressDetailRoutes()
      cy.visit('data/bag/verblijfsobject/id0363010000665114')

      cy.wait(apiFixtures.nummeraanduiding.any)

      // Wait for all listitems to be visible
      cy.get(DETAIL_PANEL.linkList).should('have.length', 5)

      cy.checkListItems('../fixtures/verblijfsObjectVisitor.json')
      cy.checkLinkItems('../fixtures/verblijfsObjectVisitor.json')

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
      cy.contains(ALERTS.VESTIGINGEN).scrollIntoView().should('be.visible')
      cy.contains(ALERTS.KADASTRAAL_OBJECT).scrollIntoView().should('be.visible')
    })
    it('2. Should show a "pand"', () => {
      cy.visit('data/bag/pand/id0363100012168052')

      cy.wait(apiFixtures.pand.single)
      cy.wait(`@${customIntercepts.getMonumentByPand}`)
      if (apiFixtures.nummeraanduiding.many) {
        cy.wait(apiFixtures.nummeraanduiding.many)
      }

      cy.checkListItems('../fixtures/pandVisitor.json')
      cy.checkLinkItems('../fixtures/pandVisitor.json')

      cy.checkInfoBoxes(['Pand', 'Adressen', 'Vestigingen', 'Monumenten'])
    })
    it('3. Should show a "ligplaats"', () => {
      cy.visit('data/bag/ligplaats/id0363020000881621')

      cy.wait(apiFixtures.ligplaats.single)
      cy.wait(apiFixtures.nummeraanduiding.any)

      cy.checkListItems('../fixtures/ligplaatsVisitor.json')
      cy.checkLinkItems('../fixtures/ligplaatsVisitor.json')

      cy.checkInfoBoxes(['Adressen', 'Ligplaatsen', 'Vestigingen'])
    })

    it('4. Should show a "standplaats"', () => {
      cy.visit('data/bag/standplaats/id0363030000930866')

      cy.wait(apiFixtures.standplaats.single)
      cy.wait(apiFixtures.nummeraanduiding.any)

      cy.checkListItems('../fixtures/standplaatsVisitor.json')
      cy.checkLinkItems('../fixtures/standplaatsVisitor.json')

      cy.checkInfoBoxes(['Adressen', 'Standplaatsen', 'Vestigingen', 'Monumenten'])
    })

    it('5. Should show a "woonplaats"', () => {
      cy.visit('data/bag/woonplaats/id3594/?zoom=7')
      cy.wait(apiFixtures.woonplaats.single)
      if (apiFixtures.openbareRuimte.many) {
        cy.wait(apiFixtures.openbareRuimte.many)
      }

      cy.checkListItems('../fixtures/woonplaats.json')
      cy.checkLinkItems('../fixtures/woonplaats.json')

      cy.checkInfoBoxes(['Woonplaatsen', 'Openbare ruimtes'])
    })
  })
  describe('Handelsregister detail panels', () => {
    it('1. Should show a "vestiging"', () => {
      cy.visit('data/handelsregister/vestiging/id000003579875/?modus=gesplitst')
      cy.contains(ALERTS.GENERAL).should('be.visible')
      cy.get(DETAIL_PANEL.definitionList).should('not.exist')
      cy.get(DETAIL_PANEL.linkList).should('not.exist')
    })

    it('2. Should show a "maatschappelijke activiteit"', () => {
      cy.visit('data/handelsregister/maatschappelijkeactiviteit/id01029509')
      cy.contains(ALERTS.GENERAL).should('be.visible')
      cy.get(DETAIL_PANEL.definitionList).should('not.exist')
      cy.get(DETAIL_PANEL.linkList).should('not.exist')
    })
  })

  describe('Monumenten en complexen detail panels', () => {
    it('1. Should show a "monument"', () => {
      cy.visit('data/monumenten/monumenten/id3cf53160-d8bf-4447-93ba-1eb03a35cfe4/')

      cy.wait(apiFixtures.monumenten.single)
      cy.wait(`@${customIntercepts.getSitueringenByMonumentId}`)

      cy.checkListItems('../fixtures/monumentVisitor.json')

      cy.checkInfoBoxes(['Monumenten', 'Complexen', 'Panden', 'Adressen'])
    })

    it('2. Should show a "monumenten complex"', () => {
      cy.visit('data/monumenten/complexen/id182a9861-4052-4127-8300-6450cd75b6a5')

      cy.wait(apiFixtures.complexen.single)
      cy.wait(`@${customIntercepts.getMonumentByComplexId}`)

      cy.contains(ALERTS.COMPLEXEN).should('be.visible')
      cy.checkListItems('../fixtures/complexVisitor.json')

      cy.checkInfoBoxes(['Complexen', 'Monumenten'])
    })
  })
})
