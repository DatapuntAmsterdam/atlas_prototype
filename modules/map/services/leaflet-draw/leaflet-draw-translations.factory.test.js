describe('The leafletDrawTranslations factory', () => {
    let L,
        leafletDrawTranslations;

    beforeEach(() => {
        angular.mock.module(
            'dpMap'
        );

        angular.mock.inject((_L_, _leafletDrawTranslations_) => {
            L = _L_;
            leafletDrawTranslations = _leafletDrawTranslations_;
        });
    });

    it('sets all L.drawLocal texts to ampty string', () => {
        expect(L.drawLocal.draw.toolbar.actions.title).not.toBe('');
        expect(L.drawLocal.draw.toolbar.actions.text).not.toBe('');

        L.drawLocal.test = 5;

        leafletDrawTranslations.initialize();

        // Test any arbitrary texts to be set to ''
        expect(L.drawLocal.draw.toolbar.actions.title).toBe('');
        expect(L.drawLocal.draw.toolbar.actions.text).toBe('');
    });

    it('Leaves all L.drawLocal non-string values untouched', () => {
        L.drawLocal.draw.toolbar.actions.title = 10;

        leafletDrawTranslations.initialize();

        // Test any arbitrary texts to be set to ''
        expect(L.drawLocal.draw.toolbar.actions.title).toBe(10);
        expect(L.drawLocal.draw.toolbar.actions.text).toBe('');
    });
});
