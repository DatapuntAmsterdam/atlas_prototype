import * as piwik from '../../../../src/shared/services/piwik-tracker/piwik-tracker';

describe('The dp-logo component', () => {
    let $compile,
        $rootScope;

    beforeEach(() => {
        angular.mock.module(
            'dpHeader',
            {
                store: {
                    dispatch: function () {}
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });

        spyOn(piwik, 'default').and.callFake(angular.noop);
    });

    function getComponent (size) {
        var component,
            element,
            scope;

        element = document.createElement('dp-logo');
        element.setAttribute('size', 'size');

        scope = $rootScope.$new();
        scope.size = size;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    describe('the short version', () => {
        let component;

        beforeEach(() => {
            component = getComponent('short');
        });

        it('has the short modifier on the root element', () => {
            expect(component.find('.qa-logo')[0].getAttribute('class')).toContain('c-logo--short');
            expect(component.find('.qa-logo')[0].getAttribute('class')).not.toContain('c-logo--tall');
        });

        it('shows the short logo image', () => {
            expect(component.find('.qa-logo__image')[0].getAttribute('src')).toContain('logo-short');
        });

        it('it handles piwik on ng-click', () => {
            component.find('.c-logo__link').click();
            expect(piwik.default).toHaveBeenCalledWith(['trackEvent', 'navigation', 'home', '']);
        });
    });

    describe('the tall version', () => {
        let component;

        beforeEach(() => {
            component = getComponent('tall');
        });

        it('has the tall modifier on the root element', () => {
            expect(component.find('.qa-logo')[0].getAttribute('class')).not.toContain('c-logo--short');
            expect(component.find('.qa-logo')[0].getAttribute('class')).toContain('c-logo--tall');
        });

        it('does not use grid layout', () => {
            expect(component.find('.qa-logo__image-col')[0].getAttribute('class')).not.toContain('u-col-sm--4');
            expect(component.find('.qa-logo__title-col')[0].getAttribute('class')).not.toContain('u-col-sm--8');
        });

        it('shows the tall logo image', () => {
            expect(component.find('.qa-logo__image')[0].getAttribute('src')).toContain('logo-tall');
        });
    });
});
