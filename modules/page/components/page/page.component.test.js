describe('The page component', function () {
    var $compile,
        $rootScope,
        $templateCache;

    beforeEach(function () {
        angular.mock.module('atlasPage');

        angular.mock.inject(function (_$compile_, _$rootScope_, _$templateCache_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $templateCache = _$templateCache_;
        });

        $templateCache.put('modules/page/components/page/templates/welcome.html', 'THIS_IS_WELCOME');
        $templateCache.put('modules/page/components/page/templates/about.html', 'THIS_IS_ABOUT');
    });

    function getComponent (name) {
        var component,
            element,
            scope;

        element = document.createElement('atlas-page');
        element.setAttribute('name', name);

        scope = $rootScope.$new();

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('loads an HTML page based on the name binding', function () {
        var component;

        // Welcome page
        component = getComponent('welcome');
        expect(component.text()).toContain('THIS_IS_WELCOME');

        // About page
        component = getComponent('about');
        expect(component.text()).toContain('THIS_IS_ABOUT');
    });
});
