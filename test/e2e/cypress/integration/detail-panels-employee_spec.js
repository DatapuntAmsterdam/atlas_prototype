import { DETAIL_PANEL, MAP } from '../support/selectors'

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
  describe('BRK detail panels', () => {
    it('1. Should show a "natural person" but not the "Zakelijke rechten"', () => {
      cy.route('/brk/subject/*').as('getSubject')
      cy.visit('data/brk/subject/idNL.KAD.Persoon.171720901')

      cy.wait('@getSubject')
      cy.contains(
        'Medewerkers met speciale bevoegdheden kunnen alle gegevens zien (ook Zakelijke rechten).',
      )
      cy.checkListItems('../fixtures/kadastraalSubjectNatural.json')
      cy.get(DETAIL_PANEL.definitionList).should('not.contain', 'Statutaire zetel')
      cy.checkInfoBoxes(['Kadastra', 'Zakelijke rechten'])
    })

    it('2. Should show a "non-natural subject" with "Zakelijke rechten"', () => {
      cy.route('/brk/subject/*').as('getSubject')
      cy.visit('data/brk/subject/idNL.KAD.Persoon.423186718')

      cy.wait('@getSubject')
      cy.checkListItems('../fixtures/kadastraalSubjectNonNatural.json')
      cy.checkLinkItems('../fixtures/kadastraalSubjectNonNatural.json')
      cy.get(DETAIL_PANEL.linkList).contains('Eigendom (recht van)')
      cy.checkInfoBoxes(['Kadastra', 'Zakelijke rechten'])
    })

    it('3. Should show a "kadastraal object"', () => {
      cy.route('/brk/object/*').as('getObject')
      cy.route('/brk/object-expand/*').as('getObjectExpand')
      cy.route('/bag/v1.1/nummeraanduiding/?kadastraalobject=*').as('getNummeraanduidingen')
      cy.route('/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/brk/object/idNL.KAD.OnroerendeZaak.11460666170000')

      cy.wait('@getObject')
      cy.wait('@getObjectExpand')
      cy.wait('@getNummeraanduidingen')
      cy.wait('@getPanorama')
      cy.checkListItems('../fixtures/kadastraalObjectEmployee.json')
      cy.checkLinkItems('../fixtures/kadastraalObjectEmployee.json')
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

      // Wait for all listitems to be visible
      cy.get(DETAIL_PANEL.linkList).should('have.length', 6)

      cy.checkListItems('../fixtures/verblijfsObjectEmployee.json')
      cy.checkLinkItems('../fixtures/verblijfsObjectEmployee.json')
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
      cy.route('/bag/v1.1/pand/*').as('getPand')
      cy.route('/monumenten/monumenten/?betreft_pand=*').as('getMonumenten')
      cy.route('/bag/v1.1/nummeraanduiding/?pand=*').as('getNummeraanduidingen')
      cy.route('/handelsregister/vestiging/?pand=*').as('getVestigingen')
      cy.route('panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/bag/pand/id0363100012168052')

      cy.wait('@getPand')
      cy.wait('@getMonumenten')
      cy.wait('@getNummeraanduidingen')
      cy.wait('@getVestigingen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/pandEmployee.json')
      cy.checkLinkItems('../fixtures/pandEmployee.json')
      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['Pand', 'Adressen', 'Vestigingen', 'Monumenten'])
    })
    it('3. Should show a "ligplaats"', () => {
      cy.route('/bag/v1.1/ligplaats/*').as('getLigplaats')
      cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
      cy.route('/panorama/thumbnail?*').as('getPanorama')
      cy.route('/handelsregister/vestiging/?*').as('getVestigingen')

      cy.visit('data/bag/ligplaats/id0363020000881621')

      cy.wait('@getLigplaats')
      cy.wait('@getNummeraanduiding')
      cy.wait('@getPanorama')
      cy.wait('@getVestigingen')

      cy.checkListItems('../fixtures/ligplaatsEmployee.json')
      cy.checkLinkItems('../fixtures/ligplaatsEmployee.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
      cy.checkInfoBoxes(['Adressen', 'Ligplaatsen', 'Vestigingen'])
    })

    it('4. Should show a "standplaats"', () => {
      cy.route('/bag/v1.1/standplaats/*').as('getStandplaats')
      cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
      cy.route('/handelsregister/vestiging/?nummeraanduiding=*').as('getVestigingen')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/bag/standplaats/id0363030000930866')

      cy.wait('@getStandplaats')
      cy.wait('@getNummeraanduiding')
      cy.wait('@getVestigingen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/standplaatsEmployee.json')
      cy.checkLinkItems('../fixtures/standplaatsEmployee.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
      cy.checkInfoBoxes(['Adressen', 'Standplaatsen', 'Vestigingen', 'Monumenten'])
    })
    it('5. Should show a "woonplaats"', () => {
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
  describe('Handelsregister detail panels', () => {
    it('1. Should show a "vestiging"', () => {
      cy.route('/handelsregister/vestiging/*').as('getVestiging')
      cy.route('/handelsregister/maatschappelijkeactiviteit/*').as('getMaatschappelijkeActiviteit')

      cy.visit('data/handelsregister/vestiging/id000003579875/?modus=gesplitst')
      cy.wait('@getVestiging')
      cy.wait('@getMaatschappelijkeActiviteit')

      cy.checkListItems('../fixtures/vestiging.json')
      cy.checkLinkItems('../fixtures/vestiging.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
      cy.checkInfoBoxes(['Vestigingen', 'Maatschappelijke activiteiten'])

      cy.get(MAP.toggleFullScreen).click()
      cy.get('.map-detail-result__item-value').contains('Havom B.V.')
    })

    it('2. Should show a "maatschappelijke activiteit"', () => {
      cy.route('/handelsregister/maatschappelijkeactiviteit/*').as('getMaatschappelijkeActiviteit')
      cy.route('/handelsregister/persoon/*').as('getPersoon')
      cy.route('/handelsregister/vestiging/?maatschappelijke_activiteit=*').as('getVestigingen')
      cy.route('/handelsregister/functievervulling/?heeft_aansprakelijke=*').as(
        'getFunctievervullingen',
      )

      cy.visit('data/handelsregister/maatschappelijkeactiviteit/id01029509')
      cy.wait('@getMaatschappelijkeActiviteit')
      cy.wait('@getPersoon')
      cy.wait('@getVestigingen')
      cy.wait('@getFunctievervullingen')

      cy.checkListItems('../fixtures/maatschappelijkeActiviteit.json')
      cy.checkLinkItems('../fixtures/maatschappelijkeActiviteit.json')

      cy.checkInfoBoxes(['Maatschappelijke activiteiten', 'Functievervullingen', 'Vestigingen'])
    })
  })
  describe('Gebieden detail panels', () => {
    it('1. Should show a "bouwblok""', () => {
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
    it('2. Should show a "buurt"', () => {
      cy.route('/gebieden/buurt/*').as('getBuurt')
      cy.route('/gebieden/bouwblok/?buurt=*').as('getBouwblok')
      cy.route('/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/gebieden/buurt/id03630000000425/')
      cy.wait('@getBuurt')
      cy.wait('@getBouwblok')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/buurt.json')
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
    it('4. Should show a "stadsdeel"', () => {
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
    it('5. Should show a "buurtcombinatie"', () => {
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
    it('6. Should show a "grootstedelijk gebied"', () => {
      cy.route('/gebieden/grootstedelijkgebied/*').as('getGrootstedelijkgebied')
      cy.route('/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/gebieden/grootstedelijkgebied/idzuidelijke-ijoever_od/')
      cy.wait('@getGrootstedelijkgebied')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/grootstedelijkGebied.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['Grootstedelijke gebieden'])
    })
    it('7. Should show a "unesco gebied"', () => {
      cy.route('/gebieden/unesco/*').as('getUnesco')
      cy.route('/panorama/thumbnail?*').as('getPanorama')
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
      cy.route('/monumenten/monumenten/*').as('getMonument')
      cy.route('/monumenten/situeringen/?monument_id=*').as('getSitueringen')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/monumenten/monumenten/id3cf53160-d8bf-4447-93ba-1eb03a35cfe4/')

      cy.wait('@getMonument')
      cy.wait('@getSitueringen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/monumentEmployee.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['Monumenten', 'Complexen', 'Panden', 'Adressen'])
    })

    it('2. Should show a "monumenten complex"', () => {
      cy.route('/monumenten/complexen/*').as('getComplex')
      cy.route('/monumenten/monumenten/?complex_id=*').as('getMonumenten')

      cy.visit('data/monumenten/complexen/id182a9861-4052-4127-8300-6450cd75b6a5')

      cy.wait('@getComplex')
      cy.wait('@getMonumenten')

      cy.checkListItems('../fixtures/complexEmployee.json')

      cy.checkInfoBoxes(['Complexen', 'Monumenten'])
    })
  })
  describe('Vsd detail panels', () => {
    it('1. Should show a "bedrijfinvesteringszone"', () => {
      cy.route('/vsd/biz/*').as('getBiz')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/vsd/biz/id11/?lagen=wnklgeb-biz%3A1')

      cy.wait('@getBiz')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/bedrijfsinvesteringszone.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('2. Should show a "bekendmaking"', () => {
      // Skipped because data is not stable. Solution is to use fixture data.
      cy.intercept('/vsd/bekendmakingen/4115/', { fixture: 'responses/test.json' })
      // cy.route('/vsd/bekendmakingen/4115/').as('getBekendmaking')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/vsd/bekendmakingen/id4115/')

      // cy.wait('@getBekendmaking')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/bekendmaking.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('3. Should show a "winkelgebied"', () => {
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
    it('4. Should show a "evenement"', () => {
      cy.route('/vsd/evenementen/*').as('getEvenement')

      cy.visit('data/vsd/evenementen/id65438/')

      cy.wait('@getEvenement')

      cy.checkListItems('../fixtures/evenement.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('5. Should show a "oplaadpunt"', () => {
      cy.route('/vsd/oplaadpunten/*').as('getOplaadpunt')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/vsd/oplaadpunten/id4422/')

      cy.wait('@getOplaadpunt')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/oplaadpunt.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('6. Should show a "parkeerzone uitzondering"', () => {
      cy.route('/vsd/parkeerzones_uitz/*').as('getParkeerzoneUitz')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/vsd/parkeerzones_uitz/id23')

      cy.wait('@getParkeerzoneUitz')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/ParkeerzoneUitzondering.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('7. Should show a "reclamebelasting"', () => {
      cy.route('/vsd/reclamebelasting/*').as('getReclamebelasting')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/vsd/reclamebelasting/id2/')

      cy.wait('@getReclamebelasting')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/reclamebelasting.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('8. Should show "vastgoed"', () => {
      cy.route('/vsd/vastgoed/*').as('getVastgoed')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/vsd/vastgoed/id1122/')

      cy.wait('@getVastgoed')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/vastgoed.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
  })
  describe('Explosieven detail panels', () => {
    it('1. Should show a "explosieven gevrijwaardgebied"', () => {
      cy.route('/milieuthemas/explosieven/gevrijwaardgebied/*').as('getExplosievenG')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/explosieven/gevrijwaardgebied/id5/')

      cy.wait('@getExplosievenG')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/explosievenGevrijwaard.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('2. Should show a "explosieven inslagen"', () => {
      cy.route('/milieuthemas/explosieven/inslagen/*').as('getInslagen')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/explosieven/inslagen/id494/')

      cy.wait('@getInslagen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/explosievenInslagen.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('3. Should show a "explosieven uitgevoerdonderzoek"', () => {
      cy.route('/milieuthemas/explosieven/uitgevoerdonderzoek/*').as('getUitgevoerdOnderzoek')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/explosieven/uitgevoerdonderzoek/id97/')

      cy.wait('@getUitgevoerdOnderzoek')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/explosievenUitgevoerdOnderzoek.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('4. Should show a "explosieven verdachtgebied"', () => {
      cy.route('/milieuthemas/explosieven/verdachtgebied/*').as('getVerdachtGebied')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/explosieven/verdachtgebied/id13/')

      cy.wait('@getVerdachtGebied')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/explosievenVerdachtGebied.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
  })
  describe('Precariobelasting detail panels', () => {
    it('1. Should show a "precariobelasting terrassen"', () => {
      cy.route('/v1/precariobelasting/terrassen/*').as('getBelastingTerrassen')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/precariobelasting/terrassen/id8/')

      cy.wait('@getBelastingTerrassen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/precarioTerrassen.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('2. Should show a "precariobelasting passagiersvaartuigen"', () => {
      cy.route('/v1/precariobelasting/passagiersvaartuigen/*').as('getBelastingPassagiersvaartuig')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/precariobelasting/passagiersvaartuigen/id1/')

      cy.wait('@getBelastingPassagiersvaartuig')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/precarioPassagiersvaartuig.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('3. Should show a "precariobelasting woonschepen"', () => {
      cy.route('/v1/precariobelasting/woonschepen/*').as('getBelastingWoonschepen')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/precariobelasting/woonschepen/id1/')

      cy.wait('@getBelastingWoonschepen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/precarioWoonschepen.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('4. Should show a "precariobelasting bedrijfsvaartuigen"', () => {
      cy.route('/v1/precariobelasting/bedrijfsvaartuigen/*').as('getBelastingBedrijfsvaartuig')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/precariobelasting/bedrijfsvaartuigen/id1/')

      cy.wait('@getBelastingBedrijfsvaartuig')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/precarioBedrijfsvaartuig.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
  })
  describe('Other detail panels', () => {
    it('1. Should show a "fietspaaltje"', () => {
      cy.route('/v1/fietspaaltjes/fietspaaltjes/*').as('getFietspaaltje')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/fietspaaltjes/fietspaaltjes/idCE-0150-2019/')

      cy.wait('@getFietspaaltje')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/fietspaaltje.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('2. Should show a "grondexploitatie"', () => {
      cy.route('/v1/grex/projecten/*').as('getGrondexplotatie')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/grex/projecten/id78701/')

      cy.wait('@getGrondexplotatie')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/grondexploitatie.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('3. Should show a "meetbout"', () => {
      cy.route('/meetbouten/meetbout/*').as('getMeetbout')
      cy.route('/meetbouten/rollaag/*').as('getRollaag')
      cy.route('/meetbouten/meting/?meetbout=*').as('getMeting')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

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
      cy.route('/nap/peilmerk/*').as('getNap')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/nap/peilmerk/id10480011/')

      cy.wait('@getNap')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/nap.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('5. Should show a "parkeervak"', () => {
      cy.route('/v1/parkeervakken/parkeervakken/*').as('getParkeervak')

      cy.visit('data/parkeervakken/parkeervakken/id121425487327/')

      cy.wait('@getParkeervak')

      cy.checkListItems('../fixtures/parkeervak.json')

      cy.get(DETAIL_PANEL.subHeader).eq(0).should('have.text', 'Regimes').and('be.visible')
    })
    it('6. Should show a "bouwdossier"', () => {
      cy.route('/iiif-metadata/bouwdossier/*').as('getBouwdossier')

      cy.visit('data/bouwdossiers/bouwdossier/SA20390/')

      cy.wait('@getBouwdossier')

      cy.get(DETAIL_PANEL.constructionFileSubheading)
        .eq(0)
        .should('have.text', 'Bouw- en omgevingsdossiers')
        .and('be.visible')

      cy.fixture('../fixtures/bouwdossier.json').then((json) => {
        Object.entries(json.definitionLists[0].items).forEach(([keyA, valueA], indexA) => {
          cy.log(indexA)
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

      cy.get(DETAIL_PANEL.constructionFileSubheading)
        .eq(4)
        .should('have.text', 'Adressen')
        .and('be.visible')
    })
    it('7. Should show a "tunnel gevaarlijke stoffen"', () => {
      cy.route('/v1/hoofdroutes/tunnels_gevaarlijke_stoffen/*').as('getHoofdroute')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/hoofdroutes/tunnels_gevaarlijke_stoffen/id4/')

      cy.wait('@getHoofdroute')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/tunnelsGevaarlijkeStoffen.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
    it('8. Should show a "bouwstroompunt"', () => {
      cy.route('/v1/bouwstroompunten/bouwstroompunten/*').as('getBouwstroompunt')
      cy.route('/panorama/thumbnail?*').as('getPanorama')

      cy.visit('/data/bouwstroompunten/bouwstroompunten/id5f0716e1d02207000c422acb/')

      cy.wait('@getBouwstroompunt')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/bouwstroompunt.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
    })
  })
})
