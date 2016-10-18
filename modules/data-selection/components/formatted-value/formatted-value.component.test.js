describe('The dp-data-selection-download-button component', function () {
    var $compile,
        $rootScope;

    beforeEach(function () {
        function postcodeFilter () {
            return 'filteredValue';
        }

        angular.mock.module(
            'dpDataSelection',
            function ($provide) {
                $provide.value('postcodeFilter', postcodeFilter);
                $provide.constant('dataSelectionConfig', {
                    dataset_a: {
                        ENDPOINT: 'http://www.example.com/datasets/a/',
                        ENDPOINT_EXPORT: 'http://www.example.com/datasets/a/download/',
                        FILTERS: [
                            {
                                slug: 'filter_a'
                            }, {
                                slug: 'filter_b'
                            }
                        ]
                    }
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getComponent (value, format) {
        var component,
            element,
            scope;

        element = document.createElement('dp-data-selection-formatted-value');
        element.setAttribute('value', 'value');
        element.setAttribute('format', 'format');

        scope = $rootScope.$new();
        scope.value = value;
        scope.format = format;

        component = $compile(element)(scope);

        scope.$apply();

        return component;
    }

    it('will default copy the given value', function () {
        var component = getComponent('value');

        expect(component.find('span').text()).toContain('value');
    });

    it('will format a value when a format is supplied', function () {
        var format = {
            align: 'right'
        };

        var component = getComponent('value', format);

        expect(component.find('span').text()).toContain('value');
        expect(component.find('span').attr('class')).toContain('u-align--right');
    });

    it('will filter a value when any filters are supplied', function () {
        var format = {
            filters: ['postcode']
        };

        var component = getComponent('1234AB', format);

        expect(component.find('span').text()).toContain('filteredValue');
        expect(component.find('span').attr('class')).not.toContain('u-align--right');
    });

    it('will filter and format a value when both a format and any filters are supplied', function () {
        var format = {
            align: 'right',
            filters: ['postcode']
        };

        var component = getComponent('1234AB', format);

        expect(component.find('span').text()).toContain('filteredValue');
        expect(component.find('span').attr('class')).toContain('u-align--right');
    });
});
