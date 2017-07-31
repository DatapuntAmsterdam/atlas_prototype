((() => {
    'use strict';

    angular
        .module('dpShared')
        .constant('LONG_NAME_CONFIG', [
            {
                input: [
                    'Vereniging Van Eigenaars',
                    'Verenigingvan Eigenaars',
                    'Vereniging Van Huiseigenaren',
                    'Vereniging Van Eigenaren',
                    'Verenigingg Van Eigenaars',
                    'Vereniging Eigenaren',
                    'Vereniging van eigenaars',
                    'Vereniging Van Appartementseigenaars',
                    'Vereniging Van Eappartementseigenaren',
                    'Vereniging Voor Eigenaars',
                    'Vereniging Van Appartementseigenaren',
                    'Vereniging Eigenaars'
                ],
                output: 'VvE'
            }
        ]);
}))();
