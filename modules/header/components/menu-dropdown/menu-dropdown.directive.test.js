describe('The atlas-menu-dropdown directive', function () {
    var $compile,
        $rootScope;

    beforeEach(function(){
        angular.mock.module(
            'atlasHeader',
            function ($provide) {
                $provide.factory('AtlasPrintButtonDirective', function () {
                    return {};
                });

                $provide.factory('AtlasTerugmeldenButtonDirective', function () {
                    return {};
                });

                $provide.factory('dpLinkDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getDirective () {
        var directive,
            element,
            scope;

        element = document.createElement('atlas-menu-dropdown');
        document.body.appendChild(element);

        scope = $rootScope.$new();

        directive = $compile(element)(scope);
        scope.$apply();

        return directive;
    }

    it('should initialize with the dropdown closed', function () {
        var directive = getDirective();

        expect(directive.find('.menu-dropdown').length).toBe(0);
        expect(directive.find('atlas-print-button').length).toBe(0);
        expect(directive.find('atlas-terugmelden-button').length).toBe(0);
        expect(directive.find('dp-link').length).toBe(0);
    });

    it('should toggle the visibility of the menu items when you click menu button', function () {
        var directive = getDirective();

        //Click it once
        directive.find('.site-header__menu__item--toggle').eq(0).click();

        //It should be openend
        expect(directive.find('.menu-dropdown').length).toBe(1);
        expect(directive.find('atlas-print-button').length).toBe(1);
        expect(directive.find('atlas-terugmelden-button').length).toBe(1);
        expect(directive.find('dp-link').length).toBe(2);

        //Click it again
        directive.find('.site-header__menu__item--toggle').eq(0).click();

        //It should be closed again
        expect(directive.find('.menu-dropdown').length).toBe(0);
        expect(directive.find('atlas-print-button').length).toBe(0);
        expect(directive.find('atlas-terugmelden-button').length).toBe(0);
        expect(directive.find('dp-link').length).toBe(0);

    });

    it('changes the styling of the toggle button depending on the state of the dropdown', function () {
        var directive = getDirective();

        //When closed
        expect(directive.find('.site-header__menu__item--toggle').attr('class'))
            .not.toContain('site-header__menu__item--toggle--active');

        //When openend
        directive.find('.site-header__menu__item--toggle').eq(0).click();

        expect(directive.find('.site-header__menu__item--toggle').attr('class'))
            .toContain('site-header__menu__item--toggle--active');
    });

    it('should hide the menu items if you click elsewhere on the page', function () {
        var directive = getDirective('dropdown-menu');

        //Open the dropdown
        directive.find('.site-header__menu__item--toggle').eq(0).click();
        expect(directive.find('.menu-dropdown').length).toBe(1);

        //Click anywhere but the toggle button
        angular.element(document.body).click();
        expect(directive.find('.menu-dropdown').length).toBe(0);
    });

    it('supports multiple, standalone, dropdown menu\'s on one page', function () {
        var directive1 = getDirective('dropdown-menu'),
            directive2 = getDirective('menu');

        expect(directive1.find('.menu-dropdown').length).toBe(0);
        expect(directive2.find('.menu-dropdown').length).toBe(0);

        directive1.find('.site-header__menu__item--toggle').eq(0).click();
        expect(directive1.find('.menu-dropdown').length).toBe(1);
        expect(directive2.find('.menu-dropdown').length).toBe(0);

        directive2.find('.site-header__menu__item--toggle').eq(0).click();
        expect(directive1.find('.menu-dropdown').length).toBe(0);
        expect(directive2.find('.menu-dropdown').length).toBe(1);

    });
});