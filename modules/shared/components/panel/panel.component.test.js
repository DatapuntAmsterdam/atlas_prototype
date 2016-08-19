describe('The dp-panel component', function () {
    var $compile,
        $rootScope;

    beforeEach(function () {
        angular.mock.module('dpShared');

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getComponent (heading, icon, content) {
        var component,
            panelElement,
            panelIconElement,
            panelBodyElement,
            scope;

        panelElement = document.createElement('dp-panel');
        panelElement.setAttribute('heading', heading);

        panelIconElement = document.createElement('dp-panel-icon');
        panelIconElement.appendChild(icon);
        panelElement.appendChild(panelIconElement);

        panelBodyElement = document.createElement('dp-panel-body');
        panelBodyElement.appendChild(content);
        panelElement.appendChild(panelBodyElement);

        scope = $rootScope.$new();

        component = $compile(panelElement)(scope);
        scope.$apply();

        return component;
    }

    it('creates a common HTML pattern (used by dp-layer-selection and the map legend)', function () {
        var component,
            iconHtml,
            bodyHtml;

        iconHtml = document.createElement('span');
        iconHtml.innerText = 'I_AM_AN_ICON';

        bodyHtml = document.createElement('p');
        bodyHtml.innerText = 'I_AM_A_PARAGRAPH';

        component = getComponent('I_AM_THE_PANEL_HEADING', iconHtml, bodyHtml);

        expect(component.find('.o-panel__heading').text()).toContain('I_AM_THE_PANEL_HEADING');
        expect(component.find('.o-panel__heading__icon').text()).toContain('I_AM_AN_ICON');
        expect(component.find('.o-panel__content').text()).toContain('I_AM_A_PARAGRAPH');
    });
});