import { HEADER, HEADER_MENU, HOMEPAGE } from '../support/selectors'

describe('Homepage module', () => {
  const sizes = ['iphone-x', 'ipad-2', 'macbook-15']
  sizes.forEach((size) => {
    describe(`Homepage checks, resolution is: ${size}`, () => {
      beforeEach(() => {
        if (Cypress._.isArray(size)) {
          cy.viewport(size[0], size[1])
        } else {
          cy.viewport(size)
        }
        cy.server()
        cy.route('/jsonapi/node/list/**').as('jsonapi')
        cy.route('POST', '/cms_search/graphql/').as('graphql')
        cy.hidePopup()
        cy.visit('/')
        cy.wait('@jsonapi')
        cy.wait('@jsonapi')
        cy.wait('@graphql')
      })
      it('Should check all header information', () => {
        cy.get(HEADER.root).should('be.visible')
        cy.checkLogo(size)
        cy.get(HEADER.logoAmsterdamTitle).should('contain', 'Data en informatie').and('be.visible')
        cy.get(HEADER.headerTitle).should('contain', 'Data en informatie').and('be.visible')
        cy.get(HEADER_MENU.rootDefault).should('exist')
        cy.checkSearchbar(size)
      })
      it('Should check all menu items', () => {
        let menuSelector

        if (size === 'macbook-15') {
          menuSelector = HOMEPAGE.menuDefault
        } else {
          menuSelector = HOMEPAGE.menuMobile
        }
        cy.get(menuSelector).should('be.visible')
        cy.get(menuSelector).should('contain', 'Onderdelen')

        cy.checkMenuLink(menuSelector, 'Onderdelen', 'Kaart', '/data/?modus=kaart&legenda=true')

        // Cannot use checkMenuLink function for Panoramanbeelden. Targeting menu-item based on title is not possibel, there is a &shy character in the selector
        cy.get(menuSelector).click({ force: true })
        cy.get(menuSelector).contains('Onderdelen').click({ force: true })
        cy.get(menuSelector).find('[href*="data/panorama/"]').click({ force: true })
        cy.url().should('include', 'data/panorama/')
        cy.go('back')

        cy.visit('/')
        cy.wait('@graphql')
        cy.checkMenuLink(menuSelector, 'Onderdelen', 'Tabellen', '/artikelen/artikel/tabellen/')
        cy.checkMenuLink(
          menuSelector,
          'Onderdelen',
          'Data services',
          '/artikelen/artikel/services/',
        )
        cy.checkMenuLink(menuSelector, 'Onderdelen', 'Dossiers', '/dossiers/zoek/')
        cy.checkMenuLink(menuSelector, 'Onderdelen', 'Specials', '/specials/zoek/')
        cy.checkMenuLink(menuSelector, 'Onderdelen', 'Kaarten', '/kaarten/zoek/')
        cy.checkMenuLink(menuSelector, 'Onderdelen', 'Datasets', '/datasets/zoek/')
        cy.checkMenuLink(menuSelector, 'Onderdelen', 'Publicaties', '/publicaties/zoek/')
        cy.checkMenuLink(menuSelector, 'Onderdelen', 'Artikelen', '/artikelen/zoek/')
        cy.checkMenuLink(
          menuSelector,
          'Over OIS',
          'Onderzoek, Informatie en Statistiek',
          '/artikelen/artikel/over-ois/',
        )
        cy.checkMenuLink(
          menuSelector,
          'Over OIS',
          'Onderzoek',
          '/artikelen/artikel/onderzoek-door-ois/',
        )
        cy.checkMenuLink(
          menuSelector,
          'Over OIS',
          'Databeleid',
          '/artikelen/artikel/amsterdam-en-data/',
        )
        cy.checkMenuLink(menuSelector, 'Over OIS', 'Bronnen', '/artikelen/artikel/bronnen/')
        cy.checkMenuLink(menuSelector, 'Over OIS', 'Contact', '/artikelen/artikel/contact/')
        cy.get(menuSelector).contains('Feedback').click({ force: true })
        cy.get('[class*="ModalStyle__ModalFocus"]').should('be.visible')
        cy.get('[title="Sluit"]').click()
        cy.get(menuSelector).contains('Help').click({ force: true })
        cy.url().should('include', '/artikelen/artikel/help/')
        cy.go('back')
        cy.get(menuSelector).contains('Inloggen')
      })
      it('Should check the highlight block', () => {
        cy.get(HOMEPAGE.highlightBlock).scrollIntoView().and('be.visible')
        cy.get(HOMEPAGE.highlightCard).should('have.length', '3')
        cy.contains('Bekijk overzicht').click()
        cy.url().should('include', '/artikelen/zoek/')
        cy.go('back')
      })
      it('Should check all links in navigation block', () => {
        cy.get(HOMEPAGE.navigationBlock).scrollIntoView().and('be.visible')
        cy.checkNavigationBlock(HOMEPAGE.navigationBlockKaart, '/data/?modus=kaart&legenda=true')
        cy.checkNavigationBlock(HOMEPAGE.navigationBlockPanorama, '/data/panorama/')
        cy.checkNavigationBlock(HOMEPAGE.navigationBlockPublicaties, '/publicaties/zoek/')
        cy.checkNavigationBlock(HOMEPAGE.navigationBlockDatasets, '/datasets/zoek/')
        cy.checkNavigationBlock(HOMEPAGE.navigationBlockTabellen, '/artikelen/artikel/tabellen/')
        cy.checkNavigationBlock(
          HOMEPAGE.navigationBlockDataservices,
          '/artikelen/artikel/services/',
        )
      })
      it('Should check dossiers block', () => {
        cy.get(HOMEPAGE.specialBlock).contains('Dossiers').scrollIntoView().and('be.visible')
        // Dossiers block contains 4 links
        cy.get(HOMEPAGE.specialBlock)
          .eq(0)
          .find('[class*=ColumnStyle] > a')
          .should('have.length', '4')
        cy.contains('Overzicht alle dossiers').should('be.visible').click()
        cy.url().should('include', '/dossiers/zoek/')
        cy.go('back')
      })
      it("Should check all links in theme's block", () => {
        cy.get(HOMEPAGE.themesBlock).contains('Zoek op thema').scrollIntoView().should('be.visible')
        cy.checkTheme('Bestuur', '/zoek/?filters=theme%3Btheme%3Abestuur')
        cy.checkTheme('Economie en toerisme', '/zoek/?filters=theme%3Btheme%3Aeconomie-en-toerisme')
        cy.checkTheme('Verkeer', '/zoek/?filters=theme%3Btheme%3Averkeer')
        cy.checkTheme('Bevolking', '/zoek/?filters=theme%3Btheme%3Abevolking')
        cy.checkTheme(
          'Onderwijs en wetenschap',
          '/zoek/?filters=theme%3Btheme%3Aonderwijs-en-wetenschap',
        )
        cy.checkTheme(
          'Werk en sociale zekerheid',
          '/zoek/?filters=theme%3Btheme%3Awerk-en-sociale-zekerheid',
        )
        cy.checkTheme('Cultuur en recreatie', '/zoek/?filters=theme%3Btheme%3Acultuur-en-recreatie')
        cy.checkTheme(
          'Openbare orde en veiligheid',
          '/zoek/?filters=theme%3Btheme%3Aopenbare-orde-en-veiligheid',
        )
        cy.checkTheme('Wonen', '/zoek/?filters=theme%3Btheme%3Awonen')
        cy.checkTheme(
          'Duurzaamheid en milieu',
          '/zoek/?filters=theme%3Btheme%3Aduurzaamheid-en-milieu',
        )
        cy.checkTheme('Ruimte en topografie', '/zoek/?filters=theme%3Btheme%3Aruimte-en-topografie')
        cy.checkTheme('Zorg en welzijn', '/zoek/?filters=theme%3Btheme%3Azorg-en-welzijn')
      })

      it('Should check meer data block', () => {
        cy.get(HOMEPAGE.specialBlock).contains('Meer data').scrollIntoView().and('be.visible')
        // Meer data block contains 3 links
        cy.get(HOMEPAGE.specialBlock)
          .eq(1)
          .find('[class*=ColumnStyle] > a')
          .should('have.length', '3')
      })
      it('Should check organisation block', () => {
        cy.get(HOMEPAGE.organizationBlock).scrollIntoView().and('be.visible')
        cy.get(HOMEPAGE.organizationCardHeading).contains('Over OIS')
        cy.get('[title="Lees meer over Over OIS"]').click()
        cy.url().should('include', '/artikelen/artikel/over-onderzoek-informatie-en-statistiek/')
        cy.go('back')
        cy.get(HOMEPAGE.organizationCardHeading).contains('Onderzoek')
        cy.get('[title="Lees meer over Onderzoek"]').click()
        cy.url().should('include', '/artikelen/artikel/onderzoek-door-ois/')
        cy.go('back')
        cy.get(HOMEPAGE.organizationCardHeading).contains('Panels en enquêtes')
        cy.get(HOMEPAGE.organizationCardHeading).contains('Publicaties')
      })
      it('Should check about block', () => {
        cy.get(HOMEPAGE.aboutBlock).scrollIntoView().and('be.visible')
        cy.get(`${HOMEPAGE.aboutBlock} h2`).eq(0).should('have.text', 'Over data')
        cy.get(HOMEPAGE.aboutCard).should('have.length', '4', 10000)
        cy.get(HOMEPAGE.aboutCard)
          .eq(0)
          .find('h3')
          .contains('Amsterdam en data')
          .click({ force: true })
        cy.url().should('include', '/artikelen/artikel/amsterdam-en-data/')
        cy.go('back')
        cy.get(HOMEPAGE.aboutCard).should('have.length', '4', 10000)
        cy.get(HOMEPAGE.aboutCard).eq(1).find('h3').contains('Bronnen').click({ force: true })
        cy.url().should('include', '/artikelen/artikel/bronnen/')
        cy.go('back')
        cy.get(HOMEPAGE.aboutCard).should('have.length', '4', 10000)
        cy.get(HOMEPAGE.aboutCard)
          .eq(2)
          .find('h3')
          .contains('Wat kun je hier?')
          .click({ force: true })
        cy.url().should('include', '/artikelen/artikel/wat-kun-je-allemaal-op-deze-site/')
        cy.go('back')
        cy.get(HOMEPAGE.aboutCard).should('have.length', '4', 10000)
        cy.get(HOMEPAGE.aboutCard)
          .eq(3)
          .find('h3')
          .contains('Veelgestelde vragen')
          .click({ force: true })
        cy.url().should('include', '/artikelen/artikel/veelgestelde-vragen/')
        cy.go('back')
      })
      it('Should check share bar', () => {
        cy.get(HOMEPAGE.shareBar).should('be.visible')
        cy.get(HOMEPAGE.shareButtonFacebook).should('be.visible')
        cy.get(HOMEPAGE.shareButtonTwitter).should('be.visible')
        cy.get(HOMEPAGE.shareButtonLinkedIn).should('be.visible')
        cy.get(HOMEPAGE.shareButtonMail).should('be.visible')
      })
      it('Should check the footer', () => {
        cy.get(HOMEPAGE.footerBlock).eq(0).find('h3').contains('Colofon')
        cy.get(HOMEPAGE.footerBlock)
          .eq(0)
          .find('[title="Databeleid"]')
          .first()
          .click({ force: true })
        cy.url().should('include', '/artikelen/artikel/amsterdam-en-data/')
        cy.go('back')
        cy.get(HOMEPAGE.footerBlock).eq(0).find('[title="Bronnen"]').first().click({ force: true })
        cy.url().should('include', '/artikelen/artikel/bronnen/')
        cy.go('back')
        cy.get(HOMEPAGE.footerBlock)
          .eq(0)
          .find('[title="Over deze site"]')
          .first()
          .click({ force: true })
        cy.url().should('include', '/artikelen/artikel/over-deze-site/')
        cy.go('back')
        cy.get(HOMEPAGE.footerBlock).eq(0).find('[title="Over OIS"]').first().click({ force: true })
        cy.url().should('include', '/artikelen/artikel/over-ois/')
        cy.go('back')

        cy.get(HOMEPAGE.footerBlock).find('h3').contains('Volg de gemeente').should('exist')
        cy.get(HOMEPAGE.footerBlock).find('[title="Nieuwsbrief OIS"]').should('exist')
        cy.get(HOMEPAGE.footerBlock).find('[title="Twitter"]').should('exist')
        cy.get(HOMEPAGE.footerBlock).find('[title="Facebook"]').should('exist')
        cy.get(HOMEPAGE.footerBlock).find('[title="LinkedIn"]').should('exist')
        cy.get(HOMEPAGE.footerBlock).find('[title="GitHub"]').should('exist')

        cy.get(HOMEPAGE.footerBlock).find('h3').contains('Vragen')
        cy.get(HOMEPAGE.footerBlock)
          .find('[title="Veelgestelde vragen"]')
          .first()
          .click({ force: true })
        cy.url().should('include', '/artikelen/artikel/veelgestelde-vragen/')
        cy.go('back')
        cy.get(HOMEPAGE.footerBlock)
          .find('[title="Contact opnemen"]')
          .first()
          .click({ force: true })
        cy.url().should('include', '/artikelen/artikel/contact/')
        cy.go('back')
        cy.get(HOMEPAGE.footerBlock).find('[title="Feedback geven"]').first().click({ force: true })
        cy.get('[class*="ModalStyle__ModalFocus"]').should('be.visible')
        cy.get('[title="Sluit"]').click()
        cy.get(HOMEPAGE.footerBlock).find('[title="Uitleg gebruik"]').first().click({ force: true })
        cy.url().should('include', '/artikelen/artikel/wat-kun-je-hier/')
        cy.go('back')

        // cy.get('[title="Privacy en cookies"]').should('be.visible')
        cy.get('[class*="FooterBottom__FooterBottom"]')
          .find('a')
          .should('have.attr', 'href', 'https://www.amsterdam.nl/privacy/')
          .and('be.visible')
      })
    })
  })
})
