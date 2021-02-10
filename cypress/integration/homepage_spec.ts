import { HEADER, HEADER_MENU, HOMEPAGE, DATA_SEARCH } from '../support/selectors'
import {
  FOOTER_LINKS_COLOFON,
  FOOTER_LINKS_SOCIAL,
  FOOTER_LINKS_HELP,
  FOOTER_LINK_PRIVACY,
} from '../../src/shared/config/content-links'

describe('Homepage module', () => {
  const sizes: Cypress.ViewportPreset[] = ['iphone-x', 'ipad-2', 'macbook-15']
  sizes.forEach((size) => {
    describe(`Header navigation ${size as string}`, () => {
      beforeEach(() => {
        cy.viewport(size)
        cy.visit('/')
        cy.hidePopup()
      })

      it('Has the right link text', () => {
        cy.get(HEADER.root).should('be.visible')
        cy.get(HEADER.logoAmsterdamTitle).should('contain', 'Data en informatie').and('be.visible')
        cy.get(HEADER.headerTitle).should('contain', 'Data en informatie').and('be.visible')
        cy.get(HEADER_MENU.rootDefault).should('exist')

        if (size === 'macbook-15') {
          cy.get(HEADER.logoAmsterdamTall).should('be.visible')
        } else {
          cy.get(HEADER.logoAmsterdamShort).should('be.visible')
        }

        if (size === 'iphone-x') {
          cy.get(HOMEPAGE.buttonSearchMobile).should('be.visible').click()
          cy.get(DATA_SEARCH.input).should('be.visible')
          cy.get(HOMEPAGE.buttonSearchMobileClose).click()
        } else {
          cy.get(DATA_SEARCH.input).should('be.visible')
          cy.get(HOMEPAGE.buttonSearch).should('be.visible')
        }
      })

      it('has clickable links', () => {
        // assert that links in the header are clickable and will load the homepage
        cy.get(`${HEADER.root} h1 > a`).each((element: JQuery<HTMLElement>, index: number) => {
          cy.visit('/datasets/zoek/')

          cy.get(HEADER.root).should('be.visible')

          cy.get(`${HEADER.root} h1 > a`).eq(index).click()

          cy.get(HEADER.root).should('be.visible')

          cy.url().should('not.include', '/datasets/zoek/')
        })
      })
    })

    describe(`Homepage checks, resolution is: ${size as string}`, () => {
      beforeEach(() => {
        cy.viewport(size)
        cy.visit('/')
        cy.hidePopup()
      })

      it('Should check all menu items', () => {
        const menuSelector: string =
          size === 'macbook-15' ? HOMEPAGE.menuDefault : HOMEPAGE.menuMobile

        cy.checkMenuLink({
          menuSelector,
          menu: 'Onderdelen',
          testId: 'Kaart',
          href: '/data/?modus=kaart&legenda=true',
        })

        cy.checkMenuLink({
          menuSelector,
          menu: 'Onderdelen',
          testId: 'Tabellen',
          href: '/artikelen/artikel/tabellen/',
        })

        cy.checkMenuLink({
          menuSelector,
          menu: 'Onderdelen',
          testId: 'DataServices',
          href: '/artikelen/artikel/services/',
        })

        cy.checkMenuLink({
          menuSelector,
          menu: 'Onderdelen',
          testId: 'Dossiers',
          href: '/dossiers/zoek/',
        })

        cy.checkMenuLink({
          menuSelector,
          menu: 'Onderdelen',
          testId: 'Specials',
          href: '/specials/zoek/',
        })

        cy.checkMenuLink({
          menuSelector,
          menu: 'Onderdelen',
          testId: 'Kaarten',
          href: '/kaarten/zoek/',
        })

        cy.checkMenuLink({
          menuSelector,
          menu: 'Onderdelen',
          testId: 'Datasets',
          href: '/datasets/zoek/',
        })

        cy.checkMenuLink({
          menuSelector,
          menu: 'Onderdelen',
          testId: 'Publicaties',
          href: '/publicaties/zoek/',
        })

        cy.checkMenuLink({
          menuSelector,
          menu: 'Onderdelen',
          testId: 'Artikelen',
          href: '/artikelen/zoek/',
        })

        cy.checkMenuLink({
          menuSelector,
          menu: 'Over OIS',
          testId: 'OverOIS',
          href: '/artikelen/artikel/over-ois/',
        })

        cy.checkMenuLink({
          menuSelector,
          menu: 'Over OIS',
          testId: 'OverOnderzoek',
          href: '/artikelen/artikel/onderzoek-door-ois/',
        })

        cy.checkMenuLink({
          menuSelector,
          menu: 'Over OIS',
          testId: 'OverDatabeleid',
          href: '/artikelen/artikel/amsterdam-en-data/',
        })

        cy.checkMenuLink({
          menuSelector,
          menu: 'Over OIS',
          testId: 'OverBronnen',
          href: '/artikelen/artikel/bronnen/',
        })

        cy.checkMenuLink({
          menuSelector,
          menu: 'Over OIS',
          testId: 'OverContact',
          href: '/artikelen/artikel/contact/',
        })

        cy.get('[aria-labelledby="feedback"]').should('not.exist')

        if (menuSelector === HOMEPAGE.menuMobile) {
          cy.get(menuSelector).click()
        }

        cy.get(menuSelector).contains('Feedback').click()

        cy.get('[aria-labelledby="feedback"]').should('exist').and('be.visible')
        cy.get('[aria-labelledby="feedback"]').find('button[title="Sluit"]').click()
        cy.get('[aria-labelledby="feedback"]').should('not.exist')

        if (menuSelector === HOMEPAGE.menuMobile) {
          cy.get(menuSelector).click()
        }

        cy.get(menuSelector).contains('Help').click()
        cy.url().should('include', '/artikelen/artikel/help/')
        cy.go('back')

        if (menuSelector === HOMEPAGE.menuMobile) {
          cy.get(menuSelector).click()
        }

        cy.get(menuSelector).contains('Inloggen')
      })

      it('Should check the highlight block', () => {
        cy.get(HOMEPAGE.highlightBlock).scrollIntoView().and('be.visible')
        cy.get(HOMEPAGE.highlightCard).should('have.length', '3')
        cy.contains('Bekijk overzicht').click()
        cy.url().should('include', '/artikelen/zoek/')
        cy.go('back')
        cy.get(HOMEPAGE.highlightBlock).scrollIntoView().and('be.visible')
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
          .should('have.length', 4)
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
        const deployEnv = Cypress.env('DEPLOY_ENV')

        const footerSections = {
          Colofon: FOOTER_LINKS_COLOFON,
          FollowUs: FOOTER_LINKS_SOCIAL,
          Questions: FOOTER_LINKS_HELP,
        }
        const headers = {
          Colofon: 'Colofon',
          FollowUs: 'Volg de gemeente',
          Questions: 'Vragen',
        }

        Object.entries(footerSections).forEach(([section, links]) => {
          cy.get(`[data-testid="footer${section}"]`)
            .find('h3')
            .contains(headers[section])
            .scrollIntoView()

          // on smaller screens, column contents are collapsed and need to be opened before they can be interacted with
          cy.get(`[data-testid="footer${section}"]`).then((sectionElement) => {
            // not all screen sizes have collapsed content; checking first
            if (!sectionElement.find('[aria-hidden]').length) return

            cy.wrap(sectionElement)
              .find('[aria-hidden]')
              .should('have.attr', 'aria-hidden', 'true')
              .and('not.be.visible')

            cy.wrap(sectionElement).find('[aria-hidden]').parent().find('h3').click()

            // giving the UI the opportunity to update itself
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(150)

            cy.wrap(sectionElement)
              .find('[aria-hidden]')
              .should('have.attr', 'aria-hidden', 'false')
              .and('be.visible')
          })

          // @ts-ignore
          links.forEach(({ testId, id, href }) => {
            cy.get(`[data-testid="footer${section}"]`)
              .find(`[data-testid="footerLink${testId as string}"]`)
              .then((element) => {
                if (id) {
                  cy.wrap(element).click()
                  cy.url().should('include', id[deployEnv])

                  cy.go('back')
                } else if (href) {
                  // not testing links that open content in a new window; just verifying that they intend to do that
                  cy.wrap(element)
                    .should('have.attr', 'target', '_blank')
                    .and('have.attr', 'href', href)
                    .and('be.visible')
                }
              })
          })
        })

        cy.get(`[data-testid="${FOOTER_LINK_PRIVACY.testId}"]`)
          .should('have.attr', 'href', FOOTER_LINK_PRIVACY.href)
          .and('be.visible')
      })
    })
  })
})
