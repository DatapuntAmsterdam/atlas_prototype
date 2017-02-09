'use strict';

const mapSearchResults = require('./map_search-results');

module.exports = function (page) {
    const searchResults = page.dashboard.rightColumn.searchResults;

    expect(page.title)
        .toMatch(/^\d+ resultaten met locatie 121332\.80, 487366\.72 \(52\.3731425, 4\.8928205\) - Atlas$/);

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
    expect(searchResults.categories(2).list(3).link.label).toBe('Burgwallen-Nieuwe Zijde');
    expect(searchResults.categories(2).list(3).subtype).toBe('(buurtcombinatie)');
    expect(searchResults.categories(2).list(4).link.label).toBe('Nieuwe Kerk e.o.');
    expect(searchResults.categories(2).list(4).subtype).toBe('(buurt)');

    mapSearchResults(page);
};
