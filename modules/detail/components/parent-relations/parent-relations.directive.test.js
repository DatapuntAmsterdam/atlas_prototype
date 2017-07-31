describe('The dp-parent-relations directive', () => {
    var $compile,
        $rootScope,
        mockedContent;

    beforeEach(() => {
        angular.mock.module(
            'dpDetail',
            $provide => {
                $provide.constant('PARENT_RELATIONS_CONFIG', [
                    'universe',
                    'planet',
                    'buurtcombinatie',
                    'verblijfsobject'
                ]);
                $provide.factory('dpLinkDirective', () => ({}));
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_) => {
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
            buurtcombinatie: {
                _display: 'Oost',
                _links: {
                    self: {
                        href: 'http://www.example.com/bag/_display/666'
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

        element = document.createElement('dp-parent-relations');
        element.setAttribute('content', 'content');

        scope = $rootScope.$new();
        scope.content = content;

        directive = $compile(element)(scope);
        scope.$apply();

        return directive;
    }

    it('creates a list of parent entities', () => {
        var directive,
            content = angular.copy(mockedContent);

        directive = getDirective(content);

        expect(directive.find('dl').length).toBe(1);
        expect(directive.find('dt').length).toBe(4);
        expect(directive.find('dd').length).toBe(4);

        expect(directive.find('dt:nth-of-type(1)').text().trim()).toBe('Universe');
        expect(directive.find('dd:nth-of-type(1)').text().trim()).toBe('Het allerhoogste niveau');

        expect(directive.find('dt:nth-of-type(2)').text().trim()).toBe('Planet');
        expect(directive.find('dd:nth-of-type(2)').text().trim()).toBe('Aarde');

        expect(directive.find('dt:nth-of-type(3)').text().trim()).toBe('Wijk');
        expect(directive.find('dd:nth-of-type(3)').text().trim()).toBe('Oost');

        expect(directive.find('dt:nth-of-type(4)').text().trim()).toBe('Verblijfsobject');
        expect(directive.find('dd:nth-of-type(4)').text().trim()).toBe('Weesperstraat 113');
    });

    it('doesn\'t show missing relations', () => {
        var directive,
            content = angular.copy(mockedContent);

        delete content.verblijfsobject;
        directive = getDirective(content);

        expect(directive.find('dl').length).toBe(1);
        expect(directive.find('dt').length).toBe(3);
        expect(directive.find('dd').length).toBe(3);
    });

    it('supports API data with and without prefix underscores', () => {
        var directive,
            content = angular.copy(mockedContent),
            verblijfsobjectData = angular.copy(content.verblijfsobject);

        delete content.verblijfsobject;
        content._verblijfsobject = verblijfsobjectData;
        directive = getDirective(content);

        expect(directive.find('dl').length).toBe(1);
        expect(directive.find('dt').length).toBe(4);
        expect(directive.find('dd').length).toBe(4);

        expect(directive.find('dt:nth-of-type(4)').text().trim()).toBe('Verblijfsobject');
        expect(directive.find('dd:nth-of-type(4)').text().trim()).toBe('Weesperstraat 113');
    });
});
