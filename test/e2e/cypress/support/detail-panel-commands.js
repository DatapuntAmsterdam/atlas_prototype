import { DATA_DETAIL, DETAIL_PANEL } from './selectors'

Cypress.Commands.add('checkTermAndDefinition', (definitionlistNumber, listTerm, value) => {
  if (value) {
    cy.get(DETAIL_PANEL.definitionList)
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
    cy.get(DETAIL_PANEL.definitionList)
      .eq(definitionlistNumber)
      .within(() => {
        cy.get('[class*="DefinitionListTerm"]')
          .contains(new RegExp(`^${listTerm}$`, 'g'))
          .scrollIntoView()
          .should('be.visible')
      })
  }
})

Cypress.Commands.add('checkInfoBoxes', (arrayTerms) => {
  cy.wrap(arrayTerms).each((term, i) => {
    cy.get(DETAIL_PANEL.buttonInfo).eq(i).click()
    cy.contains(`Uitleg over ${term}`).should('be.visible')
    cy.get('[class*="DetailInfoBox"]').find(DETAIL_PANEL.buttonClose).eq(0).click()
    cy.contains(`Uitleg over ${term}`).should('not.be.visible')
  })
})

Cypress.Commands.add('checkListItems', (fixturePath) => {
  cy.fixture(fixturePath).then((json) => {
    // Check panel type and subject of the panel
    cy.checkPanelHeader(fixturePath)

    // Check for every itemlist all key-value pairs
    const amountOfLists = Object.keys(json.definitionLists).length
    let itemNumber
    let listNumber
    for (listNumber = 0; listNumber < amountOfLists; listNumber += 1) {
      // Check subheader of a itemlist
      cy.checkSubheader(fixturePath, listNumber)
      const keys = Object.keys(json.definitionLists[listNumber].items)
      const values = Object.values(json.definitionLists[listNumber].items)

      for (itemNumber = 0; itemNumber < values.length; itemNumber += 1) {
        // check if key-value pair is visible in the UI
        cy.checkTermAndDefinition(listNumber, keys[itemNumber], values[itemNumber])
      }
    }
  })
})

Cypress.Commands.add('checkLinkItems', (fixturePath) => {
  cy.fixture(fixturePath).then((json) => {
    // Check for every itemlist all key-value pairs
    const amountOfLists = Object.keys(json.linkLists).length
    let itemNumber
    let listNumber
    for (listNumber = 0; listNumber < amountOfLists; listNumber += 1) {
      // Check subheader of a itemlist
      cy.checkSubheaderLinkList(fixturePath, listNumber)
      const values = Object.values(json.linkLists[listNumber].items)

      for (itemNumber = 0; itemNumber < values.length; itemNumber += 1) {
        cy.get(DATA_DETAIL.linkList).should('contain', values[itemNumber])
      }
    }
  })
})

Cypress.Commands.add('checkSubheader', (fixturePath, definitionlistNumber) => {
  cy.fixture(fixturePath).then((json) => {
    if (json.definitionLists[definitionlistNumber].subheading) {
      cy.get(DETAIL_PANEL.subHeader).contains(json.definitionLists[definitionlistNumber].subheading)
    } else {
      cy.log('No subheader')
    }
  })
})

Cypress.Commands.add('checkSubheaderLinkList', (fixturePath, linklistNumber) => {
  cy.fixture(fixturePath).then((json) => {
    if (json.linkLists[linklistNumber].subheading) {
      cy.get(DETAIL_PANEL.subHeader).contains(json.linkLists[linklistNumber].subheading)
    } else {
      cy.log('No subheader')
    }
  })
})

Cypress.Commands.add('checkPanelHeader', (fixturePath) => {
  cy.fixture(fixturePath).then((json) => {
    cy.get(DETAIL_PANEL.panelTypeTitle).contains(json.panelType).should('be.visible')
    cy.get(DETAIL_PANEL.panelSubject).contains(json.panelHeading).should('be.visible')
  })
})
