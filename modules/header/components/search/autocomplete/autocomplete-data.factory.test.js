describe('The autocompleteData factory', function () {
    var $httpBackend,
        $rootScope,
        autocompleteData,
        mockedResults,
        mockedNoResults;

    beforeEach(function () {
        angular.mock.module(
            'atlasHeader',
            {
                environment: {
                    API_ROOT: 'http://api-domain.com/'
                }
            },
            function ($provide) {
                $provide.constant('HEADER_CONFIG', {
                    AUTOCOMPLETE_ENDPOINT: 'path/to/typeahead/'
                });
            }
        );

        angular.mock.inject(function (_$httpBackend_, _$rootScope_, _autocompleteData_) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            autocompleteData = _autocompleteData_;
        });

        mockedResults = [
            {
                label: 'Straatnamen (1)',
                content: [
                    {
                        _display: 'Linnaeusstraat (427 adressen)',
                        query: 'Linnaeusstraat',
                        uri: 'bag/openbareruimte/123'
                    }
                ]
            }, {
                label: 'Adressen (2)',
                content: [
                    {
                        _display: 'Linnaeusstraat 1',
                        query: 'Linnaeusstraat 1',
                        uri: 'bag/verblijfsobject/123'
                    },
                    {
                        _display: 'Linnaeusstraat 2',
                        query: 'Linnaeusstraat 2',
                        uri: 'bag/verblijfsobject/124'
                    }
                ]
            }
        ];

        mockedNoResults = [];

        $httpBackend
            .whenGET('http://api-domain.com/path/to/typeahead/?q=linn')
            .respond(mockedNoResults);

        $httpBackend
            .whenGET('http://api-domain.com/path/to/typeahead/?q=linnae')
            .respond(mockedResults);
    });

    it('can search and format data', function () {
        var suggestions;

        autocompleteData.search('linnae').then(function (data) {
            suggestions = data;
        });

        $rootScope.$apply();
        $httpBackend.flush();

        expect(suggestions.count).toBe(3);
        expect(suggestions.data.length).toBe(2);

        expect(suggestions.data[0].label).toBe('Straatnamen (1)');
        expect(suggestions.data[0].content.length).toBe(1);

        expect(suggestions.data[0].content[0]._display).toBe('Linnaeusstraat (427 adressen)');
        expect(suggestions.data[0].content[0].query).toBe('Linnaeusstraat');
        expect(suggestions.data[0].content[0].uri).toBe('bag/openbareruimte/123');
        expect(suggestions.data[0].content[0].index).toBe(0);

        expect(suggestions.data[1].label).toBe('Adressen (2)');
        expect(suggestions.data[1].content.length).toBe(2);

        expect(suggestions.data[1].content[0]._display).toBe('Linnaeusstraat 1');
        expect(suggestions.data[1].content[0].query).toBe('Linnaeusstraat 1');
        expect(suggestions.data[1].content[0].uri).toBe('bag/verblijfsobject/123');
        expect(suggestions.data[1].content[0].index).toBe(1);

        expect(suggestions.data[1].content[1]._display).toBe('Linnaeusstraat 2');
        expect(suggestions.data[1].content[1].query).toBe('Linnaeusstraat 2');
        expect(suggestions.data[1].content[1].uri).toBe('bag/verblijfsobject/124');
        expect(suggestions.data[1].content[1].index).toBe(2);
    });

    it('can get the active search suggestion', function () {
        var mockedFormattedSearchResults = [
            {
                label: 'Category A',
                content: [
                    {
                        _display: 'Suggestion A1',
                        index: 0
                    }, {
                        _display: 'Suggestion A2',
                        index: 1
                    }
                ]
            }, {
                label: 'Category B',
                content: [
                    {
                        _display: 'Suggestion B1',
                        index: 2
                    }
                ]
            }, {
                label: 'Category C',
                content: [
                    {
                        _display: 'Suggestion C1',
                        index: 3
                    }, {
                        _display: 'Suggestion C2',
                        index: 4
                    }, {
                        _display: 'Suggestion C3',
                        index: 5
                    }
                ]
            }
        ];

        expect(autocompleteData.getSuggestionByIndex(mockedFormattedSearchResults, 0)._display).toBe('Suggestion A1');
        expect(autocompleteData.getSuggestionByIndex(mockedFormattedSearchResults, 1)._display).toBe('Suggestion A2');
        expect(autocompleteData.getSuggestionByIndex(mockedFormattedSearchResults, 2)._display).toBe('Suggestion B1');
        expect(autocompleteData.getSuggestionByIndex(mockedFormattedSearchResults, 3)._display).toBe('Suggestion C1');
        expect(autocompleteData.getSuggestionByIndex(mockedFormattedSearchResults, 4)._display).toBe('Suggestion C2');
        expect(autocompleteData.getSuggestionByIndex(mockedFormattedSearchResults, 5)._display).toBe('Suggestion C3');
    });
});
