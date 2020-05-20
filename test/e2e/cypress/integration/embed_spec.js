import { HEADER, MAP } from '../support/selectors'
import { routing } from '../../../../src/app/routes'
import PARAMETERS from '../../../../src/store/parameters'

const { VIEW, VIEW_CENTER, LAYERS, LEGEND, EMBED_PREVIEW } = PARAMETERS

describe('embed module', () => {
  beforeEach(() => {
    cy.server()
    cy.route('POST', '/cms_search/graphql/').as('graphql')
    cy.hidePopup()
  })
  it('should show the user the embed preview of the map', () => {
    cy.visit(
      `/${routing.data.path}?${VIEW_CENTER}=52.3617139%2C4.8888734&${LAYERS}=bgem%3A1%7Ckgem%3A1%7Cksec%3A0%7Ckot%3A0&${LEGEND}=true&${VIEW}=kaart`,
    )
    cy.wait('@graphql')
    cy.get(HEADER.root).should('exist')
    cy.get('#Hoogte').check()
    cy.get(MAP.contextMenu).click().get(`${MAP.contextMenuItemEmbed}`).click()
    // the header should be hidden
    cy.get(HEADER.root).should('not.exist')
    // the embed preview parameter should be present in the url
    cy.url().should(
      'include',
      `?${VIEW}=kaart&${VIEW_CENTER}=52.3617139%2C4.8888734&${EMBED_PREVIEW}=true&${LAYERS}=bgem%3A1%7Ckgem%3A1%7Cksec%3A0%7Ckot%3A0%7Chgte-dtm%3A1%7Chgte-dsm%3A1%7Chgte-nap%3A1%7Chgte-mbs%3A1%7Chgte-mbz%3A1%7Chgte-mbr%3A1&${LEGEND}=true`,
    )
  })

  it('should show the user the embed view of the map', () => {
    cy.visit(
      `/data/?${VIEW}=kaart&${VIEW_CENTER}=52.3617139%2C4.8888734&embed=true&${LAYERS}=gebind-buurt%3A1%7Cgebind-bc%3A1%7Cgebind-sd%3A1%7Cgebind-bbn%3A1%7Cgebind-ggwpg%3A1%7Cgebind-ggwg%3A1%7Cgebind-ggro%3A1%7Cgebind-ggra%3A1&${LEGEND}=true&zoom=9`,
    )
    cy.wait('@graphql')
    // the header should be hidden
    cy.get(HEADER.root).should('not.exist')
    // the button to go back to the application should exist
    cy.get(MAP.embedButton).contains('data.amsterdam.nl').should('exist').and('be.visible')
    // this link has layers active
    cy.get(MAP.imageLayer).should('exist')
    cy.get(MAP.mapLegend).should('be.visible')
    cy.get('[type=checkbox]').should('have.length', 10).and('be.checked')
    cy.get('#gebind-ggw').uncheck()
    cy.get('[type=checkbox]').should('have.length', 8)
  })
})
