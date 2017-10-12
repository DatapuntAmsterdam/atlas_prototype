describe('The dp-site-header component', () => {
    let $compile,
        $rootScope,
        $window,
        origAuth,
        mockedUser;

    beforeEach(() => {
        angular.mock.module(
            'dpHeader',
            {
                store: {
                    dispatch: angular.noop
                }
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _$window_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $window = _$window_;
        });

        origAuth = $window.auth;
        $window.auth = {
            login: angular.noop
        };

        mockedUser = {
            authenticated: false,
            scopes: [],
            name: ''
        };
    });

    afterEach(() => {
        $window.auth = origAuth;
    });

    function getComponent (query, size) {
        const element = document.createElement('dp-site-header');
        element.setAttribute('query', query);
        element.setAttribute('has-print-button', true);
        element.setAttribute('has-embed-button', true);
        element.setAttribute('size', 'size');
        element.setAttribute('user', 'user');

        const scope = $rootScope.$new();
        scope.size = size;
        scope.user = mockedUser;

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('inserts the dp-search component and passes down a query string', () => {
        let component;

        // Without a query
        component = getComponent('', 'short');
        expect(component.find('dp-search')[0].getAttribute('query')).toBe('');

        // With a query
        component = getComponent('I_AM_A_FAKE_QUERY', 'short');
        expect(component.find('dp-search')[0].getAttribute('query')).toBe('I_AM_A_FAKE_QUERY');

        // Tall version
        // Without a query
        component = getComponent('', 'tall');
        expect(component.find('dp-search')[0].getAttribute('query')).toBe('');

        // With a query
        component = getComponent('I_AM_A_FAKE_QUERY', 'tall');
        expect(component.find('dp-search')[0].getAttribute('query')).toBe('I_AM_A_FAKE_QUERY');
    });

    describe('the short version', () => {
        let component;

        beforeEach(() => {
            component = getComponent('', 'short');
        });

        it('has the short modifier on the header', () => {
            expect(component.find('.qa-site-header')[0].getAttribute('class'))
                .toContain('c-site-header--short');
            expect(component.find('.qa-site-header')[0].getAttribute('class'))
                .not.toContain('c-site-header--tall');
        });

        it('has the logo 3 wide', () => {
            expect(component.find('.qa-site-header__logo-col')[0].getAttribute('class'))
                .toContain('u-col-sm--3');
        });

        it('doesn\'t have a toolbar', () => {
            expect(component.find('.qa-site-header__toolbar').length).toBe(0);
        });

        it('defines search only once, without modifier', () => {
            expect(component.find('.qa-site-header__search').length).toBe(1);
        });

        it('defines the menu only once, 3 wide, without modifier', () => {
            expect(component.find('.qa-site-header__menu-col').length).toBe(1);
            expect(component.find('.qa-site-header__menu').length).toBe(1);
            expect(component.find('.qa-site-header__menu-col')[0].getAttribute('class'))
                .toContain('u-col-sm--3');
        });

        it('doesn\'t have a contact link', () => {
            expect(component.find('.qa-site-header__contact').length).toBe(0);
        });
    });

    describe('the tall version', () => {
        let component;

        beforeEach(() => {
            component = getComponent('', 'tall');
        });

        it('has the tall modifier on the header', () => {
            expect(component.find('.qa-site-header')[0].getAttribute('class'))
                .not.toContain('c-site-header--short');
            expect(component.find('.qa-site-header')[0].getAttribute('class'))
                .toContain('c-site-header--tall');
        });

        it('has the logo 6 wide', () => {
            expect(component.find('.qa-site-header__logo-col')[0].getAttribute('class'))
                .toContain('u-col-sm--6');
        });

        it('has a toolbar', () => {
            expect(component.find('.qa-site-header__toolbar').length).toBe(1);
        });

        it('defines search only once, with a modifier', () => {
            expect(component.find('.qa-site-header__search').length).toBe(1);
        });

        it('defines the menu only once, 6 wide, with a modifier', () => {
            expect(component.find('.qa-site-header__menu-col').length).toBe(1);
            expect(component.find('.qa-site-header__menu').length).toBe(1);
            expect(component.find('.qa-site-header__menu-col')[0].getAttribute('class'))
                .toContain('u-col-sm--6');
        });

        it('has a contact link', () => {
            expect(component.find('.qa-site-header__contact').length).toBe(1);
        });
    });
});
