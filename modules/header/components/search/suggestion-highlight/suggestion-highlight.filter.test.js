describe('The dpSuggestionHighlight filter', function () {
    var suggestionHighlight;

    beforeEach(function () {
        angular.mock.module('atlasHeader');

        angular.mock.inject(function (_suggestionHighlightFilter_) {
            suggestionHighlight = _suggestionHighlightFilter_;
        });
    });

    it('highlights the query in each suggestion', function () {
        var output = suggestionHighlight('Linnaeusstraat', 'Linnaeu');

        expect(output).toBe('<strong>Linnaeu</strong>sstraat');
    });

    it('matches are case-insenstive but it preserves the casing in the output', function () {
        var output = suggestionHighlight('Linnaeusstraat', 'liNNaEU');

        expect(output).toBe('<strong>Linnaeu</strong>sstraat');
    });

    it('matches all text, not just prefixes', function () {
        var output = suggestionHighlight('Linnaeusstraat', 'aeus');

        expect(output).toBe('Linn<strong>aeus</strong>straat');
    });
});
