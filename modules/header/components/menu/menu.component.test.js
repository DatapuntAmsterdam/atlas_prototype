describe('The dp-menu component', () => {
    let $compile,
        $rootScope,
        store,
        authenticator,
        user,
        mockedActions;

    beforeEach(() => {
        mockedActions = {
            SHOW_PAGE: {
                id: 'SHOW_PAGE'
            }
        };

        angular.mock.module(
            'dpHeader',
            {
                store: {
                    dispatch: angular.noop
                }
            },
            $provide => {
                $provide.constant('ACTIONS', mockedActions);
                $provide.factory('dpMenuDropdownDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _store_, _authenticator_, _user_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            authenticator = _authenticator_;
            user = _user_;
        });

        spyOn(store, 'dispatch');
    });

    function getComponent (size) {
        const element = document.createElement('dp-menu');
        element.setAttribute('size', 'size');
        element.setAttribute('has-print-button', true);

        const scope = $rootScope.$new();
        scope.size = size;

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    describe('not logged in', () => {
        let component;

        beforeEach(() => {
            spyOn(user, 'getUserType').and.returnValue('ANONYMOUS');
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
            spyOn(user, 'getUserType').and.returnValue('AUTHENTICATED');
        });

        it('doesn\'t show the login button', () => {
            spyOn(user, 'getName').and.returnValue('My username');
            const component = getComponent('tall');
            expect(component.find('.qa-menu__login').length).toBe(0);
        });

        it('shows the user menu', () => {
            const component = getComponent('tall');
            expect(component.find('.qa-menu__user-menu').length).toBe(1);
        });

        it('removes the domain name for a logged-in user', function () {
            spyOn(user, 'getName').and.returnValue('user@xyz.com');
            spyOn(user, 'getAuthorizationLevel').and.returnValue(user.AUTHORIZATION_LEVEL.EMPLOYEE);

            const component = getComponent('tall');

            expect(component.find('dp-menu-dropdown').eq(0).attr('title')).toBe('user');
        });

        it('can show that a user is a normal employee', function () {
            spyOn(user, 'getName').and.returnValue('user');
            spyOn(user, 'getAuthorizationLevel').and.returnValue(user.AUTHORIZATION_LEVEL.EMPLOYEE);

            const component = getComponent('tall');

            expect(component.find('dp-menu-dropdown').eq(0).attr('title')).toBe('user');
        });

        it('can show that a user is a bevoegd employee', function () {
            spyOn(user, 'getName').and.returnValue('user');
            spyOn(user, 'getAuthorizationLevel').and.returnValue(user.AUTHORIZATION_LEVEL.EMPLOYEE_PLUS);

            const component = getComponent('tall');

            expect(component.find('dp-menu-dropdown').eq(0).attr('title')).toBe('user (bevoegd)');
        });

        it('shortens the name in every possible way', () => {
            spyOn(user, 'getName').and.returnValue('longusername');
            spyOn(user, 'getAuthorizationLevel').and.returnValue(user.AUTHORIZATION_LEVEL.EMPLOYEE);

            const component = getComponent('tall');

            // Name too long; ellipsis
            expect(component.find('dp-menu-dropdown').eq(0).attr('title')).toBe('longusern...');

            // Name only one character too long; no ellipsis
            user.getName.and.returnValue('longuserna');
            $rootScope.$digest();
            expect(component.find('dp-menu-dropdown').eq(0).attr('title')).toBe('longuserna');

            // User bevoegd
            user.getAuthorizationLevel.and.returnValue(user.AUTHORIZATION_LEVEL.EMPLOYEE_PLUS);

            // Name too long; ellipsis
            $rootScope.$digest();
            expect(component.find('dp-menu-dropdown').eq(0).attr('title')).toBe('long...(bevoegd)');

            // Name only one character too long; no ellipsis
            user.getName.and.returnValue('longu');
            user.getAuthorizationLevel.and.returnValue(user.AUTHORIZATION_LEVEL.EMPLOYEE_PLUS);
            $rootScope.$digest();
            expect(component.find('dp-menu-dropdown').eq(0).attr('title')).toBe('longu (bevoegd)');
        });
    });

    describe('the login button', () => {
        let component;

        beforeEach(() => {
            spyOn(user, 'getUserType').and.returnValue('ANONYMOUS');
            spyOn(authenticator, 'login').and.returnValue(null);
            component = getComponent('tall');
        });

        it('calls the authenticator logon method', () => {
            component.find('.qa-menu__login').click();
            expect(authenticator.login).toHaveBeenCalledWith();
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
