describe('The orientation factory', function () {
    var orientation,
        store,
        ACTIONS,
        mockedViewer,
        mockedCamera;

    beforeEach(function () {
        angular.mock.module(
            'dpStraatbeeld',
            {
                store: {
                    dispatch: function () {}
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
                        return 100;
                    },
                    pitch: function () {
                        return 1;
                    },
                    fov: function () {
                        return 50;
                    }
                };
            }
        };

        mockedCamera = {
            heading: 180
        };

        spyOn(store, 'dispatch');
    });

    it('dispatches an ACTION based on orientation from the Marzipano viewer', function () {
        orientation.update(mockedViewer, mockedCamera, false);

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.STRAATBEELD_SET_ORIENTATION,
            payload: {
                heading: 280,
                pitch: 1,
                fov: 50
            }
        });
    });
});
