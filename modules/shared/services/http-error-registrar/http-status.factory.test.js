import {
    setGlobalError
} from '../../../../src/shared/ducks/error-message';

describe('The http-status component', function () {
    let httpStatus,
        $window;

    beforeEach(function () {
        angular.mock.module('dpShared', {});

        angular.mock.inject(function (_$window_, _httpStatus_) {
            $window = _$window_;
            httpStatus = _httpStatus_;
        });

        $window.reduxStore = {
            dispatch: jasmine.createSpy('dispatch')
        };
    });

    it('captures error messages', () => {
        const message = 'my message';
        httpStatus.logResponse(message);
    });

    it('captures error messages status codes', () => {
        const message = 'my message';
        const code = 404;
        httpStatus.logResponse(message, code);
    });

    it('sets the error type given', () => {
        const errorType = 'foo';
        httpStatus.registerError(errorType);
        expect($window.reduxStore.dispatch).toHaveBeenCalledWith(
            setGlobalError(errorType)
        );
    });

    it('should do nothing when the reduxStore dispatch is not defined', () => {
        $window.reduxStore = {
            dispatch: null
        };
        httpStatus.registerError('');
    });
});
