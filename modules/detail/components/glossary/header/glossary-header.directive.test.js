describe('The dp-glossary-header directive', () => {
    var $compile,
        $rootScope;

    beforeEach(() => {
        angular.mock.module('dpDetail', $provide => {
            $provide.constant('GLOSSARY', {
                DEFINITIONS: {
                    BOUWBLOK: {
                        label_singular: 'Bouwblok',
                        label_plural: 'Bouwblokken',
                        description: 'Verhaaltje over bouwblokken',
                        url: 'http:// www.example.com/bouwblok/',
                        meta: ['begin_geldigheid', 'id']
                    },
                    BRONDOCUMENT: {
                        label_singular: 'Brondocument',
                        label_plural: 'Brondocumenten',
                        description: 'Verhaaltje over brondocumenten.',
                        url: 'http:// www.example.com/brondocument/',
                        meta: []
                    },
                    BEPERKING: {
                        label_singular: 'Gemeentelijke beperking',
                        label_plural: 'Gemeentelijke beperkingen',
                        description: 'Lijst van beperkingen op een gebruiksrecht.',
                        url: 'http:// www.example.com/gemeentelijkebeperkingen/',
                        meta: []
                    },
                    INSLAG: {
                        label_singular: 'Inslag',
                        label_plural: 'Inslagen',
                        description: null,
                        url: null,
                        meta: []
                    }
                }
            });

            $provide.factory('dpGlossaryMetaDirective', () => ({}));
            $provide.factory('dpWkpbLinkDirective', () => ({}));
        });

        angular.mock.inject((_$compile_, _$rootScope_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getDirective (heading, definition, usePlural, metaData, brk) {
        const element = document.createElement('dp-glossary-header');
        const scope = $rootScope.$new();

        if (heading !== null) {
            element.setAttribute('heading', heading);
        }

        element.setAttribute('definition', definition);

        element.setAttribute('use-plural', 'usePlural');
        scope.usePlural = usePlural;

        if (metaData !== null) {
            element.setAttribute('meta-data', 'metaData');
            scope.metaData = metaData;
        }

        if (brk !== null) {
            element.setAttribute('brk', 'brk');
            scope.brk = brk;
        }

        const directive = $compile(element)(scope);
        $rootScope.$apply();

        return directive;
    }

    it('optionally shows the glossary label w/ an button to toggle more information', () => {
        let directive;

        // Don't show it if there is no description
        directive = getDirective(null, 'INSLAG', false, null, null);

        // When it's closed
        directive = getDirective(null, 'BOUWBLOK', false, null, null);

        expect(directive.find('.o-header__subtitle').text().trim()).toBe('Bouwblok');
        expect(directive.find('.o-header__button:nth-of-type(1)').attr('title').trim()).toBe('Uitleg tonen');
        expect(directive.find('.o-header__button:nth-of-type(1) .u-sr-only').text().trim()).toBe('Uitleg tonen');

        // When it's opened
        directive.find('.o-header__button:nth-of-type(1)').click();
        expect(directive.find('.o-header__button:nth-of-type(1)').attr('title').trim()).toBe('Uitleg verbergen');
        expect(directive.find('.o-header__button:nth-of-type(1) .u-sr-only').text().trim()).toBe('Uitleg verbergen');
    });

    it('has support for plurals in the glossary label', () => {
        var directive;

        directive = getDirective(null, 'BOUWBLOK', false, null, null);
        expect(directive.find('.o-header__subtitle').text().trim()).toBe('Bouwblok');

        directive = getDirective(null, 'BOUWBLOK', true, null, null);
        expect(directive.find('.o-header__subtitle').text().trim()).toBe('Bouwblokken');
    });

    it('has an optional heading that can be placed in front of the glossary label', () => {
        var directive = getDirective('Ik ben een hele specifieke titel', 'BOUWBLOK', false, null);

        expect(directive.find('.o-header__title').text().trim())
            .toBe('Ik ben een hele specifieke titel');

        expect(directive.find('.o-header__subtitle').text().trim()).toBe('Bouwblok');
    });

    it('always has a glossary panel', () => {
        var directive = getDirective(null, 'BOUWBLOK', false, null, null);

        // The panel is hidden by default
        expect(directive.find('.qa-glossary').length).toBe(0);

        // The panel can be opened by clicking the 'toon uitleg' button
        directive.find('.o-header__button:nth-of-type(1)').click();
        expect(directive.find('.qa-glossary').length).toBe(1);

        // Inside the content of the panel
        expect(directive.find('.qa-glossary h3').text()).toBe('Uitleg over bouwblok');
        expect(directive.find('.qa-glossary p:nth-of-type(1)')
            .text()).toBe('Verhaaltje over bouwblokken');
        expect(directive.find('.qa-glossary a').attr('href'))
            .toBe('http:// www.example.com/bouwblok/');
        expect(directive.find('.qa-glossary a').text().trim())
            .toBe('Lees verder op stelselpedia');
    });

    describe('optionally loads the dp-glossary-meta directive', () => {
        var metaData;

        beforeEach(() => {
            metaData = {
                id: '123456',
                begin_geldigheid: '2016-03-30T22:00:32.017685Z'
            };
        });

        it('optionally show a button with \'toon metadata\' in the header', () => {
            var directive;

            // BRONDOCUMENT has no meta data
            directive = getDirective(null, 'BRONDOCUMENT', false, null, null);

            expect(directive.find('.o-header__button:nth-of-type(2)').length).toBe(0);

            // BOUWBLOK has metadata
            directive = getDirective(null, 'BOUWBLOK', false, metaData, null);

            // When it's closed
            expect(directive.find('.o-header__button:nth-of-type(2)').length).toBe(1);
            expect(directive.find('.o-header__button:nth-of-type(2)').attr('title').trim())
                .toBe('Informatie (metadata) tonen');
            expect(directive.find('.o-header__button:nth-of-type(2) .u-sr-only').text().trim())
                .toBe('Informatie (metadata) tonen');

            // When it's opened
            directive.find('.o-header__button:nth-of-type(2)').click();
            expect(directive.find('.o-header__button:nth-of-type(2)').attr('title').trim())
                .toBe('Informatie (metadata) verbergen');
            expect(directive.find('.o-header__button:nth-of-type(2) .u-sr-only').text().trim())
                .toBe('Informatie (metadata) verbergen');
        });

        it('can open a panel that loads the dp-glossary-meta directive', () => {
            var directive = getDirective(null, 'BOUWBLOK', false, metaData, null);

            // The panel is hidden by default
            expect(directive.find('.qa-metadata').length).toBe(0);

            // Open the panel
            directive.find('.o-header__button:nth-of-type(2)').click();

            expect(directive.find('.qa-metadata').length).toBe(1);
            expect(directive.find('.qa-metadata h3').text().trim()).toBe('Metadata van bouwblok');
            expect(directive.find('.qa-metadata dp-glossary-meta').length).toBe(1);
        });
    });

    describe('optionally activates the dp-wkpb-link directive', () => {
        var brk;

        beforeEach(() => {
            brk = {};
        });

        it('optionally includes the dp-wkpb-link in the header when it\'s a BEPERKING', () => {
            var directive;

            // BRONDOCUMENT has no wkpb-uittreksel
            directive = getDirective(null, 'BRONDOCUMENT', false, null, null);
            expect(directive.find('dp-wkpb-link').length).toBe(0);

            // BEPERKING enige met wkpb uittreksel
            directive = getDirective(null, 'BEPERKING', false, null, brk);
            expect(directive.find('dp-wkpb-link').length).toBe(1);
        });
    });

    describe('the show more stuff buttons', () => {
        var directive,
            metaData = {
                id: '123456',
                begin_geldigheid: '2016-03-30T22:00:32.017685Z'
            };

        beforeEach(() => {
            directive = getDirective(null, 'BOUWBLOK', false, metaData, null);
        });

        it('can be opened and closed with the button in the header', () => {
            expect(directive.find('.qa-glossary').length).toBe(0);

            // Open uitleg
            directive.find('.o-header__button:nth-of-type(1)').click();
            expect(directive.find('.qa-glossary').length).toBe(1);

            // Close uitleg with the button in the header
            directive.find('.o-header__button:nth-of-type(1)').click();
            expect(directive.find('.qa-glossary').length).toBe(0);

            // Open metadata
            directive.find('.o-header__button:nth-of-type(2)').click();
            expect(directive.find('.qa-metadata').length).toBe(1);

            // Close metadata with the button in the header
            directive.find('.o-header__button:nth-of-type(2)').click();
            expect(directive.find('.qa-metadata').length).toBe(0);
        });

        it('can be closed with the button (cross) in the panel', () => {
            expect(directive.find('.qa-glossary').length).toBe(0);

            // Open uitleg
            directive.find('.o-header__button:nth-of-type(1)').click();
            expect(directive.find('.qa-glossary').length).toBe(1);

            // Close uitleg with the cross
            directive.find('.o-btn--close--info').click();
            expect(directive.find('.qa-glossary').length).toBe(0);

            // Open metadata
            directive.find('.o-header__button:nth-of-type(2)').click();
            expect(directive.find('.qa-metadata').length).toBe(1);

            // Close metadata with the cross
            directive.find('.o-btn--close--info').click();
            expect(directive.find('.qa-metadatat').length).toBe(0);
        });

        it('can open uitleg and metadata at the same time', () => {
            expect(directive.find('.qa-glossary').length).toBe(0);

            // Open uitleg
            directive.find('.o-header__button:nth-of-type(1)').click();
            expect(directive.find('.qa-glossary').length).toBe(1);

            // Open metadata
            directive.find('.o-header__button:nth-of-type(2)').click();
            expect(directive.find('.qa-metadata').length).toBe(1);
            expect(directive.find('.qa-glossary').length).toBe(1);
        });
    });
});
