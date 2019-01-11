describe('The dp-logout-button component', function () {
    var $compile,
        $rootScope,
        store,
        $window,
        origAuth;

    beforeEach(function () {
        angular.mock.module(
            'dpHeader',
            {
                store: {
                    dispatch: angular.noop
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _$window_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            $window = _$window_;
        });

        origAuth = $window.auth;
        $window.auth = {
            logout: angular.noop
        };

        spyOn(store, 'dispatch');
    });

    afterEach(() => {
        $window.auth = origAuth;
    });

    function getComponent () {
        var component,
            element,
            scope;

        element = document.createElement('dp-logout-button');

        scope = $rootScope.$new();
        component = $compile(element)(scope);
        scope.$digest();

        return component;
    }

    it('logs the user out when clicking the button', function () {
        var component;

        spyOn($window.auth, 'logout');

        component = getComponent();
        component.find('button').click();

        expect($window.auth.logout).toHaveBeenCalled();
    });
});
