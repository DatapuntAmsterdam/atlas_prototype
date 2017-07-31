describe('The dp-data-selection-formatter component', () => {
    let $compile,
        $rootScope,
        $httpBackend,
        singleParamFormatterFilter,
        doubleParamFormatterFilter;

    beforeEach(() => {
        angular.mock.module(
            'dpDataSelection',
            {
                makeBoldFormatterFilter: function (input) {
                    return '<strong>' + input + '</strong>';
                },
                singleParamFormatterFilter: jasmine.createSpy(),
                doubleParamFormatterFilter: jasmine.createSpy()
            }
        );

        angular.mock.inject(
            (
                _$compile_,
                _$rootScope_,
                _$httpBackend_,
                _singleParamFormatterFilter_,
                _doubleParamFormatterFilter_
            ) => {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $httpBackend = _$httpBackend_;
                singleParamFormatterFilter = _singleParamFormatterFilter_;
                doubleParamFormatterFilter = _doubleParamFormatterFilter_;
            }
        );
    });

    function getComponent (variables, formatter, useInline, template) {
        const element = document.createElement('dp-data-selection-formatter');
        element.setAttribute('variables', 'variables');

        if (angular.isString(formatter)) {
            element.setAttribute('formatter', formatter);
        }

        if (angular.isString(template)) {
            element.setAttribute('template', template);
        }

        element.setAttribute('use-inline', 'useInline');

        const scope = $rootScope.$new();
        scope.variables = variables;
        scope.useInline = useInline;
        scope.template = template;

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('returns all values separated by spaces if there is no formatter', () => {
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

    it('supports formatters with HTML output', () => {
        const component = getComponent(
            [{
                key: 'my_var_1',
                value: 'my_first_value'
            }],
            'makeBoldFormatter',
            false
        );
        expect(component.find('div strong').text()).toBe('my_first_value');
    });

    it('has a use-inline option that renders the formatted output in a span instead of a div', () => {
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

    it('sets a template path if a template is specified', () => {
        $httpBackend
            .whenGET('modules/data-selection/components/formatter/templates/templatePath.html')
            .respond(200, 'aap');

        getComponent(
            [{
                key: 'my_var_1',
                value: 'my_first_value'
            }],
            undefined,
            false,
            'templatePath'
        );
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('when there is a formatter it calls the appropriate filter', () => {
        it('sends a single String parameter if there is only one variable', () => {
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

        it('sends all variables as an Object if there is more than one variable', () => {
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
