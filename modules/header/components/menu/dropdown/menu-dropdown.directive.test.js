describe('The dp-menu-dropdown directive', () => {
    let $compile,
        $rootScope,
        $window,
        origAuth,
        options;

    beforeEach(() => {
        angular.mock.module(
            'dpHeader',
            {
                store: {
                    dispatch: angular.noop
                }
            },
            ($provide) => {
                $provide.factory('dpPrintButtonDirective', () => {
                    return {};
                });

                $provide.factory('dpTerugmeldenButtonDirective', () => {
                    return {};
                });
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _$window_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $window = _$window_;
        });

        origAuth = $window.auth;
        $window.auth = {
            logout: angular.noop
        };

        options = {
            title: 'Menu',
            type: 'main',
            align: 'right',
            hasPrintButton: true,
            hasEmbedButton: true
        };
    });

    afterEach(() => {
        $window.auth = origAuth;
    });

    function getDirective (attrs) {
        const element = document.createElement('dp-menu-dropdown');
        element.setAttribute('title', attrs.title);
        element.setAttribute('type', attrs.type);
        if (attrs.align) {
            element.setAttribute('align', attrs.align);
        }
        element.setAttribute('has-print-button', attrs.hasPrintButton);
        element.setAttribute('has-embed-button', attrs.hasEmbedButton);

        document.body.appendChild(element);

        const scope = $rootScope.$new();

        const directive = $compile(element)(scope);
        scope.$apply();

        return directive;
    }

    it('should initialize with the dropdown closed', () => {
        const directive = getDirective(options);

        expect(directive.find('.qa-menu__dropdown').length).toBe(0);
        expect(directive.find('dp-print-button').length).toBe(0);
        expect(directive.find('dp-terugmelden-button').length).toBe(0);
        expect(directive.find('dp-link').length).toBe(0);
    });

    it('should toggle the visibility of the menu items when you click menu button', () => {
        const directive = getDirective(options);

        // Click it once
        directive.find('.qa-menu__toggle .qa-menu__link').eq(0).click();

        // print and  embed should be openend
        expect(directive.find('.qa-menu__dropdown').length).toBe(1);
        expect(directive.find('dp-terugmelden-button').length).toBe(1);
        expect(directive.find('dp-link').length).toBe(2);

        // Click it again
        directive.find('.qa-menu__toggle .qa-menu__link').eq(0).click();

        // It should be closed again
        expect(directive.find('.qa-menu__dropdown').length).toBe(0);
        expect(directive.find('dp-terugmelden-button').length).toBe(0);
        expect(directive.find('dp-link').length).toBe(0);
    });

    it('should also toggle when you click the title element inside the button', () => {
        const directive = getDirective(options);

        // Click it once
        directive.find('.qa-menu__title').eq(0).click();

        // print and  embed should be openend
        expect(directive.find('.qa-menu__dropdown').length).toBe(1);
        expect(directive.find('dp-terugmelden-button').length).toBe(1);
        expect(directive.find('dp-link').length).toBe(2);

        // Click it again
        directive.find('.qa-menu__title').eq(0).click();

        // It should be closed again
        expect(directive.find('.qa-menu__dropdown').length).toBe(0);
        expect(directive.find('dp-terugmelden-button').length).toBe(0);
        expect(directive.find('dp-link').length).toBe(0);
    });

    it('changes the styling of the toggle button depending on the state of the dropdown', () => {
        const directive = getDirective(options);

        // When closed
        expect(directive.find('.qa-menu__toggle').attr('class'))
            .not.toContain('c-menu__item--toggle--active');

        // When openend
        directive.find('.qa-menu__toggle .qa-menu__link').eq(0).click();

        expect(directive.find('.qa-menu__toggle').attr('class'))
            .toContain('c-menu__item--toggle--active');
    });

    it('should hide the menu items if you click elsewhere on the page', () => {
        const directive = getDirective(options);

        // Open the dropdown
        directive.find('.qa-menu__toggle .qa-menu__link').eq(0).click();
        expect(directive.find('.qa-menu__dropdown').length).toBe(1);

        // Click anywhere but the toggle button
        angular.element(document.body).click();
        expect(directive.find('.qa-menu__dropdown').length).toBe(0);
    });

    it('supports multiple, standalone, dropdown menu\'s on one page', () => {
        const directive1 = getDirective(options),
            directive2 = getDirective(options);

        expect(directive1.find('.qa-menu__dropdown').length).toBe(0);
        expect(directive2.find('.qa-menu__dropdown').length).toBe(0);

        directive1.find('.qa-menu__toggle .qa-menu__link').eq(0).click();
        expect(directive1.find('.qa-menu__dropdown').length).toBe(1);
        expect(directive2.find('.qa-menu__dropdown').length).toBe(0);

        directive2.find('.qa-menu__toggle .qa-menu__link').eq(0).click();
        expect(directive1.find('.qa-menu__dropdown').length).toBe(0);
        expect(directive2.find('.qa-menu__dropdown').length).toBe(1);
    });

    it('has an option to show/hide the print button', () => {
        let directive;

        // With a print button
        directive = getDirective(options);
        directive.find('.qa-menu__toggle .qa-menu__link').eq(0).click();
        expect(directive.find('.qa-menu__dropdown').text()).toContain('Printen');
        expect(directive.find('.qa-menu__dropdown').text()).toContain('Embedden');

        // Without a print button
        options.hasPrintButton = false;
        options.hasEmbedButton = false;
        directive = getDirective(options);
        directive.find('.qa-menu__toggle .qa-menu__link').eq(0).click();
        expect(directive.find('.qa-menu__dropdown').text()).not.toContain('Printen');
        expect(directive.find('.qa-menu__dropdown').text()).not.toContain('Embedden');
    });

    it('shows the menu item title specified', () => {
        let directive;

        directive = getDirective(options);
        expect(directive.find('.qa-menu__title').text().trim()).toBe(options.title);

        options.title = 'Different title';
        directive = getDirective(options);
        expect(directive.find('.qa-menu__title').text().trim()).toBe(options.title);
    });

    it('shows the user menu when type is user', () => {
        options.type = 'user';
        const directive = getDirective(options);

        // Click it once
        directive.find('.qa-menu__toggle .qa-menu__link').eq(0).click();

        // It should be openend
        expect(directive.find('.qa-menu__dropdown').length).toBe(1);
        expect(directive.find('dp-terugmelden-button').length).toBe(0);
        expect(directive.find('dp-logout-button').length).toBe(1);
        expect(directive.find('dp-link').length).toBe(0);

        // Click it again
        directive.find('.qa-menu__toggle .qa-menu__link').eq(0).click();

        // It should be closed again
        expect(directive.find('.qa-menu__dropdown').length).toBe(0);
        expect(directive.find('dp-terugmelden-button').length).toBe(0);
        expect(directive.find('dp-logout-button').length).toBe(0);
        expect(directive.find('dp-link').length).toBe(0);
    });

    it('aligns the dropdown', () => {
        let directive;

        // Align right
        directive = getDirective(options);
        directive.find('.qa-menu__toggle .qa-menu__link').eq(0).click();
        expect(directive.find('.qa-menu__dropdown').attr('class')).toContain('c-menu__dropdown--align-right');

        // Align left
        options.align = 'left';
        directive = getDirective(options);
        directive.find('.qa-menu__toggle .qa-menu__link').eq(0).click();
        expect(directive.find('.qa-menu__dropdown').attr('class')).toContain('c-menu__dropdown--align-left');

        // Align right by default
        delete options.align;
        directive = getDirective(options);
        directive.find('.qa-menu__toggle .qa-menu__link').eq(0).click();
        expect(directive.find('.qa-menu__dropdown').attr('class')).toContain('c-menu__dropdown--align-right');
    });
});
