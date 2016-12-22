describe('The dp-link component', function () {
    let $compile,
        $rootScope,
        store,
        mockedReducer,
        mockedActions,
        mockedPayload,
        mockedState,
        mockedStateToUrl,
        mockedTargetState,
        mockedCurrentPath,
        mockedTargetPath;

    beforeEach(function () {
        mockedActions = {
            ACTION_WITH_LINK: {
                id: 'ACTION_WITH_LINK',
                isButton: false
            },
            ACTION_WITH_BUTTON: {
                id: 'ACTION_WITH_BUTTON',
                isButton: true
            },
            ACTION_WITHOUT_BUTTON_CONFIG: {
                id: 'ACTION_WITHOUT_BUTTON_CONFIG'
            }
        };

        angular.mock.module(
            'dpShared',
            {
                $location: {
                    url: function () {
                        return mockedCurrentPath;
                    }
                },
                store: {
                    dispatch: angular.noop
                },
                applicationState: {
                    getReducer: () => {
                        return mockedReducer;
                    },
                    getStateToUrl: () => {
                        return mockedStateToUrl;
                    },
                    getStore: () => {
                        return {
                            getState: () => {
                                return mockedState;
                            }
                        };
                    }
                }
            },
            $provide => {
                $provide.constant('ACTIONS', mockedActions);
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _$location_, _store_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
        });

        mockedPayload = {
            lalalala: true,
            numberOfLas: 4
        };

        mockedReducer = jasmine.createSpy('reducer');

        mockedStateToUrl = {
            create: () => {
                return mockedTargetPath;
            }
        };

        mockedCurrentPath = 'this=that'; // Angular's $location.url() returns everything after the hash
        mockedTargetPath = 'this=something-else';

        spyOn(store, 'dispatch');

        spyOn(mockedStateToUrl, 'create').and.returnValue(mockedTargetPath);
    });

    function getComponent (className, hoverText, type, payload) {
        let component,
            element,
            scope;

        element = document.createElement('dp-link');
        element.setAttribute('type', type);

        scope = $rootScope.$new();

        if (angular.isDefined(payload)) {
            element.setAttribute('payload', 'payload');
            scope.payload = payload;
        }

        if (angular.isString(className)) {
            element.setAttribute('class-name', className);
        }

        if (angular.isString(hoverText)) {
            element.setAttribute('hover-text', hoverText);
        }

        element.innerText = 'Transcluded text';

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('depending on the specified type (ACTION) a button or link is shown', function () {
        let component;

        // When using ACTION_WITH_LINK
        component = getComponent(null, null, 'ACTION_WITH_LINK', mockedPayload);
        expect(component.find('a').length).toBe(1);
        expect(component.find('button').length).toBe(0);

        // When using ACTION_WITH_BUTTON
        component = getComponent(null, null, 'ACTION_WITH_BUTTON', mockedPayload);
        expect(component.find('button').length).toBe(1);
        expect(component.find('a').length).toBe(0);
    });

    it('shows a button when there is no isButton variabele present for this ACTION', function () {
        let component;

        // When using ACTION_WITH_LINK
        component = getComponent(null, null, 'ACTION_WITHOUT_BUTTON_CONFIG', mockedPayload);
        expect(component.find('a').length).toBe(1);
        expect(component.find('button').length).toBe(0);
    });

    it('a button is always used when linking to the current page, regardless of the ACTION configuration', function () {
        let component;

        mockedCurrentPath = 'this=something-else';
        component = getComponent(null, null, 'ACTION_WITH_LINK', mockedPayload);

        expect(component.find('button').length).toBe(1);
        expect(component.find('a').length).toBe(0);
    });

    it('can have a custom className', function () {
        let component;

        // A link with a custom class
        component = getComponent('my-special-class', null, 'ACTION_WITH_LINK', mockedPayload);
        expect(component.find('a').attr('class')).toContain('my-special-class');

        // A button with a custom class
        component = getComponent('my-special-class', null, 'ACTION_WITH_BUTTON', mockedPayload);
        expect(component.find('button').attr('class')).toContain('my-special-class');
    });

    it('has a default fallback class if no className is specified', function () {
        let component;

        // A link with the default class
        component = getComponent(null, null, 'ACTION_WITH_LINK', mockedPayload);
        expect(component.find('a').attr('class')).toContain('o-btn o-btn--link');

        // A button with the default class
        component = getComponent(null, null, 'ACTION_WITH_BUTTON', mockedPayload);
        expect(component.find('button').attr('class')).toContain('o-btn o-btn--link');
    });

    it('has an optional hover text (title attribute)', function () {
        let component;

        // A link with hover text
        component = getComponent(null, 'Look at me!', 'ACTION_WITH_LINK', mockedPayload);
        expect(component.find('a').attr('title')).toContain('Look at me!');

        // A button with hover text
        component = getComponent(null, 'Woohoo!', 'ACTION_WITH_BUTTON', mockedPayload);
        expect(component.find('button').attr('title')).toContain('Woohoo!');
    });

    it('clicking the button will trigger a call to store.dispatch', function () {
        let component;

        // A dispatch with a payload
        component = getComponent(null, null, 'ACTION_WITH_BUTTON', mockedPayload);
        component.find('button').click();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: mockedActions.ACTION_WITH_BUTTON,
            payload: mockedPayload
        });

        // A dispatch without a payload
        component = getComponent(null, null, 'ACTION_WITH_BUTTON');
        component.find('button').click();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: mockedActions.ACTION_WITH_BUTTON
        });
    });

    it('sets the href attribute for actions with a link', function () {
        let component = getComponent(null, null, 'ACTION_WITH_LINK', mockedPayload);

        expect(component.find('a').attr('href')).toBe(mockedTargetPath);
    });

    it('clicking the link will follow the href, it won\'t trigger a store.dispatch', function () {
        let component;

        component = getComponent(null, null, 'ACTION_WITH_LINK', mockedPayload);
        component.find('a').click();
        expect(store.dispatch).not.toHaveBeenCalled();

        // The value for the href attribute is composed by several injected dependencies, making sure these are used
        expect(mockedReducer).toHaveBeenCalledWith(
            mockedState,
            {
                type: mockedActions.ACTION_WITH_LINK,
                payload: mockedPayload
            }
        );
        expect(mockedStateToUrl.create).toHaveBeenCalledWith(mockedTargetState);
    });

    it('transcludes content without adding whitespace', function () {
        let component;

        // A link with transcluded content
        component = getComponent(null, null, 'ACTION_WITH_LINK', mockedPayload);
        expect(component.find('a').text()).toBe('Transcluded text');

        // A button with transcluded content
        component = getComponent(null, null, 'ACTION_WITH_BUTTON', mockedPayload);
        expect(component.find('button').text()).toBe('Transcluded text');
    });
});
