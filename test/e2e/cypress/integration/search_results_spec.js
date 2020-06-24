import { DATA_SEARCH } from '../support/selectors'

describe('Search results', () => {
  describe('Search results all categories, not authenticated', () => {
    beforeEach(() => {
      cy.hidePopup()
      cy.visit('/')
    })
    it("Should search: '363010000546374' and first autosuggestitem and searchresult are: 'Eerste Jan van der Heijdenstraat 2'", () => {
      cy.searchAndCheck('363010000546374', 'Eerste Jan van der Heijdenstraat 2')
    })
    it("Should search: '1072' and first autosuggestitem and searchresult are: 'Albert Cuypstraat'", () => {
      cy.searchAndCheck('1072', 'Albert Cuypstraat')
    })
    it("Should search: '1072 TT' and first autosuggestitem and searchresult are: 'Eerste Jan van der Heijdenstraat'", () => {
      cy.searchAndCheck('1072 TT', 'Eerste Jan van der Heijdenstraat')
    })
    it("Should search: '1072TT' and first autosuggestitem and searchresult are: 'Eerste Jan van der Heijdenstraat'", () => {
      cy.searchAndCheck('1072TT', 'Eerste Jan van der Heijdenstraat')
    })
    it("Should search: 'Westerdok' and first autosuggestitem and searchresult are: 'Westerdok'", () => {
      cy.searchAndCheck('Westerdok', 'Westerdok')
    })
    it("Should search: 'Bijenkorf' and first autosuggestitem and searchresult are: 'De Bijenkorf'", () => {
      cy.searchAndCheck('Bijenkorf', 'De Bijenkorf')
    })
    it("Should search: '363200003761447' and first autosuggestitem and searchresult are: 'Dam 1'", () => {
      cy.searchAndCheck('363200003761447', 'Dam 1')
    })
    it("Should search: '363010000545372' and first autosuggestitem and searchresult are: 'Eerste Hugo de Grootstraat 7-3'", () => {
      cy.searchAndCheck('363010000545372', 'Eerste Hugo de Grootstraat 7-3')
    })
    it("Should search: '363020001988063' and first autosuggestitem and searchresult are: 'Singel 622'", () => {
      cy.searchAndCheck('363020001988063', 'Singel 622', 'Singel 622 (plaats aangewezen)')
    })
    it("Should search: '363030000927437' and first autosuggestitem and searchresult are: 'Ma Braunpad 2 (plaats aangewezen)'", () => {
      cy.searchAndCheck('363030000927437', 'Ma Braunpad 2', 'Ma Braunpad 2 (plaats aangewezen)')
    })
    it("Should search: '363200003761450' and first autosuggestitem and searchresult are: 'Groenburgwal 25'", () => {
      cy.searchAndCheck('363200003761450', 'Groenburgwal 25', 'Groenburgwal 25')
    })
    it("Should search: 'ASD23 AB 02208 A 0001' and first autosuggestitem and searchresult are: 'ASD23 AB 02208 A 0001'", () => {
      cy.searchAndCheck('ASD23 AB 02208 A 0001', 'ASD23 AB 02208 A 0001')
    })
    it("Should search: 'Aalsmeer B47' and first autosuggestitem and searchresult are: 'AMR03 B 04705 G 0000'", () => {
      cy.searchAndCheck('Aalsmeer B47', 'AMR03 B 04705 G 0000')
    })
    it("Should search: 'Jordaan' and first autosuggestitem and searchresult are: 'Jordaan (wijk)'", () => {
      cy.searchAndCheck('Jordaan', 'Jordaan (wijk)')
    })
    it("Should search: 'Kernzone ' and first autosuggestitem and searchresult are: 'Kernzone (unesco)'", () => {
      cy.searchAndCheck('Kernzone ', 'Kernzone (unesco)')
    })
    it("Should search: '10381' and first autosuggestitem and searchresult are: '10381000'", () => {
      cy.searchAndCheck('10381', '10381000')
    })
    it("Should search: 'yd21' and first autosuggestitem and searchresult are: 'YD21 (bouwblok)'", () => {
      cy.searchAndCheck('yd21', 'YD21 (bouwblok)')
    })
    it("Should search: 'Rijksmuseum' and first autosuggestitem and searchresult are: 'Het Rijksmuseum'", () => {
      cy.searchAndCheck('Rijksmuseum', 'Het Rijksmuseum')
    })
  })
  describe('Search results all categories, authenticated as employee', () => {
    beforeEach(() => {
      cy.hidePopup()
      cy.visit('/')
    })

    before(() => {
      cy.login('EMPLOYEE')
    })

    after(() => {
      cy.logout()
    })

    it("Should search: '34712526' and first autosuggestitem and searchresult are: 'Café Ouwe Garde - Buitenveldertselaan 28'", () => {
      cy.searchAndCheck('34712526', 'Café Ouwe Garde - Buitenveldertselaan 28\n1081AA Amsterdam')
    })
    it("Should search: 'Centraal stomerij' and first autosuggestitem and searchresult are: 'Centraal Stomerij - Overtoom 79 H'", () => {
      cy.searchAndCheck('Centraal stomerij', 'Centraal Stomerij - Overtoom 79 H')
    })
    it("Should search: '67743293' and first autosuggestitem and searchresult are: 'Vlaamsche Friethuis'", () => {
      cy.searchAndCheck('67743293', 'Vlaamsche Friethuis')
    })
  })
  describe('Search results specific category, not authenticated', () => {
    beforeEach(() => {
      cy.hidePopup()
      cy.visit('/')
    })
    it("Should search: 'Heijden' in category 'Straatnamen' and check if first autosuggest item and searchresult are: 'Eerste Jan van der Heijdenstraat'", () => {
      cy.searchInCategoryAndCheckFirst('Heijden', 'Straatnamen', 'Eerste Jan van der Heijdenstraat')
    })
    it("Should search: 'Eerste Jan van der Heijdenstraat 2' in category 'Adressen' and check if first autosuggestitem and searchresult are: 'Eerste Jan van der Heijdenstraat 2'", () => {
      cy.searchInCategoryAndCheckFirst(
        'Eerste Jan van der Heijdenstraat 2',
        'Adressen',
        'Eerste Jan van der Heijdenstraat 2',
      )
    })
    it("Should search: 'Westerdok' in category 'Openbare ruimtes' and check autosuggest: 'Westerdoksdijkspoorbrug (kunstwerk)' and search result: 'Westerdok'", () => {
      cy.searchInCategoryAndCheckFirst(
        'Westerdok',
        'Openbare ruimtes',
        'Westerdoksdijkspoorbrug (kunstwerk)',
        'Westerdok',
      )
    })
    it("Should search: 'Bijenkorf' in category 'Pand' and check if first autosuggestitem and searchresult are: 'De Bijenkorf'", () => {
      cy.searchInCategoryAndCheckFirst('Bijenkorf', 'Pand', 'De Bijenkorf')
    })
    it("Should search: 'ASD23 AB 02208 A 0001' in category 'Kadastraal object' and check if first autosuggestitem and searchresult are: 'ASD23 AB 02208 A 0001'", () => {
      cy.searchInCategoryAndCheckFirst('ASD23 AB 02208 A 0001', 'Kadastra', 'ASD23 AB 02208 A 0001')
    })
    it("Should search: 'Buitenveldert' in category 'Gebieden' and check autosuggest: 'Buitenveldert Midden Zuid (buurt)' and search result: 'Buitenveldertselaan", () => {
      cy.searchInCategoryAndCheckFirst(
        'Buitenveldert',
        'Gebieden',
        'Buitenveldert Midden Zuid (buurt)',
        'Buitenveldertselaan',
      )
    })
    it("Should search: 'Jordaan' in category 'Gebieden' and check if first autosuggestitem and searchresult are: 'Jordaan (wijk)'", () => {
      cy.searchInCategoryAndCheckFirst('Jordaan', 'Gebied', 'Jordaan (wijk)')
    })
    it("Should search: 'Kernzone' in category 'Gebieden' and check if first autosuggestitem and searchresult are: 'Kernzone (unesco)'", () => {
      cy.searchInCategoryAndCheckFirst('Kernzone', 'Gebied', 'Kernzone (unesco)')
    })
    it("Should search: '10381' in category 'Meetbouten' and check if first autosuggestitem and searchresult are: '10381000'", () => {
      cy.searchInCategoryAndCheckFirst('10381', 'Meetbouten', '10381000')
    })
    it("Should search: 'Rijksmuseum' in category 'Monumenten' and check autosuggest: 'Rijksmuseumcomplex (complex)' and search result: 'Het Rijksmuseum'", () => {
      cy.searchInCategoryAndCheckFirst(
        'Rijksmuseum',
        'Monumenten',
        'Rijksmuseumcomplex (complex)',
        'Het Rijksmuseum',
      )
    })
  })
  describe('Search results specific category, authenticated', () => {
    beforeEach(() => {
      cy.hidePopup()
      cy.visit('/')
    })

    before(() => {
      cy.login('EMPLOYEE')
    })

    after(() => {
      cy.logout()
    })
    it("Should search: 'Centraal stomerij' in category 'Maatschappelijke activiteit' and check autosuggest: 'Centraal Stomerij' and search result: 'Centraal Stomerij - Overtoom 79 H'", () => {
      cy.searchInCategoryAndCheckFirst(
        'Centraal stomerij',
        'Maatschappelijke activiteit',
        'Centraal Stomerij',
        'Centraal Stomerij - Overtoom 79 H',
      )
    })
  })
  describe('Search results multiple', () => {
    beforeEach(() => {
      cy.hidePopup()
      cy.visit('/')
    })
    it("Should search: 'Toerisme' in category 'Datasets' and check autosuggest: 'Toerisme in Amsterdam' and search result: 'Toerisme'", () => {
      cy.checkAutoSuggestFirstofCategory(
        'Toerisme',
        'Datasets',
        'Toerisme in Amsterdam',
        'Toerisme',
      )
      cy.checkFirstInSearchResults('Dossiers', 'Toerisme', DATA_SEARCH.searchResultsEditorialCard)
    })
    it("Should search: 'Factsheet' and check if first autosuggestitem and searchresult are: 'Factsheet: Amsterdam fietsstad'", () => {
      cy.checkAutoSuggestFirstOfAll('Factsheet', 'Factsheet: Amsterdam fietsstad')
      cy.checkFirstInSearchResults(
        'Publicaties',
        'Factsheet: Amsterdam fietsstad',
        DATA_SEARCH.searchResultsEditorialCard,
      )
    })
    it("Should search: 'Toerisme' in category 'Artikel' and check if first autosuggestitem and searchresult are: 'Dossier: Toerisme'", () => {
      cy.checkAutoSuggestFirstofCategory('Toerisme', 'Artikelen', 'Toerisme onder druk?')
      cy.checkFirstInSearchResults('Dossiers', 'Toerisme', DATA_SEARCH.searchResultsEditorialCard)
    })
    it("Should search: 'Drugs' in category 'Artikelen' and check autosuggest: 'Drugsoverlast Zuidoost daalt' and search result: 'Gezondheid Amsterdam' ", () => {
      cy.checkAutoSuggestFirstofCategory('Drugs', 'Artikelen', 'Drugsoverlast Zuidoost daalt')
      cy.checkFirstInSearchResults(
        'Datasets',
        'Gezondheid Amsterdam',
        DATA_SEARCH.searchResultsDatasetCard,
      )
    })
    it("Should search: 'Staat van de stad' in category 'Artikelen' and check autosuggest: 'Staat van de Stad' and search result: 'Dossier: corona en de economie'", () => {
      cy.checkAutoSuggestFirstofCategory(
        'Staat van de stad',
        'Artikelen',
        'De Staat van de Stad Amsterdam V verschenen; 10 jaar Staat van de Stad',
      )
      cy.checkFirstInSearchResults(
        'Dossiers',
        'Corona en de economie',
        DATA_SEARCH.searchResultsEditorialCard,
      )
    })
    it("Should search: 'Toerisme' in category 'Dossiers' and check if first autosuggestitem and searchresult are: 'Dossier: Toerisme'", () => {
      cy.checkAutoSuggestFirstofCategory('Toerisme', 'Dossiers', 'Toerisme')
      cy.checkFirstInSearchResults('Dossiers', 'Toerisme', DATA_SEARCH.searchResultsEditorialCard)
    })
    it("Should search: 'Veiligheidsindex' in category 'Specials' and check if first autosuggestitem and searchresult are: 'Dashboard veiligheid'", () => {
      cy.checkAutoSuggestFirstofCategory(
        'Veiligheidsindex',
        'Specials',
        'Dashboard Veiligheid (dashboard)',
      )
      cy.checkFirstInSearchResults(
        'Specials',
        'Dashboard Veiligheid',
        DATA_SEARCH.searchResultsEditorialCard,
      )
    })
    it("Should search: 'Verzinkbare palen' in category 'Kaartlagen' and check if first autosuggestitem and searchresult are: 'Kaartlaag: Verzinkbare palen'", () => {
      cy.checkAutoSuggestFirstofCategory('Verzinkbare palen', 'Kaartlagen', 'Verzinkbare palen')
      cy.checkFirstInSearchResults('Kaartlagen', 'Verzinkbare palen', DATA_SEARCH.searchResultsLink)
    })
  })
})
