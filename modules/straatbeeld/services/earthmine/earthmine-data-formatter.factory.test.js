describe('The earthmine-data-formatter service', function () {
    var earthmineDataFormatter,
        input,
        output;

    beforeEach(function () {
        angular.mock.module(
            'dpStraatbeeld',
            {
                angleConversion: {
                    degreesToRadians: function (someInput) {
                        return someInput - 1;
                    }
                }
            }
        );

        angular.mock.inject(function (_earthmineDataFormatter_) {
            earthmineDataFormatter = _earthmineDataFormatter_;
        });

        input = {
            'pano-id': '1000014016370',
            timestamp: '2012-07-15 13:27:32',
            location: {
                lon: 4.9219423482803,
                lat: 52.37672892191
            },
            'pano-orientation': {
                yaw: 11.744057655334,
                pitch: 3.5506110191345
            },
            connections: [
                {
                    'relative-location': {
                        yaw: 1,
                        pitch: 2,
                        distance: 3
                    },
                    'pano-id': '1000014016369'
                },
                {
                    'relative-location': {
                        yaw: 7,
                        pitch: 8,
                        distance: 9
                    },
                    'pano-id': '1000014016371'
                }
            ]
        };

        output = earthmineDataFormatter.formatPanoramaState(input);
    });

    it('restructes data from earthmine', function () {
        expect(output.id).toBeDefined();
        expect(output.date).toBeDefined();
        expect(output.car.location).toEqual([52.37672892191, 4.9219423482803]);
    });

    it('converts the id from a String to a Number', function () {
        expect(angular.isString(input['pano-id'])).toBe(true);
        expect(input['pano-id']).toBe('1000014016370');

        expect(angular.isNumber(output.id)).toBe(true);
        expect(output.id).toBe(1000014016370);
    });

    it('converts the date from a String to a Date object', function () {
        expect(angular.isString(input.timestamp)).toBe(true);

        expect(angular.isDate(output.date)).toBe(true);
        expect(output.date.getFullYear()).toBe(2012);
        expect(output.date.getMonth()).toBe(6);
        expect(output.date.getDate()).toBe(15);
    });

    describe('hotspots', function () {
        it('convert the IDs from String to Number', function () {
            expect(output.hotspots[0].id).toBe(1000014016369);
            expect(output.hotspots[1].id).toBe(1000014016371);
        });

        it('converts the yaw and pitch from degrees to radians', function () {
            expect(output.hotspots[0].relativeLocation.yaw).toBe(0);
            expect(output.hotspots[0].relativeLocation.pitch).toBe(1);

            expect(output.hotspots[1].relativeLocation.yaw).toBe(6);
            expect(output.hotspots[1].relativeLocation.pitch).toBe(7);
        });

        it('has a distance property for each hotspot', function () {
            expect(output.hotspots[0].relativeLocation.distance).toBe(3);
            expect(output.hotspots[1].relativeLocation.distance).toBe(9);
        });
    });
});
