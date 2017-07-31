describe('The dp-scrollable-content directive', () => {
    let $compile,
        $rootScope,
        scope,
        callbackFn,
        state,
        visibility;

    beforeEach(() => {
        angular.mock.module(
            'atlas',
            {
                store: {
                    subscribe: (fn) => {
                        callbackFn = fn;
                        callbackFn();
                    },
                    getState: () => {
                        return state;
                    }
                },
                dashboardColumns: {
                    determineVisibility: () => visibility
                }
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });

        state = {
            page: {
                name: ''
            }
        };

        visibility = {
            page: false,
            detail: false,
            searchResults: false,
            dataSelection: false
        };
    });

    function getDirective () {
        var directive,
            element,
            i,
            paragraph;

        element = document.createElement('div');
        element.setAttribute('dp-scrollable-content', '');
        element.setAttribute('style', 'height: 100px; overflow-y: scroll;');

        // Insert a lot of dummy content to enable scrolling
        for (i = 0; i < 100; i++) {
            paragraph = document.createElement('p');
            paragraph.innerText = 'I am a paragraph.';

            element.appendChild(paragraph);
        }

        scope = $rootScope.$new();

        directive = $compile(element)(scope);
        scope.$apply();

        document.body.appendChild(element);

        return directive;
    }

    it('resets the scrollTop property whenever the active component changes', () => {
        var directive;

        visibility.detail = true;

        directive = getDirective();
        expect(directive[0].scrollTop).toBe(0);

        // Now scroll down
        directive[0].scrollTop = 100;

        // Show another component
        visibility.detail = false;
        visibility.page = true;
        state.page.name = 'home';
        callbackFn();
        scope.$apply();

        // Make sure the scrollTop has been reset
        expect(directive[0].scrollTop).toBe(0);
    });

    it('resets the scrollTop property when navigating between pages', () => {
        var directive;

        visibility.page = true;
        state.page.name = 'home';

        // Open the 'home' page
        directive = getDirective();
        expect(directive[0].scrollTop).toBe(0);

        // Now scroll down
        directive[0].scrollTop = 100;

        // Open the 'about-us' page
        state.page.name = 'about-us';
        callbackFn();
        scope.$apply();

        // Make sure the scrollTop has been reset
        expect(directive[0].scrollTop).toBe(0);
    });

    it('resets the scrollTop property when nothing is visible', () => {
        var directive;

        visibility.page = true;
        state.page.name = 'home';

        // Open the 'home' page
        directive = getDirective();
        expect(directive[0].scrollTop).toBe(0);

        // Now scroll down
        directive[0].scrollTop = 100;

        // Close the page
        visibility.page = false;
        state.page.name = '';
        callbackFn();
        scope.$apply();

        // Make sure the scrollTop has been reset
        expect(directive[0].scrollTop).toBe(0);
    });

    it('doesn\'t reset the scrollTop property when nothing changes', () => {
        var directive;

        visibility.page = true;
        state.page.name = 'home';

        // Open the 'home' page
        directive = getDirective();
        expect(directive[0].scrollTop).toBe(0);

        // Now scroll down
        directive[0].scrollTop = 100;

        // Trigger a state change
        callbackFn();
        scope.$apply();

        // Make sure the scrollTop has not been reset
        expect(directive[0].scrollTop).toBe(100);
    });
});
