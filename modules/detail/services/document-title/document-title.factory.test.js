describe('The dpDetailDocumentTitle factory', () => {
    var documentTitle;

    beforeEach(() => {
        angular.mock.module(
            'dpDetail',
            $provide => {
                $provide.constant('GLOSSARY', {
                    DEFINITIONS: {
                        BEPERKING: {
                            label_singular: 'Gemeentelijke beperking'
                        },
                        VESTIGING: {
                            label_singular: 'Vestiging'
                        }
                    }
                });
            }
        );

        angular.mock.inject(dpDetailDocumentTitle => {
            documentTitle = dpDetailDocumentTitle;
        });
    });

    it('combines a GLOSSARY label with a specific display variable', () => {
        var mockedDetailState;

        mockedDetailState = {
            endpoint: 'http://api.example.com/wkpb/beperking/123/',
            display: 'Een beperking'
        };
        expect(documentTitle.getTitle(mockedDetailState)).toBe('Gemeentelijke beperking: Een beperking');

        mockedDetailState.endpoint = 'http://api.example.com/wkpb/beperking/456/';
        mockedDetailState.display = 'Een andere beperking';
        expect(documentTitle.getTitle(mockedDetailState)).toBe('Gemeentelijke beperking: Een andere beperking');

        mockedDetailState.endpoint = 'http://api.example.com/handelsregister/vestiging/789/';
        mockedDetailState.display = 'Vestigingsnaam';
        expect(documentTitle.getTitle(mockedDetailState)).toBe('Vestiging: Vestigingsnaam');
    });
});
