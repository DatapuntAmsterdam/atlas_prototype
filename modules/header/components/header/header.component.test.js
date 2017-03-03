describe('The dp-header component', function () {
    var $compile,
        $rootScope,
        authenticator,
        user;

    beforeEach(function () {
        angular.mock.module(
            'dpHeader',
            {
                store: {
                    dispatch: function () {}
                }
            },
            function ($provide) {
                $provide.factory('dpLinkDirective', function () {
                    return {};
                });

                $provide.factory('dpMenuDropdownDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _authenticator_, _user_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            authenticator = _authenticator_;
            user = _user_;
        });

        spyOn(authenticator, 'logout');
    });

    function getComponent (query, isPrintMode) {
        var component,
            element,
            scope;

        element = document.createElement('dp-header');
        element.setAttribute('query', query);
        element.setAttribute('has-print-button', 'hasPrintButton');
        element.setAttribute('is-print-mode', isPrintMode);

        scope = $rootScope.$new();
        scope.hasPrintButton = true;
        scope.isPrintMode = isPrintMode;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('inserts the dp-search component and passes down a query string', function () {
        var component;

        // Without a query
        component = getComponent('', false);
        expect(component.find('dp-search')[0].getAttribute('query')).toBe('');

        // With a query
        component = getComponent('I_AM_A_FAKE_QUERY', false);
        expect(component.find('dp-search')[0].getAttribute('query')).toBe('I_AM_A_FAKE_QUERY');
    });

    describe('user state', function () {
        it('when not logged in', function () {
            var component;

            spyOn(user, 'getUserType').and.returnValue('ANONYMOUS');

            component = getComponent('', false);

            expect(component.find('.qa-header__login').length).toBe(1);
            expect(component.find('.qa-header__logout').length).toBe(0);
        });

        it('when logged in', function () {
            var component;

            spyOn(user, 'getUserType').and.returnValue('AUTHENTICATED');

            component = getComponent('', false);

            expect(component.find('.qa-header__login').length).toBe(0);
            expect(component.find('.qa-header__logout').length).toBe(1);
        });
    });

    describe('with print mode enabled', function () {
        var component;

        beforeEach(function () {
            component = getComponent('', true);
        });

        it('doesn\'t show the search form', function () {
            expect(component.find('dp-search').length).toBe(0);
        });

        it('doesn\'t show the login state', function () {
            expect(component.text().toLowerCase()).not.toContain('inloggen');
            expect(component.text().toLowerCase()).not.toContain('uitloggen');
        });

        it('doesn\'t show the dropdown menu', function () {
            expect(component.find('dp-menu-dropdown').length).toBe(0);
        });

        it('shows a link to leave the print mode', function () {
            expect(component.find('.c-exit-print-mode').length).toBe(1);
        });
    });

    describe('with print mode disabled', function () {
        var component;

        beforeEach(function () {
            component = getComponent('', false);
        });

        it('doesn\'t show the link to leave print mode', function () {
            expect(component.find('.c-exit-print-mode').length).toBe(0);
        });
    });
});
