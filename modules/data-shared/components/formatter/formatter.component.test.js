describe('The dp-data-shared-formatter component', function () {
    let $compile,
        $rootScope,
        singleParamFormatterFilter,
        doubleParamFormatterFilter;

    beforeEach(function () {
        angular.mock.module(
            'dpDataShared',
            {
                makeBoldFormatterFilter: function (input) {
                    return '<strong>' + input + '</strong>';
                },
                singleParamFormatterFilter: jasmine.createSpy(),
                doubleParamFormatterFilter: jasmine.createSpy()
            }
        );

        angular.mock.inject(
            function (_$compile_, _$rootScope_, _singleParamFormatterFilter_, _doubleParamFormatterFilter_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                singleParamFormatterFilter = _singleParamFormatterFilter_;
                doubleParamFormatterFilter = _doubleParamFormatterFilter_;
            }
        );
    });

    function getComponent (variables, formatter, useInline) {
        let component,
            element,
            scope;

        element = document.createElement('dp-data-shared-formatter');
        element.setAttribute('variables', 'variables');

        if (angular.isString(formatter)) {
            element.setAttribute('formatter', formatter);
        }

        element.setAttribute('use-inline', 'useInline');

        scope = $rootScope.$new();
        scope.variables = variables;
        scope.useInline = useInline;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('returns all values separated by spaces if there is no formatter', function () {
        let component;

        // One variable, nothing to concatenate
        component = getComponent(
            [{
                key: 'my_var_1',
                value: 'my_first_value'
            }],
            undefined,
            false
        );
        expect(component.find('div').text()).toBe('my_first_value');

        // Multiple variables
        component = getComponent(
            [{
                key: 'my_var_1',
                value: 'my_first_value'
            }, {
                key: 'my_var_2',
                value: 'my_second_value'
            }],
            undefined,
            false
        );
        expect(component.find('div').text()).toBe('my_first_value my_second_value');
    });

    it('supports formatters with HTML output', function () {
        let component;

        component = getComponent(
            [{
                key: 'my_var_1',
                value: 'my_first_value'
            }],
            'makeBoldFormatter',
            false
        );
        expect(component.find('div strong').text()).toBe('my_first_value');
    });

    it('has a use-inline option that renders the formatted output in a span instead of a div', function () {
        let component;

        // Not inline (default setting)? Use a div!
        component = getComponent(
            [{
                key: 'my_var_1',
                value: 'my_first_value'
            }],
            undefined,
            false
        );
        expect(component.find('div').length).toBe(1);
        expect(component.find('div').text()).toBe('my_first_value');
        expect(component.find('span').length).toBe(0);

        // Inline? Use a span!
        component = getComponent(
            [{
                key: 'my_var_1',
                value: 'my_first_value'
            }],
            undefined,
            true
        );
        expect(component.find('div').length).toBe(0);
        expect(component.find('span').length).toBe(1);
        expect(component.find('span').text()).toBe('my_first_value');
    });

    describe('when there is a formatter it calls the appropriate filter', function () {
        it('sends a single String parameter if there is only one variable', function () {
            getComponent(
                [{
                    key: 'my_var_1',
                    value: 'my_first_value'
                }],
                'singleParamFormatter',
                false
            );
            expect(singleParamFormatterFilter).toHaveBeenCalledWith('my_first_value');
        });

        it('sends all variables as an Object if there is more than one variable', function () {
            getComponent(
                [{
                    key: 'my_var_1',
                    value: 'my_first_value'
                }, {
                    key: 'my_var_2',
                    value: 'my_second_value'
                }],
                'doubleParamFormatter',
                false
            );
            expect(doubleParamFormatterFilter).toHaveBeenCalledWith(jasmine.objectContaining({
                my_var_1: 'my_first_value',
                my_var_2: 'my_second_value'
            }));
        });
    });
});
