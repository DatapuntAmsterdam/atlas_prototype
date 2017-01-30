describe('The leafletDrawTranslations factory', function () {
    let L,
        leafletDrawTranslations;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            $provide => {
                $provide.constant('LEAFLET_DRAW_TRANSLATIONS', {
                    draw: {
                        toolbar: {
                            actions: {
                                title: 'Tekenen annuleren',
                                text: 'Annuleren'
                            }
                        }
                    }
                });
            }
        );

        angular.mock.inject((_L_, _leafletDrawTranslations_) => {
            L = _L_;
            leafletDrawTranslations = _leafletDrawTranslations_;
        });
    });

    it('reads LEAFLET_DRAW_TRANSLATIONS and uses these values to set a global Leaflet variable', function () {
        expect(L.drawLocal.draw.toolbar.actions.title).toBe('Cancel drawing');
        expect(L.drawLocal.draw.toolbar.actions.text).toBe('Cancel');

        leafletDrawTranslations.initialize();

        expect(L.drawLocal.draw.toolbar.actions.title).toBe('Tekenen annuleren');
        expect(L.drawLocal.draw.toolbar.actions.text).toBe('Annuleren');
    });
});
