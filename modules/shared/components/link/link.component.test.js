describe('The dp-link component', function () {
    let $compile,
        $rootScope,
        $location,
        store,
        updateFn,
        reducer = {
            fn: angular.noop
        },
        stateToUrl = {
            create: angular.noop
        },
        applicationState = {
            getReducer: () => reducer.fn,
            getStateToUrl: () => stateToUrl
        },
        unsubscribe = {
            unsubscribe: angular.noop
        },
        debounce = {
            debounce: (time, fn) => {
                let debounced = () => {
                    fn();
                };

                debounced.cancel = debounce.cancel;
                return debounced;
            },
            cancel: angular.noop
        },
        body = {
            contains: angular.noop
        };

    beforeEach(function () {
        spyOn(reducer, 'fn');
        spyOn(debounce, 'debounce').and.callThrough();
        spyOn(debounce, 'cancel');
        spyOn(unsubscribe, 'unsubscribe');

        angular.mock.module(
            'dpShared',
            {
                store: {
                    subscribe: fn => {
                        updateFn = fn;
                        return unsubscribe.unsubscribe;
                    },
                    dispatch: angular.noop,
                    getState: angular.noop
                },
                applicationState,
                stateToUrl,
                debounce: debounce.debounce
            }, $provide => {
                $provide.constant('ACTIONS', {
                    SHOW_PAGE: 'show-page',
                    MAP_PAN: 'map-pan',
                    SHOW_LAYER_SELECTION: 'show-layer-selection',
                    IS_BUTTON: {
                        isButton: true
                    }
                });
            }
        );

        angular.mock.inject(function (_$location_, _$compile_, _$rootScope_, _store_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $location = _$location_;
            store = _store_;
        });

        spyOn(store, 'subscribe').and.callThrough();
        spyOn(store, 'getState');
        spyOn(store, 'dispatch');
        spyOn(stateToUrl, 'create');
        spyOn(body, 'contains').and.returnValue(true);
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

    it('subscribes to the store', function () {
        getComponent('SHOW_PAGE', 'welkom');
        expect(store.subscribe).toHaveBeenCalled();
        expect(angular.isFunction(updateFn)).toBe(true);
    });

    it('can be a button', function () {
        let component = getComponent('IS_BUTTON', 'payload', 'className', 'hoverText');

        expect(store.subscribe).not.toHaveBeenCalled();
        expect(component.find('a').length).toBe(0);

        let button = component.find('button');
        expect(button.length).toBe(1);
        expect(button.attr('title')).toBe('hoverText');
        expect(button.attr('class')).toBe('className');

        let srOnly = component.find('button .u-sr-only');
        expect(srOnly.text()).toBe('hoverText');

        button.click();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: {
                isButton: true
            },
            payload: 'payload'
        });
    });

    it('is always a button when the href url is equal to the current url', function () {
        const url = '#123';

        stateToUrl.create.and.returnValue(url);
        spyOn($location, 'absUrl').and.returnValue(url);

        let component = getComponent('SHOW_PAGE', 'welkom');

        expect(component.find('a').length).toBe(0);
        expect(component.find('button').length).toBe(1);
    });

    describe('update', () => {
        it('gets the state from the store', () => {
            getComponent('SHOW_PAGE', 'welkom');
            expect(store.getState).toHaveBeenCalled();
        });

        it('calls the reducer based on type and payload', () => {
            const state = { key: 'value' };

            store.getState.and.returnValue(state);

            // Scenario A
            getComponent('SHOW_PAGE', 'welkom');
            expect(reducer.fn).toHaveBeenCalledWith(state, {
                type: 'show-page',
                payload: 'welkom'
            });

            // Scenario B
            getComponent('MAP_PAN', [101, 102]);
            expect(reducer.fn).toHaveBeenCalledWith(state, {
                type: 'map-pan',
                payload: [101, 102]
            });
        });

        it('allows the payload to be optional', function () {
            const state = { key: 'value' };

            store.getState.and.returnValue(state);

            getComponent('SHOW_LAYER_SELECTION');
            expect(reducer.fn).toHaveBeenCalledWith(state, {
                type: 'show-layer-selection'
            });

            expect(reducer.fn).not.toHaveBeenCalledWith(state, jasmine.objectContaining({
                payload: undefined
            }));
        });

        it('creates the url based on the new state', () => {
            const state = { key: 'value' };

            reducer.fn.and.returnValue(state);

            getComponent('SHOW_PAGE', 'welkom');
            expect(stateToUrl.create).toHaveBeenCalledWith(state);
        });

        it('sets href attribute on the link to a url based on a reduced state', () => {
            const url = 'http://reduced-state.amsterdam.nl';
            let component;

            stateToUrl.create.and.returnValue(url);

            component = getComponent('SHOW_PAGE', 'welkom');
            expect(component.find('a').attr('href')).toBe(url);
        });

        it('updates the href attribute on the link when the state changes', () => {
            const oldUrl = 'http://reduced-state.amsterdam.nl';
            const newUrl = 'http://new-reduced-state.amsterdam.nl';
            let component;

            stateToUrl.create.and.returnValue(oldUrl);

            component = getComponent('SHOW_PAGE', 'welkom');

            stateToUrl.create.and.returnValue(newUrl);

            updateFn();
            $rootScope.$apply();
            expect(component.find('a').attr('href')).toBe(newUrl);
        });

        it('does not update after the element has been destroyed', () => {
            const oldUrl = 'http://reduced-state.amsterdam.nl';
            const newUrl = 'http://new-reduced-state.amsterdam.nl';
            let component;

            stateToUrl.create.and.returnValue(oldUrl);

            component = getComponent('SHOW_PAGE', 'welkom');

            stateToUrl.create.and.returnValue(newUrl);

            component.triggerHandler({type: '$destroy'});

            $rootScope.$apply();

            expect(debounce.cancel).toHaveBeenCalled();
            expect(unsubscribe.unsubscribe).toHaveBeenCalled();
            expect(component.find('a').attr('href')).toBe(oldUrl);
        });
    });

    describe('styling', function () {
        it('can be done with the class-name attribute', function () {
            var component = getComponent('SHOW_PAGE', 'welkom', 'my-class my-other-class');

            expect(component.find('a').length).toBe(1);

            expect(component.find('a').attr('class')).toContain('my-class');
            expect(component.find('a').attr('class')).toContain('my-other-class');

            expect(component.find('a').attr('class')).not.toContain('btn');
            expect(component.find('a').attr('class')).not.toContain('btn--link');
        });

        it('has a default styling of a regular link', function () {
            var component = getComponent('SHOW_PAGE', 'welkom');

            expect(component.find('a').length).toBe(1);
            expect(component.find('a').attr('class')).toContain('btn');
            expect(component.find('a').attr('class')).toContain('btn--link');
        });
    });

    describe('title attribute', function () {
        it('has a title attribute on its button element', function () {
            var component = getComponent('SHOW_PAGE', 'welkom');

            expect(component.find('a').length).toBe(1);
            expect(component.find('a').attr('title')).toBeDefined();
            expect(component.find('a').attr('title')).toBe('');
        });

        it('can set a title attribute on its button element', function () {
            var component = getComponent('SHOW_PAGE', 'welkom', 'some-class', 'hoverText');

            expect(component.find('a').length).toBe(1);
            expect(component.find('a').attr('title')).toBeDefined();
            expect(component.find('a').attr('title')).toBe('hoverText');
        });
    });
});
