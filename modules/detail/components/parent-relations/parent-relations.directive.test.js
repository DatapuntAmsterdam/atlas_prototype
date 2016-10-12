describe('The dp-parent-relations directive', function () {
    var $compile,
        $rootScope,
        mockedContent;

    beforeEach(function () {
        angular.mock.module(
            'atlasDetail',
            function ($provide) {
                $provide.constant('PARENT_RELATIONS_CONFIG', [
                    'universe',
                    'planet',
                    'verblijfsobject'
                ]);
                $provide.factory('dpLinkDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });

        mockedContent = {
            universe: {
                _display: 'Het allerhoogste niveau',
                _links: {
                    self: {
                        href: 'http://www.example.com/bag/universe/1'
                    }
                }
            },
            planet: {
                _display: 'Aarde',
                _links: {
                    self: {
                        href: 'http://www.example.com/bag/planet/1'
                    }
                }
            },
            verblijfsobject: {
                _display: 'Weesperstraat 113',
                _links: {
                    self: {
                        href: 'http://www.example.com/bag/addresseerbaar-object/114'
                    }
                }
            }
        };
    });

    function getDirective (content) {
        var directive,
            element,
            scope;

        element = document.createElement('atlas-parent-relations');
        element.setAttribute('content', 'content');

        scope = $rootScope.$new();
        scope.content = content;

        directive = $compile(element)(scope);
        scope.$apply();

        return directive;
    }

    it('creates a list of parent entities', function () {
        var directive,
            content = angular.copy(mockedContent);

        directive = getDirective(content);

        expect(directive.find('dl').length).toBe(1);
        expect(directive.find('dt').length).toBe(3);
        expect(directive.find('dd').length).toBe(3);

        expect(directive.find('dt:nth-of-type(1)').text().trim()).toBe('Universe');
        expect(directive.find('dd:nth-of-type(1)').text().trim()).toBe('Het allerhoogste niveau');

        expect(directive.find('dt:nth-of-type(2)').text().trim()).toBe('Planet');
        expect(directive.find('dd:nth-of-type(2)').text().trim()).toBe('Aarde');

        expect(directive.find('dt:nth-of-type(3)').text().trim()).toBe('Verblijfsobject');
        expect(directive.find('dd:nth-of-type(3)').text().trim()).toBe('Weesperstraat 113');
    });

    it('doesn\'t show missing relations', function () {
        var directive,
            content = angular.copy(mockedContent);

        delete content.verblijfsobject;
        directive = getDirective(content);

        expect(directive.find('dl').length).toBe(1);
        expect(directive.find('dt').length).toBe(2);
        expect(directive.find('dd').length).toBe(2);
    });

    it('supports API data with and without prefix underscores', function () {
        var directive,
            content = angular.copy(mockedContent),
            verblijfsobjectData = angular.copy(content.verblijfsobject);

        delete content.verblijfsobject;
        content._verblijfsobject = verblijfsobjectData;
        directive = getDirective(content);

        expect(directive.find('dl').length).toBe(1);
        expect(directive.find('dt').length).toBe(3);
        expect(directive.find('dd').length).toBe(3);

        expect(directive.find('dt:nth-of-type(3)').text().trim()).toBe('Verblijfsobject');
        expect(directive.find('dd:nth-of-type(3)').text().trim()).toBe('Weesperstraat 113');
    });
});
