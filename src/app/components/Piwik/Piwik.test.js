describe('The piwik service', () => {
  it('should skip this test', () => {
    // TODO refactor, test piwik code
    expect(true).toBe(true);
  });

//   var $window,
//     $document,
//     piwik;
//
//   beforeEach(function () {
//     angular.mock.module(
//       'atlas',
//       {
//         environment: {
//           NAME: 'DEVELOPMENT'
//         }
//       },
//       function ($provide) {
//         $provide.constant('PIWIK_CONFIG', {
//           DEVELOPMENT: {
//             SITE_ID: 3
//           }
//         });
//       }
//     );
//
//     angular.mock.inject(function (_$window_, _$document_, _piwik_) {
//       $window = _$window_;
//       $document = _$document_;
//       piwik = _piwik_;
//     });
//   });
//
//   it('inserts a script tag into the DOM', function () {
//     var numberOfScripts,
//       piwikScript;
//
//     numberOfScripts = getScripts().length;
//
//     piwik.initialize();
//
//     // Checking values
//     expect($window._paq.length).toBe(3);
//     expect($window._paq).toEqual(
//       [['enableLinkTracking'],
//         ['setTrackerUrl', 'https://piwik.data.amsterdam.nl/piwik.php'],
//         ['setSiteId', 3]]);
//
//     piwikScript = getScripts()[0];
//     // Checking script
//     expect(getScripts().length).toBe(numberOfScripts + 1);
//     expect(piwikScript.getAttribute('type')).toBe('text/javascript');
//     expect(piwikScript.getAttribute('src')).toBe('https://piwik.data.amsterdam.nl/piwik.js');
//   });
//
//   function getScripts () {
//     return $document[0].getElementsByTagName('script');
//   }
});
