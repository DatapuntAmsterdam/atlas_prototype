describe('The dp-login-form component', function () {
    var $compile,
        $rootScope,
        $q,
        $window,
        user,
        isLoggedIn;

    beforeEach(function () {
        angular.mock.module(
            'dpPage',
            {
                user: {
                    login: function (username, password) {
                        var q = $q.defer();

                        if (username === 'Erik' && password === 'myinsecurepwd') {
                            isLoggedIn = true;

                            q.resolve();
                        } else {
                            q.reject('I_AM_AN_ERROR_MESSAGE');
                        }

                        return q.promise;
                    },
                    getStatus: function () {
                        return {
                            isLoggedIn: isLoggedIn
                        };
                    }
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _$q_, _$window_, _user_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            $window = _$window_;
            user = _user_;
        });

        isLoggedIn = false;

        spyOn(user, 'login').and.callThrough();
    });

    function getComponent () {
        var component,
            element,
            scope;

        element = document.createElement('dp-login-form');
        scope = $rootScope.$new();

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    function setInput (element, text) {
        element.value = text;

        element.dispatchEvent(new Event('input'));
    }

    it('shows the login form with required fields when the user is not logged in', function () {
        var component = getComponent();

        expect(component.find('form').length).toBe(1);
        expect(component.find('form input[type="text"][required]').length).toBe(1);
        expect(component.find('form input[type="password"][required]').length).toBe(1);
        expect(component.find('form button[type="submit"]').length).toBe(1);
    });

    describe('when submitting the login form', function () {
        it('can succeed', function () {
            var component = getComponent();

            setInput(component.find('input[type="text"]')[0], 'Erik');
            setInput(component.find('input[type="password"]')[0], 'myinsecurepwd');

            spyOn($window.history, 'back');
            component.find('form').submit();

            expect(user.login).toHaveBeenCalledWith('Erik', 'myinsecurepwd');

            // Redirect to the previous page
            expect($window.history.back).toHaveBeenCalled();
        });

        it('can fail', function () {
            var component = getComponent();

            setInput(component.find('input[type="text"]')[0], 'Erik');
            setInput(component.find('input[type="password"]')[0], 'incorrect_password');

            component.find('form').submit();

            expect(user.login).toHaveBeenCalledWith('Erik', 'incorrect_password');

            // The form is still visible
            expect(component.find('form').length).toBe(1);

            // An error message is shown
            expect(component.find('.qa-error-message').text()).toContain('I_AM_AN_ERROR_MESSAGE');
        });
    });
});
