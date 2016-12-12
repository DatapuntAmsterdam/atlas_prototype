describe('The dp-link component', function () {
    let $compile,
        $rootScope,
        ACTIONS,
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
                    },
                    IGNORE_ME: {
                        ignore: true
                    },
                    FOLLOW_ME: 'follow the url'
                });
            }
        );

        angular.mock.inject(function (_ACTIONS_, _$location_, _$compile_, _$rootScope_, _store_) {
            ACTIONS = _ACTIONS_;
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

    describe('The dp-link hyperlink', function () {
        let defaultPrevented = false;
        let event = {
            preventDefault: () => defaultPrevented = true
        };

        beforeEach(function () {
            defaultPrevented = false;
        });

        it('displays an action as a link with a click handler', function () {
            let component = getComponent('FOLLOW_ME', 'Follow the url');

            let hyperlink = component.find('a');
            expect(hyperlink.attr('ng-click')).toBe('go($event)');
        });

        it('treats a link as a button when its action should be ignored', function () {
            let component = getComponent('IGNORE_ME', 'Ignore me');

            component.isolateScope().go(event);

            expect(defaultPrevented).toBe(true);
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.IGNORE_ME,
                payload: 'Ignore me'
            });
        });

        it('follows the url when the action is not to be ignored', function () {
            let component = getComponent('FOLLOW_ME', 'Follow the url');

            component.isolateScope().go(event);

            expect(defaultPrevented).toBe(false);
            expect(store.dispatch).not.toHaveBeenCalled();
        });
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
