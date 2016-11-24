// ((() => {
//     angular
//         .module('dpShared')
//         .factory('coordinateCompression', coordinateCompressionFactory);
//
//     function coordinateCompressionFactory () {
//         return {
//             convertCoordinate
//         };
//
//         function convertCoordinate (c) {
//             const base62 = {
//                 charset: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
//                 encode: function encode (integer) {
//                     if (integer === 0) {
//                         return 0;
//                     }
//
//                     let s = [];
//
//                     while (integer > 0) {
//                         s = [base62.charset[integer % 62]].concat([...s]);
//                         integer = Math.floor(integer / 62);
//                     }
//
//                     return s.join('');
//                 },
//                 decode: function decode (chars) {
//                     return chars
//                     .split('')
//                     .reverse()
//                     .reduce((prev, curr, i) => prev + base62.charset.indexOf(curr) * (Math.pow(62, i)), 0);
//                 }
//             };
//
//             function encodeDecodeCoordinate (coor) {
//                 let pow;
//                 let result;
//                 let inflated;
//                 const exp = 10000000;
//
//                 if (coor.length > 6) {
//                     pow = coor * exp;
//                     result = base62.encode(pow);
//                 } else {
//                     inflated = base62.decode(coor);
//                     result = Number(inflated) / exp;
//                 }
//                 return result;
//             }
//             return encodeDecodeCoordinate(c);
//         }
//     }
// }))();
