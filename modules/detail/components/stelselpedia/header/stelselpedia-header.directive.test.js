describe('The atlas-stelselpedia-header directive', function () {
    var $compile,
        $rootScope;

    beforeEach(function () {
        angular.mock.module('atlasDetail', function ($provide) {
            $provide.constant('STELSELPEDIA', {
                DEFINITIONS: {
                    BOUWBLOK: {
                        label_singular: 'Bouwblok',
                        label_plural: 'Bouwblokken',
                        description: 'Verhaaltje over bouwblokken',
                        url: 'http://www.example.com/bouwblok/',
                        meta: ['begin_geldigheid', 'id']
                    },
                    BRONDOCUMENT: {
                        label_singular: 'Brondocument',
                        label_plural: 'Brondocumenten',
                        description: 'Verhaaltje over brondocumenten.',
                        url: 'http://www.example.com/brondocument/',
                        meta: []
                    },
                    GEMEENTELIJKE_BEPERKING: {
                        label_singular: 'Gemeentelijke beperking',
                        label_plural: 'Gemeentelijke beperkingen',
                        description: 'Lijst van beperkingen op een gebruiksrecht.',
                        url: 'http://www.example.com/gemeentelijkebeperkingen/',
                        meta: []
                    }
                }
            });

            $provide.factory('atlasStelselpediaMetaDirective', function () {
                return {};
            });
            $provide.factory('atlasWkpbLinkDirective', function () {
                return {};
            });
        });

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getDirective (heading, definition, usePlural, metaData, brk) {
        var directive,
            element,
            scope;

        element = document.createElement('atlas-stelselpedia-header');
        scope = $rootScope.$new();

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

        directive = $compile(element)(scope);
        $rootScope.$apply();

        return directive;
    }

    it('always shows the Stelselpedia label w/ an button to toggle more information', function () {
        var directive = getDirective(null, 'BOUWBLOK', false, null, null);

        expect(directive.find('.o-header__subtitle').text().trim()).toBe('Bouwblok');
        expect(directive.find('.o-header__button:nth-of-type(1)').text().trim()).toBe('Toon uitleg');
    });

    it('has support for plurals in the Stelselpedia label', function () {
        var directive;

        directive = getDirective(null, 'BOUWBLOK', false, null, null);
        expect(directive.find('.o-header__subtitle').text().trim()).toBe('Bouwblok');

        directive = getDirective(null, 'BOUWBLOK', true, null, null);
        expect(directive.find('.o-header__subtitle').text().trim()).toBe('Bouwblokken');
    });

    it('has an optional heading that can be placed in front of the Stelselpedia label', function () {
        var directive = getDirective('Ik ben een hele specifieke titel', 'BOUWBLOK', false, null);

        expect(directive.find('.o-header__title').text().trim())
            .toBe('Ik ben een hele specifieke titel');

        expect(directive.find('.o-header__subtitle').text().trim()).toBe('Bouwblok');
    });

    it('always has a Stelselpedia panel', function () {
        var directive = getDirective(null, 'BOUWBLOK', false, null, null);

        //The panel is hidden by default
        expect(directive.find('.c-stelselpedia').length).toBe(0);

        //The panel can be opened by clicking the 'toon uitleg' button
        directive.find('.o-header__button:nth-of-type(1)').click();
        expect(directive.find('.c-stelselpedia').length).toBe(1);

        //Inside the content of the panel
        expect(directive.find('.c-stelselpedia h4').text()).toBe('Uitleg over bouwblok');
        expect(directive.find('.c-stelselpedia p:nth-of-type(1)')
            .text()).toBe('Verhaaltje over bouwblokken');
        expect(directive.find('.c-stelselpedia a').attr('href'))
            .toBe('http://www.example.com/bouwblok/');
        expect(directive.find('.c-stelselpedia a').text().trim())
            .toBe('Lees verder op stelselpedia');
    });

    describe('optionally loads the atlas-stelselpedia-meta directive', function () {
        var metaData;

        beforeEach(function () {
            metaData = {
                id: '123456',
                begin_geldigheid: '2016-03-30T22:00:32.017685Z'
            };
        });

        it('optionally show a button with \'toon metadata\' in the header', function () {
            var directive;

            //BRONDOCUMENT has no meta data
            directive = getDirective(null, 'BRONDOCUMENT', false, null, null);

            expect(directive.find('.o-header__button:nth-of-type(2)').length).toBe(0);

            //BOUWBLOK has metadata
            directive = getDirective(null, 'BOUWBLOK', false, metaData, null);
            expect(directive.find('.o-header__button:nth-of-type(2)').length).toBe(1);
            expect(directive.find('.o-header__button:nth-of-type(2)').text().trim()).toBe('Toon metadata');
        });

        it('can open a panel that loads the atlas-stelselpedia-meta directive', function () {
            var directive = getDirective(null, 'BOUWBLOK', false, metaData, null);

            //The panel is hidden by default
            expect(directive.find('.c-metadata').length).toBe(0);

            //Open the panel
            directive.find('.o-header__button:nth-of-type(2)').click();

            expect(directive.find('.c-metadata').length).toBe(1);
            expect(directive.find('.c-metadata h4').text().trim()).toBe('Metadata van bouwblok');
            expect(directive.find('.c-metadata atlas-stelselpedia-meta').length).toBe(1);
        });
    });

    describe('optionally activates the atlas-wkpb-link directive', function () {
        var brk;

        beforeEach(function () {
            brk = {};
        });

        it('optionally show a button with \'WKPB-uittreksel\' in the header als GEMEENTELIJKE_BEPERKING', function () {
            var directive;

            //BRONDOCUMENT has no wkpb-uittreksel
            directive = getDirective(null, 'BRONDOCUMENT', false, null, null);


            expect(directive.find('atlas-wkpb-link').length).toBe(0);

            //GEMEENTELIJKE_BEPERKING enige met wkpb uittreksel
            directive = getDirective(null, 'GEMEENTELIJKE_BEPERKING', false, null, brk);

            expect(directive.find('atlas-wkpb-link').length).toBe(1);
        });

    });

    describe('the show more stuff buttons', function () {
        var directive,
            metaData = {
                id: '123456',
                begin_geldigheid: '2016-03-30T22:00:32.017685Z'
            };

        beforeEach(function () {
            directive = getDirective(null, 'BOUWBLOK', false, metaData, null);
        });

        it('can be opened and closed with the button in the header', function () {
            expect(directive.find('.c-stelselpedia').length).toBe(0);

            //Open uitleg
            directive.find('.o-header__button:nth-of-type(1)').click();
            expect(directive.find('.c-stelselpedia').length).toBe(1);

            //Close uitleg with the button in the header
            directive.find('.o-header__button:nth-of-type(1)').click();
            expect(directive.find('.c-stelselpedia').length).toBe(0);

            //Open metadata
            directive.find('.o-header__button:nth-of-type(2)').click();
            expect(directive.find('.c-metadata').length).toBe(1);

            //Close metadata with the button in the header
            directive.find('.o-header__button:nth-of-type(2)').click();
            expect(directive.find('.c-metadata').length).toBe(0);
        });

        it('can be closed with the button (cross) in the panel', function () {
            expect(directive.find('.c-stelselpedia').length).toBe(0);

            //Open uitleg
            directive.find('.o-header__button:nth-of-type(1)').click();
            expect(directive.find('.c-stelselpedia').length).toBe(1);

            //Close uitleg with the cross
            directive.find('.o-btn--close').click();
            expect(directive.find('.c-stelselpedia').length).toBe(0);

            //Open metadata
            directive.find('.o-header__button:nth-of-type(2)').click();
            expect(directive.find('.c-metadata').length).toBe(1);

            //Close metadata with the cross
            directive.find('.o-btn--close').click();
            expect(directive.find('.c-metadatat').length).toBe(0);
        });

        it('can open uitleg and metadata at the same time', function () {
            expect(directive.find('.c-stelselpedia').length).toBe(0);

            //Open uitleg
            directive.find('.o-header__button:nth-of-type(1)').click();
            expect(directive.find('.c-stelselpedia').length).toBe(1);

            //Open metadata
            directive.find('.o-header__button:nth-of-type(2)').click();
            expect(directive.find('.c-metadata').length).toBe(1);
            expect(directive.find('.c-stelselpedia').length).toBe(1);
        });
    });
});
