import {
  legendOpenParam,
  mapLayersParam,
  viewParam,
} from '../../src/app/pages/MapPage/query-params'
import { routing } from '../../src/app/routes'
import { HEADER, MAP } from '../support/selectors'

describe('embed module', () => {
  beforeEach(() => {
    cy.intercept('POST', '/cms_search/graphql/').as('graphql')
    cy.hidePopup()
  })

  it('should show the user the embed view of the taxi map', () => {
    cy.visit('/themakaart/taxi')
    cy.wait('@graphql')
    cy.get(MAP.contextMenu).click().get(`${MAP.contextMenuItemEmbed}`).click()
    cy.get(HEADER.root).should('not.exist')
    cy.url().should(
      'include',
      `${routing.data.path}?${viewParam.name}=kaart&embed-preview=true&${mapLayersParam.name}=themtaxi-bgt%3A1%7Cthemtaxi-tar%3A1%7Cthemtaxi-pvrts%3A1%7Cthemtaxi-mzt%3A1%7Cthemtaxi-oovtig%3A1%7Cthemtaxi-vezips%3A1%7Cthemtaxi-slpnb%3A1%7Cthemtaxi-slpb%3A1%7Cthemtaxi-nlpnb%3A1%7Cthemtaxi-nlpb%3A1&${legendOpenParam.name}=true`,
    )
  })
  it('should show the user the embed view of the taxi map', () => {
    cy.visit(
      `${routing.data.path}?${viewParam.name}=kaart&embed=true=true&${mapLayersParam.name}=themtaxi-bgt%3A1%7Cthemtaxi-tar%3A1%7Cthemtaxi-pvrts%3A1%7Cthemtaxi-mzt%3A1%7Cthemtaxi-oovtig%3A1%7Cthemtaxi-vezips%3A1%7Cthemtaxi-slpnb%3A1%7Cthemtaxi-slpb%3A1%7Cthemtaxi-nlpnb%3A1%7Cthemtaxi-nlpb%3A1&${legendOpenParam.name}=true`,
    )
    cy.get(HEADER.root).should('not.exist')
    cy.get(MAP.embedButton).contains('data.amsterdam.nl').should('be.visible')
    cy.get(MAP.imageLayer).should('exist')
    cy.get(MAP.mapLegend).should('be.visible')
    cy.get('[type=checkbox]').should('have.length', 12).and('be.checked')
    cy.get('#themtaxi-oplsnl').uncheck({ force: true })
    cy.get('[type=checkbox]').should('have.length', 10)
  })
})
