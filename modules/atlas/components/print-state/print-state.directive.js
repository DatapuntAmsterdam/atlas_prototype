(function () {
    angular
        .module('atlas')
        .directive('atlasPrintState', AtlasPrintStateDirective);

    AtlasPrintStateDirective.$inject = ['$rootScope', '$window'];

    function AtlasPrintStateDirective ($rootScope, $window) {
        return {
            restrict: 'A',
            scope: {
                isPrintMode: '='
            },
            link: linkFunction
        };

        function linkFunction (scope, element) {
            scope.$watch('isPrintMode', function (isPrintMode) {
                if (isPrintMode) {
                    element.addClass('is-print-mode');

                    $rootScope.$applyAsync(function () {
                        $window.print();
                    });
                } else {
                    element.removeClass('is-print-mode');
                }
            });
        }
    }
})();
/*
 Kaart en infopagina getoond: print infopagina (geldt ook voor login :-S)
 Kaart en (zoek)resultaten: print resultaten
 Kaart en detailpagina: print detailpagina (met kaart erboven als het kan)
 Kaart en panorama: print melding (met kaart erboven als het kan).
 Melding: “Het is momenteel niet mogelijk een panoramafoto af te drukken. Raadpleeg de Help in het Menu voor advies omtrent printen.”
 Kaartlagen en kaart: print kaartlagen (zal niet veel gebruikt worden maar vooral voor consistentie)
 Kaart full-screen: print kaart
 */