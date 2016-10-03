describe('The orientation factory', function () {
    var orientation,
        store,
        ACTIONS,
        mockedViewer;

    beforeEach(function () {
        angular.mock.module(
            'dpPanorama',
            {
                store: {
                    dispatch: function () { }
                },

                angleConversion: {
                    radiansToDegrees: function (val) { return val * 2; }
                }
            }

        );

        angular.mock.inject(function (_orientation_, _store_, _ACTIONS_) {
            orientation = _orientation_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        mockedViewer = {
            view: function () {
                return {
                    yaw: function () {
                        return 0.1;
                    },
                    pitch: function () {
                        return 0.2;
                    },
                    fov: function () {
                        return 0.3;
                    }
                };
            }
        };

        spyOn(store, 'dispatch');
    });

    it('dispatches an ACTION based on orientation from the Marzipano viewer', function () {
        orientation.update(mockedViewer);

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.PANORAMA_SET_ORIENTATION,
            payload: {
                heading: 0.2,
                pitch: 0.4,
                fov: 0.6
            }
        });
    });
});