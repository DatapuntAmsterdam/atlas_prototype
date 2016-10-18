describe('The dp-menu-dropdown directive', function () {
    var $compile,
        $rootScope;

    beforeEach(function () {
        angular.mock.module(
            'dpHeader',
            function ($provide) {
                $provide.factory('dpPrintButtonDirective', function () {
                    return {};
                });

                $provide.factory('dpTerugmeldenButtonDirective', function () {
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

    function getDirective (options) {
        var directive,
            element,
            scope;

        element = document.createElement('dp-menu-dropdown');
        element.setAttribute('has-print-button', 'hasPrintButton');

        document.body.appendChild(element);

        scope = $rootScope.$new();
        scope.hasPrintButton = options.hasPrintButton;

        directive = $compile(element)(scope);
        scope.$apply();

        return directive;
    }

    it('should initialize with the dropdown closed', function () {
        var directive = getDirective({hasPrintButton: true});

        expect(directive.find('.menu-dropdown').length).toBe(0);
        expect(directive.find('dp-print-button').length).toBe(0);
        expect(directive.find('dp-terugmelden-button').length).toBe(0);
        expect(directive.find('dp-link').length).toBe(0);
    });

    it('should toggle the visibility of the menu items when you click menu button', function () {
        var directive = getDirective({hasPrintButton: true});

        // Click it once
        directive.find('.site-header__menu__item--toggle').eq(0).click();

        // It should be openend
        expect(directive.find('.menu-dropdown').length).toBe(1);
        expect(directive.find('dp-terugmelden-button').length).toBe(1);
        expect(directive.find('dp-link').length).toBe(2);

        // Click it again
        directive.find('.site-header__menu__item--toggle').eq(0).click();

        // It should be closed again
        expect(directive.find('.menu-dropdown').length).toBe(0);
        expect(directive.find('dp-print-button').length).toBe(0);
        expect(directive.find('dp-terugmelden-button').length).toBe(0);
        expect(directive.find('dp-link').length).toBe(0);
    });

    it('changes the styling of the toggle button depending on the state of the dropdown', function () {
        var directive = getDirective({hasPrintButton: true});

        // When closed
        expect(directive.find('.site-header__menu__item--toggle').attr('class'))
            .not.toContain('site-header__menu__item--toggle--active');

        // When openend
        directive.find('.site-header__menu__item--toggle').eq(0).click();

        expect(directive.find('.site-header__menu__item--toggle').attr('class'))
            .toContain('site-header__menu__item--toggle--active');
    });

    it('should hide the menu items if you click elsewhere on the page', function () {
        var directive = getDirective({hasPrintButton: true});

        // Open the dropdown
        directive.find('.site-header__menu__item--toggle').eq(0).click();
        expect(directive.find('.menu-dropdown').length).toBe(1);

        // Click anywhere but the toggle button
        angular.element(document.body).click();
        expect(directive.find('.menu-dropdown').length).toBe(0);
    });

    it('supports multiple, standalone, dropdown menu\'s on one page', function () {
        var directive1 = getDirective({hasPrintButton: true}),
            directive2 = getDirective({hasPrintButton: true});

        expect(directive1.find('.menu-dropdown').length).toBe(0);
        expect(directive2.find('.menu-dropdown').length).toBe(0);

        directive1.find('.site-header__menu__item--toggle').eq(0).click();
        expect(directive1.find('.menu-dropdown').length).toBe(1);
        expect(directive2.find('.menu-dropdown').length).toBe(0);

        directive2.find('.site-header__menu__item--toggle').eq(0).click();
        expect(directive1.find('.menu-dropdown').length).toBe(0);
        expect(directive2.find('.menu-dropdown').length).toBe(1);
    });

    it('has an option to show/hide the print button', function () {
        var directive;

        // With a print button
        directive = getDirective({hasPrintButton: true});
        directive.find('.site-header__menu__item--toggle').eq(0).click();
        expect(directive.find('.menu-dropdown').text()).toContain('Printversie');

        // Without a print button
        directive = getDirective({hasPrintButton: false});
        directive.find('.site-header__menu__item--toggle').eq(0).click();
        expect(directive.find('.menu-dropdown').text()).not.toContain('Printversie');
    });
});
