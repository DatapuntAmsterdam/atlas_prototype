'use strict';

fdescribe('each URL should load the corresponding view', function () {
    let page;

    it('DATA-SELECTION--CARDS', () => {
        page = dp.navigate('DATA-SELECTION--CARDS');

        dp.validate('DATA-SELECTION--CARDS', page);

        expect(page.dashboard.rightColumn.dataSelection.availableFilters.categories(0).header).toBe('Thema\'s');
    });

    it('DATA-SELECTION--TABLE', () => {
        page = dp.navigate('DATA-SELECTION--TABLE');
        const dataSelection = page.dashboard.rightColumn.dataSelection;

        dp.validate('DATA-SELECTION--TABLE', page);

        expect(page.title).toBe('Tabel Adressen - Atlas');

        expect(dataSelection.header.title).toContain('Adressen');

        expect(dataSelection.availableFilters.categories(0).header).toBe('Stadsdeel');
        expect(dataSelection.availableFilters.categories(0).options(0).label).toBe('Centrum');
        expect(dataSelection.availableFilters.categories(0).options(1).label).toBe('Nieuw-West');

        expect(dataSelection.availableFilters.categories(1).header).toBe('GGW-gebied');
        expect(dataSelection.availableFilters.categories(1).options(0).label).toBe('Bijlmer Centrum');
    });

    it('DETAIL', () => {
        page = dp.navigate('DETAIL');

        dp.validate('DETAIL', page);
    });

    it('LAYER-SELECTION_MAP', () => {
        page = dp.navigate('LAYER-SELECTION_MAP');

        dp.validate('LAYER-SELECTION_MAP', page);
    });

    it('MAP', () => {
        page = dp.navigate('MAP');

        dp.validate('MAP', page);
    });

    it('MAP_DATA-SELECTION', () => {
        page = dp.navigate('MAP_DATA-SELECTION');

        dp.validate('MAP_DATA-SELECTION', page);

        expect(page.dashboard.rightColumn.dataSelection.header.tabs(0).isActive).toBe(false);
        expect(page.dashboard.rightColumn.dataSelection.header.tabs(1).isActive).toBe(true);
    });

    it('MAP_DETAIL--NUMMERAANDUIDING', () => {
        page = dp.navigate('MAP_DETAIL--NUMMERAANDUIDING');
        const detail = page.dashboard.rightColumn.detail;

        dp.validate('MAP_DETAIL--NUMMERAANDUIDING', page);

        expect(page.title).toMatch('Adres: Maria Austriastraat 730 - Atlas');

        expect(detail.nummeraanduiding.nummeraanduidingHeader.glossaryHeader.title)
            .toBe('Maria Austriastraat 730');
        expect(detail.nummeraanduiding.nummeraanduidingHeader.glossaryHeader.subtitle).toBe('Adres');
        expect(detail.nummeraanduiding.descriptionList.term(0)).toBe('Naam openbare ruimte');
        expect(detail.nummeraanduiding.descriptionList.definition(0)).toBe('Maria Austriastraat');
        expect(detail.nummeraanduiding.descriptionList.term(1)).toBe('Huisnummer');
        expect(detail.nummeraanduiding.descriptionList.definition(1)).toBe('730');
        expect(detail.nummeraanduiding.descriptionList.term(2)).toBe('Huisletter');
        expect(detail.nummeraanduiding.descriptionList.definition(2)).toBe('');
        expect(detail.nummeraanduiding.descriptionList.term(3)).toBe('Huisnummertoevoeging');
        expect(detail.nummeraanduiding.descriptionList.definition(3)).toBe('');
        expect(detail.nummeraanduiding.descriptionList.term(4)).toBe('Postcode');
        expect(detail.nummeraanduiding.descriptionList.definition(4)).toBe('1087KH');
        expect(detail.nummeraanduiding.descriptionList.term(5)).toBe('Woonplaats');
        expect(detail.nummeraanduiding.descriptionList.definition(5)).toBe('Amsterdam');
        expect(detail.nummeraanduiding.descriptionList.term(6)).toBe('Status');
        expect(detail.nummeraanduiding.descriptionList.definition(6)).toBe('Naamgeving uitgegeven');

        expect(detail.verblijfsobject.glossaryHeader.subtitle).toBe('Verblijfsobject');
        expect(detail.verblijfsobject.descriptionList.term(0)).toBe('Gebruiksdoel');
        expect(detail.verblijfsobject.descriptionList.definition(0)).toBe('BEST-woning');
        expect(detail.verblijfsobject.descriptionList.term(1)).toBe('Feitelijk gebruik');
        expect(detail.verblijfsobject.descriptionList.definition(1)).toBe('woning');
    });

    it('MAP_PAGE--HOME', () => {
        page = dp.navigate('MAP_PAGE--HOME');

        dp.validate('MAP_PAGE--HOME', page);
    });

    it('MAP_PAGE--LOGIN', () => {
        page = dp.navigate('MAP_PAGE--LOGIN');

        dp.validate('MAP_PAGE--LOGIN', page);
    });

    it('MAP_SEARCH-RESULTS--LOCATION', () => {
        page = dp.navigate('MAP_SEARCH-RESULTS--LOCATION');
        const searchResults = page.dashboard.rightColumn.searchResults;

        dp.validate('MAP_SEARCH-RESULTS--LOCATION', page);

        expect(page.title)
            .toMatch(/^\d+ resultaten met locatie 121356\.94, 487341\.61 \(52\.3729183, 4\.8931775\) - Atlas$/);

        expect(searchResults.categories(0).header).toBe('Openbare ruimte');
        expect(searchResults.categories(0).list(0).link.label).toBe('Dam');

        expect(searchResults.categories(1).header).toBe('Kadastraal object');
        expect(searchResults.categories(1).list(0).link.label).toBe('ASD04F06685G0000');

        expect(searchResults.categories(2).header).toBe('Gebieden (5)');
        expect(searchResults.categories(2).list(0).link.label).toBe('Bufferzone');
        expect(searchResults.categories(2).list(0).subtype).toBe('(unesco)');
        expect(searchResults.categories(2).list(1).link.label).toBe('Centrum');
        expect(searchResults.categories(2).list(1).subtype).toBe('(stadsdeel)');
        expect(searchResults.categories(2).list(2).link.label).toBe('Centrum-West');
        expect(searchResults.categories(2).list(2).subtype).toBe('(gebiedsgericht werken)');
        expect(searchResults.categories(2).list(3).link.label).toBe('Burgwallen-Oude Zijde');
        expect(searchResults.categories(2).list(3).subtype).toBe('(buurtcombinatie)');
        expect(searchResults.categories(2).list(4).link.label).toBe('Oude Kerk e.o.');
        expect(searchResults.categories(2).list(4).subtype).toBe('(buurt)');
    });

    it('MAP_SEARCH-RESULTS--QUERY', () => {
        page = dp.navigate('MAP_SEARCH-RESULTS--QUERY');
        const searchResults = page.dashboard.rightColumn.searchResults;

        dp.validate('MAP_SEARCH-RESULTS--QUERY', page);

        expect(page.title).toMatch(/\d+ resultaten met \"Oost\" - Atlas$/);

        expect(searchResults.categories(0).header).toMatch(/Openbare ruimtes \(\d+\)/);
        expect(searchResults.categories(0).list(0).link.label).toMatch(/Oost/);
        expect(searchResults.categories(0).list(1).link.label).toMatch(/Oost/);
        expect(searchResults.categories(0).list(2).link.label).toMatch(/Oost/);
        expect(searchResults.categories(0).list(9).link.label).toMatch(/Oost/);

        expect(searchResults.categories(1).header).toMatch(/Adressen/);
        expect(searchResults.categories(1).list(0).link.label).toMatch(/Oost/);
        expect(searchResults.categories(1).list(9).link.label).toMatch(/Oost/);

        expect(searchResults.categories(2).header).toMatch(/^Vestigingen \(\d+\)$/);
        expect(searchResults.categories(2).list(0).link.label).toMatch(/Oost/);
        expect(searchResults.categories(2).list(9).link.label).toMatch(/Oost/);

        expect(searchResults.categories(3).header).toMatch(/^Maatschappelijke activiteiten \(\d+\)$/);

        expect(searchResults.categories(4).header).toMatch(/^Kadastrale subjecten \(\d+\)$/);
    });

    it('MAP_STRAATBEELD--DETAIL', () => {
        page = dp.navigate('MAP_STRAATBEELD--DETAIL');

        dp.validate('MAP_STRAATBEELD--DETAIL', page);

        expect(page.title).toBe('Panorama 128708.98, 485100.65 (52.3531791, 5.0013100) - Atlas');
    });

    it('MAP_STRAATBEELD--SEARCH-RESULTS', () => {
        page = dp.navigate('MAP_STRAATBEELD--SEARCH-RESULTS');

        dp.validate('MAP_STRAATBEELD--SEARCH-RESULTS', page);

        expect(page.title).toBe('Panorama 121356.94, 487341.61 (52.3729183, 4.8931775) - Atlas');
    });

    it('STRAATBEELD--DETAIL', () => {
        page = dp.navigate('STRAATBEELD--DETAIL');

        dp.validate('STRAATBEELD--DETAIL', page);

        expect(page.title).toBe('Panorama 128708.98, 485100.65 (52.3531791, 5.0013100) - Atlas');
    });

    it('STRAATBEELD--SEARCH-RESULTS', () => {
        page = dp.navigate('STRAATBEELD--SEARCH-RESULTS');

        dp.validate('STRAATBEELD--SEARCH-RESULTS', page);

        expect(page.title).toBe('Panorama 121356.94, 487341.61 (52.3729183, 4.8931775) - Atlas');
    });
});
