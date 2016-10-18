(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpTerugmeldenButton', {
            transclude: true,
            templateUrl: 'modules/header/components/terugmelden-button/terugmelden-button.html',
            controller: DpTerugmeldenButtonController,
            controllerAs: 'vm'
        });

    DpTerugmeldenButtonController.$inject = ['$window', '$location'];

    function DpTerugmeldenButtonController ($window, $location) {
        var vm = this,
            recipient,
            subject,
            body;

        recipient = 'terugmelding.basisinformatie@amsterdam.nl';
        subject = 'Terugmelding atlas.amsterdam.nl';
        body = 'Terugmeldingen voor de pagina: ' + $location.absUrl() + '\n\n' +
            'Beschrijf zo volledig mogelijk van welk onjuist gegeven je een melding wilt maken:\n' +
            '- Welk gegeven is kennelijk onjuist of ontbreekt?\n' +
            '- Weet je wat het wel zou moeten zijn?\n' +
            '- Waarop is jouw constatering gebaseerd? Omschrijf de reden en voeg indien mogelijk relevante ' +
            'documenten in de bijlage toe (bijvoorbeeld: een bouwtekening, koopakte, et cetera).';

        vm.mailtoLink = 'mailto:' + recipient +
            '?subject=' + $window.encodeURIComponent(subject) +
            '&body=' + $window.encodeURIComponent(body);
    }
})();
