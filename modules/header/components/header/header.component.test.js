describe('The atlas-header component', function () {
    var $compile,
        $rootScope,
        user;

    beforeEach(function () {
        angular.mock.module(
            'atlasHeader',
            {
                store: {
                    dispatch: function () {}
                }
            },
            function ($provide) {
                $provide.factory('dpLinkDirective', function () {
                    return {};
                });

                $provide.factory('atlasMenuDropdownDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _user_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            user = _user_;
        });

        spyOn(user, 'logout');
    });

    function getComponent (query, isPrintMode) {
        var component,
            element,
            scope;

        element = document.createElement('atlas-header');
        element.setAttribute('query', query);
        element.setAttribute('is-print-mode', isPrintMode);

        scope = $rootScope.$new();
        scope.isPrintMode = isPrintMode;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('inserts the atlas-search component and passes down a query string', function () {
        var component;

        //Without a query
        component = getComponent('', false);
        expect(component.find('atlas-search')[0].getAttribute('query')).toBe('');

        //With a query
        component = getComponent('I_AM_A_FAKE_QUERY', false);
        expect(component.find('atlas-search')[0].getAttribute('query')).toBe('I_AM_A_FAKE_QUERY');
    });

    describe('user state', function () {
        it('when not logged in', function () {
            var component;

            spyOn(user, 'getStatus').and.returnValue({isLoggedIn: false});

            component = getComponent('', false);

            //Show the login button
            expect(component.find('.site-header__menu dp-link').length).toBe(1);
            expect(component.find('.site-header__menu dp-link').attr('type')).toBe('SHOW_PAGE');
            expect(component.find('.site-header__menu dp-link').attr('payload')).toBe('\'login\'');
            expect(component.find('.site-header__menu dp-link').attr('class-name')).toBe('site-header__menu__item');

            //Hide the logout button
            expect(component.find('.site-header__menu button.site-header__menu__item').length).toBe(0);
        });

        it('when logged in', function () {
            var component;

            spyOn(user, 'getStatus').and.returnValue({isLoggedIn: true});

            component = getComponent('', false);

            //Hide the login button
            expect(component.find('.site-header__menu dp-link').length).toBe(0);

            //Show the logout button
            expect(component.find('.site-header__menu button.site-header__menu__item').length).toBe(1);
        });
    });

    describe('with print mode enabled', function () {
        var component;

        beforeEach(function () {
            component = getComponent('', true);
        });

        it('doesn\'t show the search form', function () {
            expect(component.find('atlas-search').length).toBe(0);
        });

        it('doesn\'t show the login state', function () {
            expect(component.text().toLowerCase()).not.toContain('inloggen');
            expect(component.text().toLowerCase()).not.toContain('uitloggen');
        });

        it('doesn\'t show the dropdown menu', function () {
            expect(component.find('atlas-menu-dropdown').length).toBe(0);
        });

        it('shows a link to leave the print mode', function () {
            expect(component.text().toLowerCase()).toContain('verlaat printversie');
        });
    });

    describe('with print mode disabled', function () {
        var component;

        beforeEach(function () {
            component = getComponent('', false);
        });

        it('doesn\'t show the link to leave print mode', function () {
            expect(component.text().toLowerCase()).not.toContain('verlaat print versie');
        });
    });
});