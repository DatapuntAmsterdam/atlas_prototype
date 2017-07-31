describe('The dp-panel component', () => {
    var $compile,
        $rootScope;

    beforeEach(() => {
        angular.mock.module('dpShared');

        angular.mock.inject((_$compile_, _$rootScope_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getComponent (isPanelVisible, canClose, size, type, className) {
        var component,
            element,
            scope;

        element = document.createElement('dp-panel');
        element.setAttribute('is-panel-visible', 'isPanelVisible');

        if (angular.isDefined(canClose)) {
            element.setAttribute('can-close', 'canClose');
        }

        if (size) {
            element.setAttribute('size', size);
        }

        if (type) {
            element.setAttribute('type', type);
        }

        if (className) {
            element.setAttribute('class-name', className);
        }

        scope = $rootScope.$new();
        scope.isPanelVisible = isPanelVisible;
        scope.canClose = canClose;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    describe('Visability', () => {
        it('can be visible', () => {
            var component = getComponent(true);

            expect(component.find('div.c-panel').length).toBe(1);
        });

        it('can not be visible', () => {
            var component = getComponent(false);

            expect(component.find('div.c-panel').length).toBe(0);
        });
    });

    describe('close button', () => {
        it('does not have a close button by default', () => {
            var component = getComponent(true);

            expect(component.find('button.qa-btn-close').length).toBe(0);
        });

        it('has an optional close button', () => {
            var component = getComponent(true, true);

            expect(component.find('button.qa-btn-close').length).toBe(1);
        });

        it('closes the panel on click', () => {
            var component = getComponent(true, true);

            expect(component.find('button.qa-btn-close').length).toBe(1);

            component.find('button').click();

            expect(component.find('div.c-panel').length).toBe(0);
            expect(component.find('button.qa-btn-close').length).toBe(0);
        });
    });

    describe('Styling', () => {
        it('always has a default styling', () => {
            var component = getComponent(true, true);

            expect(component.find('div').attr('class')).toContain('c-panel');
            expect(component.find('button').attr('class')).toContain('o-btn--close');
        });
        it('has an optional small size styling', () => {
            var component = getComponent(true, true, 'small');

            expect(component.find('div').attr('class')).toContain('c-panel');
            expect(component.find('div').attr('class')).toContain('c-panel--small');
        });
        it('has an optional tiny size styling', () => {
            var component = getComponent(true, true, 'tiny');

            expect(component.find('div').attr('class')).toContain('c-panel');
            expect(component.find('div').attr('class')).toContain('c-panel--tiny');
        });
        it('has an optional danger type styling', () => {
            var component = getComponent(true, true, false, 'danger');

            expect(component.find('div').attr('class')).toContain('c-panel');
            expect(component.find('button').attr('class')).toContain('o-btn--close');
            expect(component.find('div').attr('class')).toContain('c-panel--danger');
            expect(component.find('button').attr('class')).toContain('o-btn--close--danger');
        });
        it('has an optional warning type styling', () => {
            var component = getComponent(true, true, 'small', 'warning');

            expect(component.find('div').attr('class')).toContain('c-panel');
            expect(component.find('button').attr('class')).toContain('o-btn--close');
            expect(component.find('div').attr('class')).toContain('c-panel--warning');
            expect(component.find('button').attr('class')).toContain('o-btn--close--warning');
        });
        it('has an option to add additional classes', () => {
            var component = getComponent(true, true, 'tiny', 'warning', 'my-class an-other-class');

            expect(component.find('div').attr('class')).toContain('c-panel');
            expect(component.find('button').attr('class')).toContain('o-btn--close');
            expect(component.find('div').attr('class')).toContain('my-class an-other-class');
        });
    });
});
