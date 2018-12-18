import { AUTHENTICATE_USER_ERROR } from '../../../../src/shared/ducks/user/user';

describe('The dp-menu component', () => {
    let $compile,
        $rootScope,
        store,
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
            },
            $provide => {
                $provide.factory('dpMenuDropdownDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _store_, _$window_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
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

        spyOn(store, 'dispatch');
    });

    afterEach(() => {
        $window.auth = origAuth;
    });

    function getComponent (size) {
        const element = document.createElement('dp-menu');
        element.setAttribute('user', 'user');
        element.setAttribute('size', 'size');
        element.setAttribute('has-print-button', true);
        element.setAttribute('has-embed-button', true);

        const scope = $rootScope.$new();
        scope.user = mockedUser;
        scope.size = size;

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    describe('not logged in', () => {
        let component;

        beforeEach(() => {
            component = getComponent('tall');
        });

        it('shows the login button', () => {
            expect(component.find('.qa-menu__login').length).toBe(1);
        });

        it('doesn\'t show the user menu', () => {
            expect(component.find('.qa-menu__user-menu').length).toBe(0);
        });
    });

    describe('logged in', () => {
        beforeEach(() => {
            mockedUser.authenticated = true;
            mockedUser.name = 'user';
        });

        it('doesn\'t show the login button', () => {
            const component = getComponent('tall');
            expect(component.find('.qa-menu__login').length).toBe(0);
        });

        it('shows the user menu', () => {
            const component = getComponent('tall');
            expect(component.find('.qa-menu__user-menu').length).toBe(1);
        });

        it('removes the domain name for a logged-in user', function () {
            mockedUser.name = 'user@xyz.com';

            const component = getComponent('tall');

            expect(component.find('dp-menu-dropdown').eq(0).attr('title')).toBe('user');
        });

        it('can show that a user is a normal employee', function () {
            const component = getComponent('tall');

            expect(component.find('dp-menu-dropdown').eq(0).attr('title')).toBe('user');
        });

        it('shortens the name in every possible way', () => {
            mockedUser.name = 'longusername';

            const component = getComponent('tall');

            // Name too long; ellipsis
            expect(component.find('dp-menu-dropdown').eq(0).attr('title')).toBe('longusern...');

            // Name only one character too long; no ellipsis
            mockedUser.name = 'longuserna';
            $rootScope.$digest();
            expect(component.find('dp-menu-dropdown').eq(0).attr('title')).toBe('longuserna');
        });
    });

    describe('the login button', () => {
        let component;

        beforeEach(() => {
            spyOn($window.auth, 'login').and.returnValue(null);
            component = getComponent('tall');
        });

        it('calls the auth login method', () => {
            component.find('.qa-menu__login').click();
            expect($window.auth.login).toHaveBeenCalledWith();
        });
    });

    describe('the login button with failing auth', () => {
        let component;

        beforeEach(() => {
            spyOn($window.auth, 'login').and.throwError();
            component = getComponent('tall');
        });

        it('calls the auth login method', () => {
            component.find('.qa-menu__login').click();
            expect(store.dispatch).toHaveBeenCalledWith({ type: AUTHENTICATE_USER_ERROR });
        });
    });

    describe('size tall', () => {
        let component;

        beforeEach(() => {
            component = getComponent('tall');
        });

        it('has the tall modifier on the root element', () => {
            expect(component.find('.qa-menu').prop('class')).not.toContain('c-menu--short');
            expect(component.find('.qa-menu').prop('class')).toContain('c-menu--tall');
        });
    });

    describe('size short', () => {
        let component;

        beforeEach(() => {
            component = getComponent('short');
        });

        it('has the short modifier on the root element', () => {
            expect(component.find('.qa-menu').prop('class')).toContain('c-menu--short');
            expect(component.find('.qa-menu').prop('class')).not.toContain('c-menu--tall');
        });
    });
});
