import { DETAIL_PANEL } from './selectors'

declare global {
  // eslint-disable-next-line no-redeclare
  namespace Cypress {
    interface Chainable<Subject> {
      checkTermAndDefinition(
        definitionlistNumber: number,
        listTerm: string,
        value: string | number,
      ): void
      checkInfoBoxes(arrayTerms: string[]): void
      checkListItems(fixturePath: string): void
      checkLinkItems(fixturePath: string): void
      checkPanelHeader(fixturePath: string): void
      checkSubheaderLinkList(fixturePath: string, definitionlistNumber: number): void
      checkSubheader(fixturePath: string, definitionlistNumber: number): void
    }
  }
}

type DefinitionList = {
  [key: string]: {
    items: {
      [key: string]: string
    }
  }
}

type ListItem = {
  definitionLists: DefinitionList
}

Cypress.Commands.add(
  'checkTermAndDefinition',
  (definitionlistNumber: number, listTerm: string, value: string | number) => {
    if (value) {
      cy.get('[class*=DefinitionList__DefinitionList]')
        .eq(definitionlistNumber)
        .within(() => {
          cy.get('[class*="DefinitionListTerm"]')
            .contains(new RegExp(`^${listTerm}$`, 'g'))
            .siblings(DETAIL_PANEL.definitionListDescription)
            .contains(value)
            .scrollIntoView()
            .should('be.visible')
        })
    } else {
      cy.get('[class*=DefinitionList__DefinitionList]')
        .eq(definitionlistNumber)
        .within(() => {
          cy.get('[class*="DefinitionListTerm"]')
            .contains(new RegExp(`^${listTerm}$`, 'g'))
            .siblings(DETAIL_PANEL.definitionListDescription)
            .should('have.text', '')
            .scrollIntoView()
            .should('be.visible')
        })
    }
  },
)

Cypress.Commands.add('checkInfoBoxes', (arrayTerms: string[]) => {
  cy.wrap(arrayTerms).each((term, i) => {
    cy.get(DETAIL_PANEL.buttonInfo).eq(i).click()
    cy.contains(`Uitleg over ${term}`).should('be.visible')
    cy.get('[class*="DetailInfoBox"]').find(DETAIL_PANEL.buttonClose).eq(0).click()
    cy.contains(`Uitleg over ${term}`).should('not.exist')
  })
})

Cypress.Commands.add('checkListItems', (fixturePath: string) => {
  cy.fixture(fixturePath).then((json: ListItem) => {
    // Check panel type and subject of the panel
    cy.checkPanelHeader(fixturePath)
    // Check for every itemlist all key-value pairs
    Object.entries(json.definitionLists).forEach(([, valueA], indexA) => {
      // Check subheader of a itemlist
      cy.checkSubheader(fixturePath, indexA)
      Object.entries(valueA.items).forEach(([keyB, valueB]) => {
        // Check if key-value pair is visible in the UI
        cy.checkTermAndDefinition(indexA, keyB, valueB)
      })
    })
  })
})

Cypress.Commands.add('checkLinkItems', (fixturePath) => {
  cy.fixture(fixturePath).then((json: DefinitionList) => {
    // Check for every itemlist all key-value pairs
    Object.entries(json.linkLists).forEach(([, valueA], indexA) => {
      // Check subheader of a itemlist
      cy.checkSubheaderLinkList(fixturePath, indexA)
      Object.entries(valueA.items).forEach(([, valueB]) => {
        // Check if key-value pair is visible in the UI
        cy.get(DETAIL_PANEL.linkList).should('contain', valueB)
      })
    })
  })
})

Cypress.Commands.add('checkSubheader', (fixturePath: string, definitionlistNumber: number) => {
  cy.fixture(fixturePath).then((json) => {
    if (json.definitionLists[definitionlistNumber].subheading) {
      cy.get(DETAIL_PANEL.subHeader).contains(json.definitionLists[definitionlistNumber].subheading)
    } else {
      cy.log('No subheader')
    }
  })
})

Cypress.Commands.add('checkSubheaderLinkList', (fixturePath: string, linklistNumber: string) => {
  cy.fixture(fixturePath).then((json) => {
    if (json.linkLists[linklistNumber].subheading) {
      cy.get(DETAIL_PANEL.subHeader).contains(json.linkLists[linklistNumber].subheading)
    } else {
      cy.log('No subheader')
    }
  })
})

Cypress.Commands.add('checkPanelHeader', (fixturePath: string) => {
  cy.fixture(fixturePath).then((json) => {
    if (json.panelHeading) {
      cy.get(DETAIL_PANEL.panelTypeTitle).contains(json.panelType).should('be.visible')
      cy.get(DETAIL_PANEL.panelSubject).contains(json.panelHeading).should('be.visible')
    }
  })
})
