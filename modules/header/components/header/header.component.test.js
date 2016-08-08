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

    function getComponent (query) {
        var component,
            element,
            scope;

        element = document.createElement('atlas-header');
        element.setAttribute('query', query);

        scope = $rootScope.$new();

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('inserts the atlas-search component and passes down a query string', function () {
        var component;

        //Without a query
        component = getComponent('');
        expect(component.find('atlas-search')[0].getAttribute('query')).toBe('');

        //With a query
        component = getComponent('I_AM_A_FAKE_QUERY');
        expect(component.find('atlas-search')[0].getAttribute('query')).toBe('I_AM_A_FAKE_QUERY');
    });

    describe('user state', function () {
        it('when not logged in', function () {
            var component;

            spyOn(user, 'getStatus').and.returnValue({isLoggedIn: false});

            component = getComponent('');

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

            component = getComponent('');

            //Hide the login button
            expect(component.find('.site-header__menu dp-link').length).toBe(0);

            //Show the logout button
            expect(component.find('.site-header__menu button.site-header__menu__item').length).toBe(1);
        });
    });
});