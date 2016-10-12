describe('The atlas-nummeraanduiding-header directive', function () {
    var $compile,
        $rootScope,
        $q,
        mockedVboData = {
            'http://www.example-endpoint.com/18/': {
                status: {
                    code: '18',
                    omschrijving: 'Verblijfsobject gevormd'
                }
            },
            'http://www.example-endpoint.com/21/': {
                status: {
                    code: '21',
                    omschrijving: 'Verblijfsobject in gebruik'
                }
            }
        };

    beforeEach(function () {
        angular.mock.module(
            'atlasDetail',
            'ngSanitize',
            {
                api: {
                    getByUrl: function (endpoint) {
                        var q = $q.defer();

                        q.resolve(mockedVboData[endpoint]);

                        return q.promise;
                    }
                }
            },
            function ($provide) {
                $provide.factory('dpStelselpediaHeaderDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _$q_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $q = _$q_;
        });
    });

    function getDirective (verblijfsobjectEndpoint, isHoofdadres) {
        var directive,
            element,
            scope;

        element = document.createElement('atlas-nummeraanduiding-header');
        element.setAttribute('heading', 'Maria Austriastraat 730');
        element.setAttribute('meta-data', 'metaData');
        element.setAttribute('verblijfsobject-endpoint', verblijfsobjectEndpoint);
        element.setAttribute('hoofdadres', 'hoofdadres');

        scope = $rootScope.$new();
        scope.metaData = {};
        scope.hoofdadres = isHoofdadres;

        directive = $compile(element)(scope);
        $rootScope.$apply();

        return directive;
    }

    describe('it adds status badges', function () {
        it('adds a red badge if the status of the verblijfsobject is \'Verblijfsobject gevormd\'', function () {
            var directive;

            // Status 'Verblijfsobject in gebruik', don't show a badge
            directive = getDirective('http://www.example-endpoint.com/21/', true);

            expect(directive.find('.badge.badge--red').length).toBe(0);
            expect(directive.text()).not.toContain('Verblijfsobject in gebruik');

            // Status 'Verblijfsobject gevormd', show a badge
            directive = getDirective('http://www.example-endpoint.com/18/', true);
            expect(directive.find('.c-panel--danger').length).toBe(1);
            expect(directive.find('.c-panel--danger').text().trim()).toBe('Verblijfsobject gevormd');
        });

        it('adds a blue badge if it\'s a nevenadres', function () {
            var directive;

            // Hoofdadres
            directive = getDirective('http://www.example-endpoint.com/21/', true);
            expect(directive.find('.badge.badge--blue').length).toBe(0);

            // Nevenadres
            directive = getDirective('http://www.example-endpoint.com/21/', false);
            expect(directive.find('.c-panel--warning').length).toBe(1);
            expect(directive.find('.c-panel--warning').text().trim()).toBe('Dit is een nevenadres');
        });
    });

    it('loads the atlas-stelselpedia-header directive', function () {
        var directive = getDirective('http://www.example-endpoint.com/21/', true);

        expect(directive.find('atlas-stelselpedia-header').length).toBe(1);
        expect(directive.find('atlas-stelselpedia-header').attr('heading')).toBe('Maria Austriastraat 730');
        expect(directive.find('atlas-stelselpedia-header').attr('definition')).toBe('NUMMERAANDUIDING');
        expect(directive.find('atlas-stelselpedia-header').attr('meta-data')).toBe('vm.metaData');
    });

    it('makes the header italic is the verblijfsobject status is \'Verblijfsobject gevormd\'', function () {
        var directive;

        // Status 'Verblijfsobject in gebruik', use a roman font
        directive = getDirective('http://www.example-endpoint.com/21/', true);
        expect(directive.find('atlas-stelselpedia-header').attr('heading')).toBe('Maria Austriastraat 730');

        // Status 'Verblijfsobject gevormd', use an italic font
        directive = getDirective('http://www.example-endpoint.com/18/', true);
        expect(directive.find('atlas-stelselpedia-header').attr('heading')).toBe('<em>Maria Austriastraat 730</em>');
    });
});
