import { DETAIL_PANEL, MAP } from '../support/selectors'

describe('employee permissions', () => {
  beforeEach(() => {
    cy.hidePopup()
  })
  before(() => {
    cy.login('EMPLOYEE')
  })

  after(() => {
    cy.logout()
  })
  describe('BRK detail panels', () => {
    it.skip('1. Should show a "natural person" but not the "Zakelijke rechten"', () => {
      cy.intercept('**/brk/subject/**').as('getSubject')
      cy.visit('data/brk/subject/idNL.KAD.Persoon.171720901')

      cy.wait('@getSubject')
      cy.contains(
        'Medewerkers met speciale bevoegdheden kunnen alle gegevens zien (ook Zakelijke rechten).',
      )
      cy.checkListItems('../fixtures/kadastraalSubjectNaturalPerson.json')
      cy.get(DETAIL_PANEL.definitionList).should('not.contain', 'Statutaire zetel')
      cy.checkInfoBoxes(['Kadastra', 'Zakelijke rechten'])
    })
    it.skip('2. Should show a "non-natural subject" with "Zakelijke rechten"', () => {
      cy.intercept('**/brk/subject/**').as('getSubject')
      cy.visit('data/brk/subject/idNL.KAD.Persoon.423186718')

      cy.wait('@getSubject')
      cy.checkListItems('../fixtures/kadastraalSubjectNonNaturalPerson.json')
      cy.get(DETAIL_PANEL.linkList).contains('Eigendom (recht van)')
      cy.checkInfoBoxes(['Kadastra', 'Zakelijke rechten'])
    })

    it('3. Should show a "kadastraal object"', () => {
      cy.intercept('**/brk/object/**').as('getObject')
      cy.intercept('**/brk/object-expand/**').as('getObjectExpand')
      cy.intercept('**/bag/v1.1/nummeraanduiding/?kadastraalobject=**').as('getNummeraanduidingen')
      cy.intercept('**/panorama/thumbnail?**').as('getPanorama')
      cy.visit('data/brk/object/idNL.KAD.OnroerendeZaak.11460666170000')

      cy.wait('@getObject')
      cy.wait('@getObjectExpand')
      cy.wait('@getNummeraanduidingen')
      cy.wait('@getPanorama')
      cy.checkListItems('../fixtures/kadastraalObjectEmployee.json')
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
  describe('BAG detail panels', () => {
    it('1. Should show an "address"', () => {
      cy.defineAddressDetailRoutes()
      cy.visit('data/bag/verblijfsobject/id0363010000749400')

      cy.waitForAdressDetail()

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(250)

      // Wait for all listitems to be visible
      cy.get(DETAIL_PANEL.linkList).should('have.length', 6)

      cy.checkListItems('../fixtures/verblijfsObjectEmployee.json')

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
    it('2. Should show a "pand"', () => {
      cy.intercept('**/bag/v1.1/pand/**').as('getPand')
      cy.intercept('**/monumenten/monumenten/?betreft_pand=**').as('getMonumenten')
      cy.intercept('**/bag/v1.1/nummeraanduiding/?pand=**').as('getNummeraanduidingen')
      cy.intercept('**/handelsregister/vestiging/?pand=**').as('getVestigingen')
      cy.intercept('**/panorama/thumbnail?**').as('getPanorama')

      cy.visit('data/bag/pand/id0363100012168052')

      cy.wait('@getPand')
      cy.wait('@getMonumenten')
      cy.wait('@getNummeraanduidingen')
      cy.wait('@getVestigingen')
      cy.wait('@getPanorama')

      cy.checkLinkItems('../fixtures/pandEmployee.json')
      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['Pand', 'Adressen', 'Vestigingen', 'Monumenten'])
    })
    it('3. Should show a "ligplaats"', () => {
      cy.intercept('**/bag/v1.1/ligplaats/**').as('getLigplaats')
      cy.intercept('**/bag/v1.1/nummeraanduiding/**').as('getNummeraanduiding')
      cy.intercept('**/panorama/thumbnail?**').as('getPanorama')
      cy.intercept('**/handelsregister/vestiging/?**').as('getVestigingen')

      cy.visit('data/bag/ligplaats/id0363020000881621')

      cy.wait('@getLigplaats')
      cy.wait('@getNummeraanduiding')
      cy.wait('@getPanorama')
      cy.wait('@getVestigingen')

      cy.checkLinkItems('../fixtures/ligplaatsEmployee.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
      cy.checkInfoBoxes(['Adressen', 'Ligplaatsen', 'Vestigingen'])
    })

    it('4. Should show a "standplaats"', () => {
      cy.intercept('**/bag/v1.1/standplaats/**').as('getStandplaats')
      cy.intercept('**/bag/v1.1/nummeraanduiding/**').as('getNummeraanduiding')
      cy.intercept('**/handelsregister/vestiging/?nummeraanduiding=**').as('getVestigingen')
      cy.intercept('**/panorama/thumbnail?**').as('getPanorama')

      cy.visit('data/bag/standplaats/id0363030000930866')

      cy.wait('@getStandplaats')
      cy.wait('@getNummeraanduiding')
      cy.wait('@getVestigingen')
      cy.wait('@getPanorama')

      cy.checkLinkItems('../fixtures/standplaatsEmployee.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
      cy.checkInfoBoxes(['Adressen', 'Standplaatsen', 'Vestigingen', 'Monumenten'])
    })
    it('5. Should show a "woonplaats"', () => {
      cy.intercept('**/v1/bag/woonplaatsen/**').as('getWoonplaats')
      cy.visit('data/bag/woonplaats/id3594/?zoom=7')
      cy.wait('@getWoonplaats')

      cy.checkLinkItems('../fixtures/woonplaats.json')

      cy.checkInfoBoxes(['Woonplaatsen', 'Openbare ruimtes'])
    })
  })
  describe('Handelsregister detail panels', () => {
    it('1. Should show a "vestiging"', () => {
      cy.intercept('**/handelsregister/vestiging/**').as('getVestiging')
      cy.intercept('**/handelsregister/maatschappelijkeactiviteit/*').as(
        'getMaatschappelijkeActiviteit',
      )

      cy.visit('data/handelsregister/vestiging/id000003579875/?modus=gesplitst')
      cy.wait('@getVestiging')
      cy.wait('@getMaatschappelijkeActiviteit')

      cy.checkLinkItems('../fixtures/vestiging.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
      cy.checkInfoBoxes(['Vestigingen', 'Maatschappelijke activiteiten'])

      cy.get(MAP.toggleFullScreen).click()
      cy.get('.map-detail-result__item-value').contains('Havom B.V.')
    })

    it('2. Should show a "maatschappelijke activiteit"', () => {
      cy.intercept('**/handelsregister/maatschappelijkeactiviteit/*').as(
        'getMaatschappelijkeActiviteit',
      )
      cy.intercept('**/handelsregister/persoon/*').as('getPersoon')
      cy.intercept('**/handelsregister/vestiging/?maatschappelijke_activiteit=*').as(
        'getVestigingen',
      )
      cy.intercept('**/handelsregister/functievervulling/?heeft_aansprakelijke=*').as(
        'getFunctievervullingen',
      )

      cy.visit('data/handelsregister/maatschappelijkeactiviteit/id01029509')
      cy.wait('@getMaatschappelijkeActiviteit')
      cy.wait('@getPersoon')
      cy.wait('@getVestigingen')
      cy.wait('@getFunctievervullingen')

      cy.checkLinkItems('../fixtures/maatschappelijkeActiviteit.json')

      cy.checkInfoBoxes(['Maatschappelijke activiteiten', 'Functievervullingen', 'Vestigingen'])
    })
  })
  describe('Gebieden detail panels', () => {
    it('1. Should show a "bouwblok""', () => {
      cy.intercept('**/gebieden/bouwblok/*').as('getBouwblok')
      cy.intercept('**/bag/v1.1/pand/?bouwblok*').as('getPand')
      cy.intercept('**/meetbouten/meetbout/?bouwbloknummer*').as('getMeetbout')

      cy.visit('data/gebieden/bouwblok/id03630023380624/')

      cy.wait('@getBouwblok')
      cy.wait('@getPand')
      cy.wait('@getMeetbout')

      cy.checkLinkItems('../fixtures/bouwblok.json')

      cy.checkInfoBoxes(['Bouwblokken', 'Panden', 'Meetbouten'])
    })
    it('2. Should show a "buurt"', () => {
      cy.intercept('**/gebieden/buurt/*').as('getBuurt')
      cy.intercept('**/gebieden/bouwblok/?buurt=*').as('getBouwblok')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/gebieden/buurt/id03630000000425/')
      cy.wait('@getBuurt')
      cy.wait('@getBouwblok')
      cy.wait('@getPanorama')

      cy.checkLinkItems('../fixtures/buurt.json')

      cy.checkInfoBoxes([
        'Buurten',
        'Bouwblokken',
        'Adressen',
        'Vestigingen',
        'Kadastrale objecten',
      ])

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('3. Should show a "gebiedsgerichtwerken-gebied"', () => {
      cy.intercept('**/gebieden/gebiedsgerichtwerken/*').as('getGebiedsgerichtwerken')
      cy.intercept('**/gebieden/buurt/?gebiedsgerichtwerken*').as('getBuurt')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/gebieden/gebiedsgerichtwerken/idDX17/')
      cy.wait('@getGebiedsgerichtwerken')
      cy.wait('@getBuurt')
      cy.wait('@getPanorama')

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
    it('4. Should show a "stadsdeel"', () => {
      cy.intercept('**/gebieden/stadsdeel/*').as('getstadsdeel')
      cy.intercept('**/gebieden/buurtcombinatie/?stadsdeel=*').as('getBuurtcombinatie')
      cy.intercept('**/gebieden/gebiedsgerichtwerken/?stadsdeel*').as('getGebiedsgerichtwerken')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/gebieden/stadsdeel/id03630000000019/')
      cy.wait('@getstadsdeel')
      cy.wait('@getBuurtcombinatie')
      cy.wait('@getGebiedsgerichtwerken')
      cy.wait('@getPanorama')

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
    it('5. Should show a "buurtcombinatie"', () => {
      cy.intercept('**/gebieden/buurtcombinatie/*').as('getBuurtcombinatie')
      cy.intercept('**/gebieden/buurt/?buurtcombinatie*').as('getBuurt')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/gebieden/buurtcombinatie/3630012052036/')
      cy.wait('@getBuurtcombinatie')
      cy.wait('@getBuurt')
      cy.wait('@getPanorama')

      cy.checkLinkItems('../fixtures/buurtcombinatie.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['Wijken', 'Buurten', 'Adressen', 'Vestigingen', 'Kadastrale objecten'])
    })
    it('6. Should show a "grootstedelijk gebied"', () => {
      cy.intercept('**/gebieden/grootstedelijkgebied/*').as('getGrootstedelijkgebied')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/gebieden/grootstedelijkgebied/idzuidelijke-ijoever_od/')
      cy.wait('@getGrootstedelijkgebied')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/grootstedelijkGebied.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['Grootstedelijke gebieden'])
    })
    it('7. Should show a "unesco gebied"', () => {
      cy.intercept('**/gebieden/unesco/*').as('getUnesco')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/gebieden/unesco/idbufferzone/')
      cy.wait('@getUnesco')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/unesco.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['UNESCO'])
    })
  })
  describe('Monumenten en complexen detail panels', () => {
    it('1. Should show a "monument"', () => {
      cy.intercept('**/monumenten/monumenten/*').as('getMonument')
      cy.intercept('**/monumenten/situeringen/?monument_id=*').as('getSitueringen')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/monumenten/monumenten/id3cf53160-d8bf-4447-93ba-1eb03a35cfe4/')

      cy.wait('@getMonument')
      cy.wait('@getSitueringen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/monumentEmployee.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['Monumenten', 'Complexen', 'Panden', 'Adressen'])
    })
    it('2. Should show a "monumenten complex"', () => {
      cy.intercept('**/monumenten/complexen/**').as('getComplex')
      cy.intercept('**/monumenten/monumenten/?complex_id=**').as('getMonumenten')

      cy.visit('data/monumenten/complexen/id182a9861-4052-4127-8300-6450cd75b6a5')

      cy.wait('@getComplex')
      cy.wait('@getMonumenten')

      cy.checkListItems('../fixtures/complexEmployee.json')

      cy.checkInfoBoxes(['Complexen', 'Monumenten'])
    })
  })
  describe('Vsd detail panels', () => {
    it('1. Should show a "bedrijfinvesteringszone"', () => {
      cy.intercept('**/vsd/biz/**').as('getBiz')
      cy.intercept('**/panorama/thumbnail?**').as('getPanorama')

      cy.visit('data/vsd/biz/id11/?lagen=wnklgeb-biz%3A1')

      cy.wait('@getBiz')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/bedrijfsinvesteringszone.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it.skip('2. Should show a "bekendmaking"', () => {
      // Skipped because data is not stable. Solution is to use fixture data.
      cy.intercept('/vsd/bekendmakingen/4115/').as('getBekendmaking')
      cy.intercept('**/panorama/thumbnail?**').as('getPanorama')

      cy.visit('data/vsd/bekendmakingen/id4115/')

      cy.wait('@getBekendmaking')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/bekendmaking.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('3. Should show a "winkelgebied"', () => {
      cy.intercept('/vsd/winkgeb/3/').as('getWinkelgebied')
      cy.intercept('**/panorama/thumbnail?**').as('getPanorama')

      cy.visit('data/vsd/winkgeb/id3/')

      cy.wait('@getWinkelgebied')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/winkelgebied.json')

      cy.contains(
        'De grenzen van dit winkelgebied zijn indicatief. Er kunnen geen rechten aan worden ontleend.',
      ).should('be.visible')
      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('4. Should show a "evenement"', () => {
      cy.intercept('**/vsd/evenementen/**').as('getEvenement')

      cy.visit('data/vsd/evenementen/id65438/')

      cy.wait('@getEvenement')

      cy.checkListItems('../fixtures/evenement.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('5. Should show a "oplaadpunt"', () => {
      cy.intercept('**/vsd/oplaadpunten/**').as('getOplaadpunt')
      cy.intercept('**/panorama/thumbnail?**').as('getPanorama')

      cy.visit('data/vsd/oplaadpunten/id4422/')

      cy.wait('@getOplaadpunt')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/oplaadpunt.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('6. Should show a "parkeerzone uitzondering"', () => {
      cy.intercept('**/vsd/parkeerzones_uitz/*').as('getParkeerzoneUitz')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/vsd/parkeerzones_uitz/id23')

      cy.wait('@getParkeerzoneUitz')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/parkeerzoneUitzondering.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('7. Should show a "reclamebelasting"', () => {
      cy.intercept('**/vsd/reclamebelasting/*').as('getReclamebelasting')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/vsd/reclamebelasting/id2/')

      cy.wait('@getReclamebelasting')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/reclamebelasting.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('8. Should show "vastgoed"', () => {
      cy.intercept('**/vsd/vastgoed/*').as('getVastgoed')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/vsd/vastgoed/id1122/')

      cy.wait('@getVastgoed')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/vastgoed.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
  })
  describe('Explosieven detail panels', () => {
    it('1. Should show a "explosieven gevrijwaardgebied"', () => {
      cy.intercept('**/milieuthemas/explosieven/gevrijwaardgebied/*').as('getExplosievenG')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/explosieven/gevrijwaardgebied/id5/')

      cy.wait('@getExplosievenG')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/explosievenGevrijwaard.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('2. Should show a "explosieven inslagen"', () => {
      cy.intercept('**/milieuthemas/explosieven/inslagen/*').as('getInslagen')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/explosieven/inslagen/id494/')

      cy.wait('@getInslagen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/explosievenInslagen.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('3. Should show a "explosieven uitgevoerdonderzoek"', () => {
      cy.intercept('**/milieuthemas/explosieven/uitgevoerdonderzoek/*').as('getUitgevoerdOnderzoek')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/explosieven/uitgevoerdonderzoek/id97/')

      cy.wait('@getUitgevoerdOnderzoek')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/explosievenUitgevoerdOnderzoek.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('4. Should show a "explosieven verdachtgebied"', () => {
      cy.intercept('**/milieuthemas/explosieven/verdachtgebied/*').as('getVerdachtGebied')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/explosieven/verdachtgebied/id13/')

      cy.wait('@getVerdachtGebied')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/explosievenVerdachtGebied.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
  })
  describe('Precariobelasting detail panels', () => {
    it('1. Should show a "precariobelasting terrassen"', () => {
      cy.intercept('**/v1/precariobelasting/terrassen/*').as('getBelastingTerrassen')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/precariobelasting/terrassen/id8/')

      cy.wait('@getBelastingTerrassen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/precarioTerrassen.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('2. Should show a "precariobelasting passagiersvaartuigen"', () => {
      cy.intercept('**/v1/precariobelasting/passagiersvaartuigen/*').as(
        'getBelastingPassagiersvaartuig',
      )
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/precariobelasting/passagiersvaartuigen/id1/')

      cy.wait('@getBelastingPassagiersvaartuig')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/precarioPassagiersvaartuig.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('3. Should show a "precariobelasting woonschepen"', () => {
      cy.intercept('**/v1/precariobelasting/woonschepen/*').as('getBelastingWoonschepen')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/precariobelasting/woonschepen/id1/')

      cy.wait('@getBelastingWoonschepen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/precarioWoonschepen.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('4. Should show a "precariobelasting bedrijfsvaartuigen"', () => {
      cy.intercept('**/v1/precariobelasting/bedrijfsvaartuigen/*').as(
        'getBelastingBedrijfsvaartuig',
      )
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/precariobelasting/bedrijfsvaartuigen/id1/')

      cy.wait('@getBelastingBedrijfsvaartuig')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/precarioBedrijfsvaartuig.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
  })
  describe('Other detail panels', () => {
    it('1. Should show a "fietspaaltje"', () => {
      cy.intercept('**/v1/fietspaaltjes/fietspaaltjes/*').as('getFietspaaltje')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/fietspaaltjes/fietspaaltjes/idCE-0150-2019/')

      cy.wait('@getFietspaaltje')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/fietspaaltje.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('2. Should show a "grondexploitatie"', () => {
      cy.intercept('**/v1/grex/projecten/*').as('getGrondexplotatie')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/grex/projecten/id78701/')

      cy.wait('@getGrondexplotatie')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/grondexploitatie.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('3. Should show a "meetbout"', () => {
      cy.intercept('**/meetbouten/meetbout/*').as('getMeetbout')
      cy.intercept('**/meetbouten/rollaag/*').as('getRollaag')
      cy.intercept('**/meetbouten/meting/?meetbout=*').as('getMeting')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/meetbouten/meetbout/id10381459/')

      cy.wait('@getMeetbout')
      cy.wait('@getRollaag')
      cy.wait('@getMeting')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/meetbout.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.get(DETAIL_PANEL.subHeader).eq(0).should('have.text', 'Metingen').and('be.visible')
      cy.get(DETAIL_PANEL.subHeader).eq(1).should('have.text', 'Rollaag').and('be.visible')
      cy.get(DETAIL_PANEL.table).should('be.visible')
    })
    it('4. Should show a "nap peilmerk"', () => {
      cy.intercept('**/nap/peilmerk/*').as('getNap')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/nap/peilmerk/id10480011/')

      cy.wait('@getNap')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/nap.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('5. Should show a "parkeervak"', () => {
      cy.intercept('**/v1/parkeervakken/parkeervakken/*').as('getParkeervak')

      cy.visit('data/parkeervakken/parkeervakken/id121425487327/')

      cy.wait('@getParkeervak')

      cy.checkListItems('../fixtures/parkeervak.json')

      cy.get(DETAIL_PANEL.subHeader).eq(0).should('have.text', 'Regimes').and('be.visible')
    })
    it.skip('6. Should show a "bouwdossier"', () => {
      cy.intercept('**/iiif-metadata/bouwdossier/*').as('getBouwdossier')

      cy.visit('data/bouwdossiers/bouwdossier/SA20390/')

      cy.wait('@getBouwdossier')

      cy.get(DETAIL_PANEL.constructionDossierSubheading)
        .eq(0)
        .should('have.text', 'Bouw- en omgevingsdossiers')
        .and('be.visible')

      cy.fixture('../fixtures/bouwdossier.json').then((json) => {
        Object.entries(json.definitionLists[0].items).forEach(([keyA, valueA]: any) => {
          cy.checkTermAndDefinition(0, keyA, valueA)
        })
      })
      cy.get(DETAIL_PANEL.documentsHeader)
        .eq(0)
        .should('contain', 'Deelgoedkeuringen, berekeningen')
        .and('be.visible')
      cy.get(DETAIL_PANEL.documentsHeader)
        .eq(1)
        .should('contain', 'Deelgoedkeuringen, documenten')
        .and('be.visible')
      cy.get(DETAIL_PANEL.documentsHeader)
        .eq(2)
        .should('contain', 'Deelgoedkeuringen, tekeningen')
        .and('be.visible')

      cy.get(DETAIL_PANEL.constructionDossierSubheading)
        .eq(4)
        .should('have.text', 'Adressen')
        .and('be.visible')
    })
    it('7. Should show a "tunnel gevaarlijke stoffen"', () => {
      cy.intercept('**/v1/hoofdroutes/tunnels_gevaarlijke_stoffen/*').as('getHoofdroute')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/hoofdroutes/tunnels_gevaarlijke_stoffen/id4/')

      cy.wait('@getHoofdroute')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/tunnelsGevaarlijkeStoffen.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('8. Should show a "bouwstroompunt"', () => {
      cy.intercept('**/v1/bouwstroompunten/bouwstroompunten/*').as('getBouwstroompunt')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('/data/bouwstroompunten/bouwstroompunten/id5f0716e1d02207000c422acb/')

      cy.wait('@getBouwstroompunt')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/bouwstroompunt.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
  })
})
