describe('The dp-link component', function () {
    var $compile,
        $rootScope,
        store;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            {
                store: {
                    dispatch: angular.noop
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
        });
    });

    function getComponent (type, payload, className, hoverText) {
        var component,
            element,
            scope;

        element = document.createElement('dp-link');
        element.setAttribute('type', type);

        if (angular.isDefined(payload)) {
            element.setAttribute('payload', 'payload');
        }

        if (angular.isString(className)) {
            element.setAttribute('class-name', className);
            element.setAttribute('hover-text', hoverText);
        }

        scope = $rootScope.$new();
        scope.payload = payload;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('does a call to store.dispatch when clicked', function () {
        var component;

        spyOn(store, 'dispatch');

        // Scenario A
        component = getComponent('SHOW_PAGE', 'welkom');
        component.find('button')[0].click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'SHOW_PAGE',
            payload: 'welkom'
        });

        // Scenario B
        component = getComponent('MAP_PAN', [101, 102]);
        component.find('button')[0].click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'MAP_PAN',
            payload: [101, 102]
        });
    });

    it('has an optional payload', function () {
        var component;

        spyOn(store, 'dispatch');

        component = getComponent('SHOW_LAYER_SELECTION');
        component.find('button')[0].click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'SHOW_LAYER_SELECTION'
        });

        expect(store.dispatch).not.toHaveBeenCalledWith(jasmine.objectContaining({
            payload: undefined
        }));
    });

    describe('styling', function () {
        it('can be done with the class-name attribute', function () {
            var component = getComponent('SHOW_PAGE', 'welkom', 'my-class my-other-class');

            expect(component.find('button').length).toBe(1);

            expect(component.find('button').attr('class')).toContain('my-class');
            expect(component.find('button').attr('class')).toContain('my-other-class');

            expect(component.find('button').attr('class')).not.toContain('btn');
            expect(component.find('button').attr('class')).not.toContain('btn--link');
        });

        it('has a default styling of a regular link', function () {
            var component = getComponent('SHOW_PAGE', 'welkom');

            expect(component.find('button').length).toBe(1);
            expect(component.find('button').attr('class')).toContain('btn');
            expect(component.find('button').attr('class')).toContain('btn--link');
        });
    });

    describe('title attribute', function () {
        it('has a title attribute on its button element', function () {
            var component = getComponent('SHOW_PAGE', 'welkom');

            expect(component.find('button').length).toBe(1);
            expect(component.find('button').attr('title')).toBeDefined();
            expect(component.find('button').attr('title')).toBe('');
        });

        it('can set a title attribute on its button element', function () {
            var component = getComponent('SHOW_PAGE', 'welkom', 'some-class', 'hoverText');

            expect(component.find('button').length).toBe(1);
            expect(component.find('button').attr('title')).toBeDefined();
            expect(component.find('button').attr('title')).toBe('hoverText');
        });
    });
});
